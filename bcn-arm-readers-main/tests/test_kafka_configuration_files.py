import os
import sys
from test_environmental_file import test_if_all_necessary_fields_are_present_in_env_file

import pytest

project_path = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]
sys.path.append(project_path)


def test_if_all_necessary_config_files_are_in_place(list_of_necessary_kafka_files, list_of_project_files):
    for necessary_file in list_of_necessary_kafka_files:
        assert necessary_file in list_of_project_files


@pytest.mark.dependency(name='kafka_is_complete')
@pytest.mark.parametrize('field', ('KafkaServer', 'Client'))
def test_if_kafka_server_jaas_is_complete(kafka_server_jaas_conf, field):
    err_str = f'No {field} in kafka_server_jaas.conf!'
    assert field in kafka_server_jaas_conf, err_str


@pytest.mark.dependency(depends=['kafka_is_complete'])
def test_if_kafka_server_has_host_machine_credentials(host_name, kafka_server_jaas_conf):
    err_str = f'No credentials for {host_name}'
    assert f'user_{host_name}' in kafka_server_jaas_conf['KafkaServer'], err_str


@pytest.mark.dependency()
def test_if_server_properties_has_super_users(server_properties):
    err_str = 'server.properties has no super users!'
    assert 'super.users' in server_properties, err_str


@pytest.mark.dependency(depends=['test_if_server_properties_has_super_users',
                                 'BEACONS_env_is_complete'])
def test_if_super_users_names_are_the_same(beacons_env, server_properties):
    err_str = 'Admin usernames do not match in config files!'
    assert beacons_env['ADMIN_USER'] in server_properties['super.users'], err_str


@pytest.mark.dependency(depends=['test_if_kafka_server_has_host_machine_credentials',
                                 'BEACONS_env_is_complete',
                                 'test_if_super_users_names_are_the_same'])
def test_if_super_user_passwords_are_the_same(beacons_env, kafka_server_jaas_conf, host_name):
    err_str = 'Admin passwords do not match in config files!'
    super_user_name = f'user_{beacons_env["ADMIN_USER"]}'
    assert beacons_env['ADMIN_PASSWORD'] == kafka_server_jaas_conf['KafkaServer'][super_user_name], err_str


@pytest.mark.dependency(name='zookeeper_is_complete')
@pytest.mark.parametrize('config_param', ('QuorumServer', 'QuorumLearner', 'Server'))
def test_if_zookeeper_config_is_complete(zookeeper_server_jaas_conf, config_param):
    err_str = f'{config_param} is not present in zookeeper_server_jaas.conf'
    assert config_param in zookeeper_server_jaas_conf, err_str


@pytest.mark.dependency(depends=['zookeeper_is_complete',
                                 'kafka_is_complete'])
def test_if_kafka_and_zookeeper_have_same_user(kafka_server_jaas_conf, zookeeper_server_jaas_conf):
    kafka_broker_name = kafka_server_jaas_conf['Client']['username']

    err_str = f"kafka_server_jaas.conf Client username is different from Server user from zookeeper_server_jaas.conf"
    assert f'user_{kafka_broker_name}' in zookeeper_server_jaas_conf['Server'], err_str


@pytest.mark.dependency(depends=['zookeeper_is_complete',
                                 'kafka_is_complete'])
def test_if_kafka_and_zookeeper_have_same_password(kafka_server_jaas_conf, zookeeper_server_jaas_conf):
    kafka_broker_name = kafka_server_jaas_conf['Client']['username']
    kafka_broker_pass = kafka_server_jaas_conf['Client']['password']

    err_str = f"kafka_server_jaas.conf Client password is different from Server user from zookeeper_server_jaas.conf"
    assert kafka_broker_pass == zookeeper_server_jaas_conf['Server'][f'user_{kafka_broker_name}'], err_str

