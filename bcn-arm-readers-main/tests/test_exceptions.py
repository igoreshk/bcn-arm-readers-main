import datetime
import os
import sys
from unittest.mock import patch
import mock
import pytest
from freezegun import freeze_time
from kafka.errors import KafkaConnectionError, KafkaTimeoutError, NoBrokersAvailable
from timeout_decorator import timeout, TimeoutError

project_path = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]
sys.path.append(project_path)
import run_scanning
import setup_acl


def test_function_check_if_broker_is_disconnected():
    # Arrange

    admin_client_mock = mock.MagicMock()
    admin_client_mock.list_topics.side_effect = KafkaConnectionError

    # Act
    obj = run_scanning.check_if_broker_is_connected(admin_client_mock)

    # Assert
    assert obj is False


@pytest.mark.parametrize('topics, flag', [(['topic1', 'topic2'], True), ([], False)])
def test_function_check_if_broker_is_connected(topics, flag):
    # Arrange

    admin_client_mock = mock.MagicMock()
    admin_client_mock.list_topics.return_value = topics

    # Act
    obj = run_scanning.check_if_broker_is_connected(admin_client_mock)

    # Assert
    assert obj is flag


@patch('run_scanning.prepare_response_for_kafka')
@patch.object(run_scanning.BeaconResponseParser, 'parse_events')
def test_function_scan_and_report_when_broker_is_connected(parse_events_mock, response_function_mock):
    # Arrange
    topics = ['beacon1', 'beacon2']

    producer = mock.MagicMock()
    producer.send.side_effect = KafkaTimeoutError

    admin_client_mock = mock.MagicMock()
    admin_client_mock.list_topics.return_value = topics

    parse_events_mock.return_value = topics
    response_function_mock.return_value = {'topic': topics[0], 'value': 'mock_value'}

    # Act
    obj = run_scanning.scan_and_report(mock.MagicMock(),
                                       producer,
                                       run_scanning.BeaconResponseParser(),
                                       topics,
                                       admin_client_mock)

    # Assert we call all the methods exactly once and the while loop breaks
    # just after KafkaTimeoutError is thrown.
    admin_client_mock.list_topics.assert_called_once()
    parse_events_mock.assert_called_once()
    response_function_mock.assert_called_once()
    producer.send.assert_called_once_with(topics[0], 'mock_value')


@patch.object(run_scanning.BeaconResponseParser, 'parse_events')
def test_function_scan_and_report_when_broker_is_disconnected(parse_events_mock):
    # Arrange
    admin_client_mock = mock.MagicMock()
    admin_client_mock.list_topics.side_effect = KafkaConnectionError

    # Act
    obj = run_scanning.scan_and_report(mock.MagicMock(),
                                       mock.MagicMock(),
                                       run_scanning.BeaconResponseParser(),
                                       ['t1', 't2'],
                                       admin_client_mock)

    # Assert we broke the while loop and return to run_scanning.main while loop where
    # we can reconnect
    parse_events_mock.assert_not_called()


@timeout(1)
@patch('run_scanning.prepare_response_for_kafka')
@patch.object(run_scanning.BeaconResponseParser, 'parse_events')
def test_found_beacon_which_is_not_in_allowed_list(parse_events_mock, response_function_mock):
    # Arrange
    topics = ['allowed_beacon1', 'allowed_beacon2']

    producer = mock.MagicMock()
    producer.send.side_effect = None

    admin_client_mock = mock.MagicMock()
    admin_client_mock.list_topics.return_value = topics

    parse_events_mock.return_value = topics
    response_function_mock.return_value = {'topic': 'sneaky_topic', 'value': 'mock_value'}

    # Act
    with pytest.raises(TimeoutError):
        run_scanning.scan_and_report(mock.MagicMock(),
                                     producer,
                                     run_scanning.BeaconResponseParser(),
                                     topics,
                                     admin_client_mock)

    # Assert that we never send data from unregistered beacons
    producer.send.assert_not_called()


@timeout(0.1)
def running_our_code():
    # run_scanning writes to the log if one of known exceptions occur. Stop
    # and exit on the first reconnect attempt
    run_scanning.main()


@patch('run_scanning.os.path.isfile')
def test_no_env_file(env_file_mock):
    # Arrange
    env_file_mock.return_value = False

    # Act and assert
    with pytest.raises(SystemExit):
        run_scanning.main()


@patch.object(run_scanning.BleConnection, '__init__')
def test_bluetooth_socket(init_ble_socket_mock):
    # Arrange
    init_ble_socket_mock.side_effect = OSError

    # Act and assert
    with pytest.raises(SystemExit):
        run_scanning.main()


def test_get_admin_client_function_with_no_broker():
    # Arrange
    kafka_server = 'there is no server'

    # Act and assert

    with pytest.raises(NoBrokersAvailable):
        run_scanning.get_admin_client(kafka_server)


@patch('run_scanning.get_admin_client')
def test_admin_client_from_main_while_loop(mock, errors, closed_ble_socket):
    # Arrange
    mock.side_effect = errors

    for e in errors:
        # Act and assert that it raises exception
        with pytest.raises(TimeoutError):
            running_our_code()


@patch('run_scanning.get_admin_client')
@patch.object(run_scanning.Producer, '__init__')
def test_producer_from_main_while_loop(producer_mock, admin_client_mock, errors, closed_ble_socket):
    # Arrange
    producer_mock.side_effect = errors
    admin_client_mock.return_value = None

    for e in errors:
        # Act and assert that it raises exception
        with pytest.raises(TimeoutError):
            running_our_code()


@patch('run_scanning.create_topics_and_authorize_users')
@patch('run_scanning.get_admin_client')
@patch.object(run_scanning.Producer, '__init__')
def test_create_topics_func_from_main_while_loop(producer_mock, admin_client_mock, topics_mock, errors,
                                                 closed_ble_socket):
    # Arrange
    producer_mock.return_value = None
    admin_client_mock.return_value = None
    topics_mock.side_effect = errors

    for e in errors:
        # Act and assert that it raises exception
        with pytest.raises(TimeoutError):
            running_our_code()


@freeze_time("2022-01-31")
def test_prepare_response_function(host_name):
    # Arrange
    expected_beacons_data = 'fa:6f:ff:3d:15:02,4c 00 02 15 3d 37 03 f6 64 ,5437,14083,-100,-1,61,360,25846'
    dummy_timestamp = datetime.datetime.now().strftime("%s")

    expected_func_return = {'topic': 'fa6fff3d1502',
                            'value': f'{host_name} {dummy_timestamp} 5437 14083 -100 -1 61 360 25846',
                            'beacon_track_data': ' 5437 14083 -100 -1 61 360 25846',
                            'hostname': f'{host_name}'}

    # Act
    func_return = setup_acl.prepare_response_for_kafka(expected_beacons_data)

    assert func_return == expected_func_return


@patch('setup_acl.prepare_response_for_kafka')
@patch.object(run_scanning.BeaconResponseParser, 'parse_events')
def test_if_file_with_topics_never_existed(parse_events_function, prepare_response_func_mock, host_name,
                                           admin_client_mock):
    # Arrange
    os.environ['INITIAL_SCAN_TIME'] = '1'
    os.environ['RECONNECT_TIMEOUT'] = '0'

    parse_events_function.return_value = ['good response']
    prepare_response_func_mock.return_value = {"topic": 'topic1',
                                               "value": 'important data',
                                               "beacon_track_data": 'some numbers',
                                               "hostname": host_name}

    logs_dir = os.getenv('LOGS_DIR')

    # Act
    setup_acl.create_topics_and_authorize_users(admin_client_mock,
                                                run_scanning.BeaconResponseParser(),
                                                mock.MagicMock(),
                                                logs_dir)

    # Assert
    topics_file = f'{logs_dir}topics.txt'
    assert os.path.isfile(topics_file)
    os.remove(topics_file)


@patch.object(run_scanning.BeaconResponseParser, 'parse_events')
def test_if_file_with_topics_already_exists(parse_events_function, dummy_topics_file, admin_client_mock):
    # Arrange
    logs_dir = os.getenv('LOGS_DIR')

    # Act
    setup_acl.create_topics_and_authorize_users(admin_client_mock,
                                                run_scanning.BeaconResponseParser(),
                                                mock.MagicMock(),
                                                logs_dir)

    # Assert
    parse_events_function.assert_not_called()
