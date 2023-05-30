import configparser
import os
import sys
from unittest import mock
from unittest.mock import patch

import pytest
from dotenv import load_dotenv
from kafka.errors import NoBrokersAvailable, NodeNotReadyError, TopicAlreadyExistsError

project_path = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]
sys.path.append(project_path)
import run_scanning
import setup_acl


@pytest.fixture(scope='module')
def admin_client_mock():
    admin_client = mock.MagicMock()
    admin_client.create_topics.side_effect = TopicAlreadyExistsError
    admin_client.create_acls.return_value = {'succeeded': 'all', 'failed': []}
    return admin_client


@pytest.fixture()
def dummy_topics_file():
    topics = ['python_test_topic']
    with open(f"{os.environ['LOGS_DIR']}topics.txt", "w") as topics_file:
        topics_file.writelines(f"{topic}\n" for topic in topics)

    yield

    os.remove('topics.txt')


@pytest.fixture(scope='module')
def real_admin_client():
    kafka_server = run_scanning.get_kafka_server()
    return run_scanning.get_admin_client(kafka_server)


@pytest.fixture()
def closed_ble_socket():
    # We do not need to open ble socket while testing main while loop

    with patch.object(run_scanning.BleConnection, '__init__') as ble_mock:
        ble_mock.return_value = None
        yield ble_mock


@pytest.fixture(scope='module')
def errors():
    return NoBrokersAvailable, NodeNotReadyError, ValueError, AssertionError


@pytest.fixture(scope='module', autouse=True)
def log_dir():
    os.environ['LOGS_DIR'] = project_path + '/'


@pytest.fixture(scope='module', autouse=True)
def beacons_env():
    os.chdir(project_path)
    load_dotenv('BEACONS.env')
    return dict(os.environ)


@pytest.fixture(scope='module')
def list_of_necessary_env_fields():
    return ['CONNECT_TO',
            'RECONNECT_TIMEOUT',
            'INITIAL_SCAN_TIME',
            'SCAN_LOOPS_COUNT',
            'LOGGING_LEVEL',
            'LOGS_DIR',
            'ADMIN_USER',
            'ADMIN_PASSWORD']


@pytest.fixture(scope='module')
def host_name():
    return setup_acl.get_host_name()


@pytest.fixture(scope='module')
def list_of_necessary_kafka_files():
    return ['server.properties',
            'kafka_server_jaas.conf',
            'zookeeper_server_jaas.conf']


@pytest.fixture(scope='module')
def list_of_project_files(list_of_necessary_kafka_files):
    project_files = {}

    for path, _, dir_files in os.walk(project_path):
        for filename in dir_files:
            project_files[filename] = os.path.join(path, filename)

    return project_files


@pytest.fixture(scope='module')
def server_properties(list_of_project_files):
    server_prop_config = configparser.ConfigParser()

    def read_properties_file(filepath):
        # Add a dummy section in order to use ConfigParser
        with open(filepath, 'r') as f:
            return '[dummy_section]\n' + f.read()

    properties_file = read_properties_file(list_of_project_files['server.properties'])
    server_prop_config.read_string(properties_file)
    return server_prop_config._sections['dummy_section']


def parse_conf_file(filepath, filename) -> dict:
    """
    Here we extract the data from Kafka config files.
    Since I didn't find a way to parse jaas.conf files I created my own parser.
    """

    with open(filepath, 'r') as jaas:
        jaas_row_list = jaas.readlines()

    if not jaas_row_list:
        raise ValueError(f'Empty {filename}!')

    setting_fields = {}
    # Next terrible construction serves to find where JAAS fields start and end
    # JAAS fields examples: KafkaServer {}, Client {}
    for r_n, row in enumerate(jaas_row_list):
        if '{' in row:
            setting_fields[row.split(' ')[0]] = [r_n + 1]
        if '}' in row:
            setting_fields[list(setting_fields.keys())[-1]].append(r_n)

    if not setting_fields:
        raise ValueError(f"Custom parser couldn't extract settings from {filename}")

    for field in setting_fields:
        rows_range = setting_fields[field]
        rows_for_current_field = [jaas_row_list[row] for row in range(rows_range[0], rows_range[1])]

        field_key_value_pairs = {}

        for jaas_param_row in rows_for_current_field:
            jaas_key = jaas_param_row.split('=')[0].replace(' ', '')
            try:
                jaas_value = jaas_param_row.split('=')[1].replace('"', '').replace('\n', '').replace(';', '')
            except IndexError:
                # it means it is not a key-value pair
                jaas_value = None

            field_key_value_pairs[jaas_key] = jaas_value

        setting_fields[field] = field_key_value_pairs

    return setting_fields


@pytest.fixture(scope='module')
def kafka_server_jaas_conf(list_of_project_files):
    filename = 'kafka_server_jaas.conf'
    return parse_conf_file(list_of_project_files[filename], filename)


@pytest.fixture(scope='module')
def zookeeper_server_jaas_conf(list_of_project_files):
    filename = 'zookeeper_server_jaas.conf'
    return parse_conf_file(list_of_project_files[filename], filename)
