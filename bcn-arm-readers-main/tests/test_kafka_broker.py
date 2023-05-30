"""
These tests should be run if a kafka broker is online.
The code itself is tested in test_exceptions.py.
"""
import os
import subprocess
import sys
import mock
import pytest
from timeout_decorator import timeout, TimeoutError

project_path = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]
sys.path.append(project_path)
import run_scanning


@pytest.mark.dependency(name='code_is_fine')
@pytest.mark.parametrize('test', ['test_environmental_file.py',
                                  'test_kafka_configuration_files.py',
                                  'test_exceptions.py'])
def test_if_code_is_fine(test):
    # Arrange and Act
    process_status_code = subprocess.call(f'sudo pytest {project_path}/tests/{test}', shell=True)

    # Assert all test are passed
    assert process_status_code == 0


@pytest.mark.dependency(name='broker_is_online', depends=['code_is_fine'])
def test_if_broker_is_online(real_admin_client, caplog):
    # Arrange and Act
    run_scanning.check_if_broker_is_connected(real_admin_client)

    assert 'Broker is disconnected!' not in caplog.text


@timeout(3)
@pytest.mark.dependency(depends=['code_is_fine', 'broker_is_online'])
@mock.patch("run_scanning.get_admin_client")
def test_connection_with_wrong_credentials(mock_get_admin_client, beacons_env, closed_ble_socket, host_name):
    """
    Here we change password for the user and mock admin client. There should be some errors
    in the Kafka broker log with failed authentication message.
    """
    # Arrange
    os.environ['RECONNECT_TIMEOUT'] = '1'
    mock_get_admin_client.side_effect = None
    os.environ[f"USER_{host_name}"] = "wrong-password"

    # Act and assert
    with pytest.raises(TimeoutError):
        run_scanning.main()


@pytest.mark.dependency(depends=['code_is_fine', 'broker_is_online'])
def test_creating_acl(caplog, real_admin_client, dummy_topics_file):
    # Arrange
    logs_dir = os.getenv('LOGS_DIR')

    # Act
    run_scanning.create_topics_and_authorize_users(real_admin_client,
                                                   mock.MagicMock(),
                                                   mock.MagicMock(),
                                                   logs_dir)

    # Assert that there are no failed ACL requests
    assert 'ACL failed' not in caplog.text
