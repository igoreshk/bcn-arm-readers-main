"""
This is a main file. Performs scanning for beacons and send received data (including rssi) to Kafka.
"""
from platform import system
import sys
import logging
import time
from kafka.errors import (
    NoBrokersAvailable,
    KafkaTimeoutError,
    KafkaConnectionError,
    NodeNotReadyError,
)
from kafka_service import Producer
from kafka import KafkaAdminClient
from beacon_response_parse import BeaconResponseParser
from ble_connect import BleConnection
import os
from dotenv import load_dotenv
from setup_acl import (
    create_topics_and_authorize_users,
    prepare_response_for_kafka,
    get_host_name,
)
import socket


def get_admin_client(kafka_server):
    admin_client = KafkaAdminClient(
        bootstrap_servers=kafka_server,
        security_protocol="SASL_PLAINTEXT",
        sasl_mechanism="PLAIN",
        sasl_plain_username=os.getenv("ADMIN_USER"),
        sasl_plain_password=os.getenv("ADMIN_PASSWORD"),
    )
    return admin_client


def get_kafka_server():
    # To be used in tests
    if os.getenv("CONNECT_TO") != "LOCAL":
        return os.getenv(os.getenv("CONNECT_TO"))
    return os.getenv("LOCAL")


def check_if_broker_is_connected(admin_client):
    # Check if a broker is online and there are some topics
    try:
        topics_on_broker_now = admin_client.list_topics()
    except KafkaConnectionError:
        logging.exception("Broker is disconnected!")
        return False
    else:
        if topics_on_broker_now:
            return True
        return False


def scan_and_report(
    connection: BleConnection,
    producer: Producer,
    parser: BeaconResponseParser,
    topics: list,
    admin_client: KafkaAdminClient,
):
    """
    The upper level function.
    Performs scanning for beacons using given connection interface, parses received data with the parser
    and send the data with the producer interface
    :param connection: a connection interface, expected method 'sock'
    :param producer: a producer interface, expected method 'send'
    :param parser: a parser interface, expected method 'parse_events'
    :param topics: list of previously discovered beacons
    """

    while True:
        if not check_if_broker_is_connected(admin_client):
            break

        # Get a fresh beacons track data
        discovered_beacons = parser.parse_events(
            connection.sock, int(os.getenv("SCAN_LOOPS_COUNT"))
        )

        # Prepare beacon response for kafka
        for beacon_response in discovered_beacons:
            if beacon_response:
                try:
                    prepared_response = prepare_response_for_kafka(beacon_response)
                    if prepared_response["topic"] not in topics:
                        continue

                    producer.send(
                        prepared_response["topic"], prepared_response["value"]
                    )
                    logging.info(
                        "Received track data {0} from host {1} was sent to topic {2}".format(
                            prepared_response["beacon_track_data"],
                            prepared_response["hostname"],
                            prepared_response["topic"],
                        )
                    )

                    sys.stdout.flush()  # To flush output buffer

                except KafkaTimeoutError as err_msg:
                    # Get out of the while loop since a broker is probably down. Then wait until kafka server starts.
                    logging.exception(
                        f"Producer couldn't send the data: \nBeacon's response: {beacon_response}\nMessage: {err_msg}"
                    )
                    break
        else:
            continue
        break


def main():
    env_file = "BEACONS.env" if get_host_name() == "local" else "/iscan3/BEACONS.env"

    if os.path.isfile(env_file):
        load_dotenv(env_file)
    else:
        logging.exception(f"No environmental variables! " f"\nEnv. file = {env_file}")
        sys.exit(1)

    kafka_server = get_kafka_server()
    host_name = get_host_name()

    reconnect_timeout = int(os.getenv("RECONNECT_TIMEOUT"))

    logs_directory = os.getenv("LOGS_DIR")

    if not os.path.isdir(logs_directory):
        os.mkdir(logs_directory)

    logging.basicConfig(
        filename=f"{logs_directory}application.log",
        level=os.getenv("LOGGING_LEVEL")
        if os.path.isfile(env_file)
        else logging.DEBUG,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%b-%d-%y %H:%M:%S",
    )

    try:
        ble_connection = BleConnection()
        ble_parser = BeaconResponseParser()
        logging.info("Opened Bluetooth socket")
    except OSError:
        logging.exception("Error occurred while accessing bluetooth device")
        sys.exit(1)

    while True:
        try:
            kafka_admin = get_admin_client(kafka_server)
            kafka_producer = Producer(kafka_server, host_name=host_name)
            create_topics_and_authorize_users(
                kafka_admin, ble_parser, ble_connection, logs_directory
            )
        except NoBrokersAvailable:
            logging.exception("No brokers available")
        except NodeNotReadyError:
            logging.exception("Node is not ready")
        except ValueError:
            logging.exception("KafkaClient is down")
        except AssertionError as e:
            logging.exception(f"Broker is probably down: \n{e}")
        else:

            with open(f"{logs_directory}topics.txt", "r") as topics_file:
                topics = topics_file.read().splitlines()

            scan_and_report(
                ble_connection, kafka_producer, ble_parser, topics, kafka_admin
            )
        finally:
            time.sleep(reconnect_timeout)


if __name__ == "__main__":
    main()
