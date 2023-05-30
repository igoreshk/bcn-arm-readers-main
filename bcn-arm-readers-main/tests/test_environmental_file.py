import os
import sys
import pytest

project_path = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]
sys.path.append(project_path)


@pytest.mark.dependency(name='BEACONS_env_is_complete')
def test_if_all_necessary_fields_are_present_in_env_file(beacons_env, list_of_necessary_env_fields):
    for key in list_of_necessary_env_fields:
        assert key in beacons_env and os.getenv(key) is not None, f'No {key} in environmental file!'


@pytest.mark.dependency(depend=['BEACONS_env_is_complete'])
def test_connect_to(beacons_env):
    err_str = f'Wrong value of CONNECT_TO field: no {os.getenv("CONNECT_TO")} in env. file!'
    assert os.getenv(os.getenv('CONNECT_TO')) is not None, err_str


@pytest.mark.parametrize('env_var', ('RECONNECT_TIMEOUT',
                                     'INITIAL_SCAN_TIME',
                                     'SCAN_LOOPS_COUNT'))
def test_scan_variables(beacons_env, env_var):
    err_str = f"\n{env_var} env. value equals to zero!"
    assert int(os.getenv(env_var)) != 0, err_str


def test_log_directory(beacons_env):
    log_dir = os.getenv('LOGS_DIR')
    if not os.path.exists(log_dir):
        os.mkdir(log_dir)
    else:
        test_file = log_dir + 'test_file.txt'
        with open(test_file, 'w') as file:
            assert file.write('PERMISSION TEST !') != 0
        os.remove(test_file)
