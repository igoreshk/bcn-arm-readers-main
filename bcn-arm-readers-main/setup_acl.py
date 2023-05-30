import os.path
from kafka.admin import (
    KafkaAdminClient,
    NewTopic,
    ACL,
    ACLPermissionType,
    ResourcePattern,
    ResourceType,
    ACLOperation,
)
from kafka.errors import TopicAlreadyExistsError
from beacon_response_parse import BeaconResponseParser
from ble_connect import BleConnection
import logging
import time
from typing import Dict
import datetime
import socket


def get_host_name():
    # To be used in tests
    full_machine_name = socket.gethostname()

    return (
        full_machine_name.split(".")[0] if "blescan" in full_machine_name else "local"
    )


def prepare_response_for_kafka(beacon_response: str) -> Dict[str, str]:
    """
    Prepares given beacon response to be sent to kafka, defines a topic to send, makes a timestamp
    About data format to Kafka:
    https://kb.epam.com/display/EPMLSTR/Data+format+from+reader+to+Kafka+server
    :param beacon_response: advertised data of a tracked beacon
    :return: the dictionary with topic (id of the tracked beacon), value (significant for the track information),
    beacon_track_data (track information itself: tx-power, rssi, steps count, heart rate, temperature), hostname
    (name of the current raspberry pi)
    """
    response = beacon_response.split(",")
    topic = response[0].replace(":", "")
    beacon_track_data = " " + " ".join(response[2:9])
    timestamp = datetime.datetime.now().strftime("%s")
    hostname = get_host_name()
    value = hostname + " " + timestamp + beacon_track_data

    return {
        "topic": topic,
        "value": value,
        "beacon_track_data": beacon_track_data,
        "hostname": hostname,
    }


def create_topics_and_authorize_users(
    admin_client: KafkaAdminClient,
    ble_parser: BeaconResponseParser,
    ble_connection: BleConnection,
    logs_directory: str,
):
    """
    Here we scan for beacons and create topics based on beacons' names.
    Then ACL is created for raspberry machine which runs this script.

    ACL - access control lists. These lists are responsible for handling
    authorization process. A list stores information which defines who
    can access certain topics and what rights these users have.

    Kafka broker configuration can be found in:
        ~/kafka-settings/to-kafka-broker/server.properties

    This file contains following fields:
        1. allow.everyone.if.no.acl.found=false - meaning if there is no
        topic in ACL list then no one can create a new topic except superusers.
        We have to create topics first using superuser credentials and then
        allow users to write in these topics.

        2. authorizer.class.name=kafka.security.authorizer.AclAuthorizer -
        this is a type of authorizer that should be used when working with
        kafkacat (kcat).

    Kafka broker indicates us (in its logs) that there have been changes made.
    For instance:
        INFO Processing Acl change notification for ResourcePattern(resourceType=TOPIC,
        name=fa6fff3d1502, patternType=LITERAL), versionedAcls : Set(User:local has ALLOW
        permission for operations: WRITE from hosts: *, User:local has ALLOW permission for
        operations: CREATE from hosts: *), zkVersion : 0 (kafka.security.authorizer.AclAuthorizer)
    """

    # Extract config from env. variables
    reconnect_timeout = int(os.getenv("RECONNECT_TIMEOUT"))
    initial_scan_time = int(os.getenv("INITIAL_SCAN_TIME"))
    scan_loops_count = int(os.getenv("SCAN_LOOPS_COUNT"))

    raspberry_host_name = get_host_name()

    topics = []

    if not os.path.isfile(f"{logs_directory}topics.txt"):
        for i in range(initial_scan_time):
            discovered_beacons = ble_parser.parse_events(
                ble_connection.sock, scan_loops_count
            )

            for beacon_response in discovered_beacons:

                if beacon_response:
                    prepared_response = prepare_response_for_kafka(beacon_response)

                    if prepared_response["topic"] not in topics:
                        topics.append(prepared_response["topic"])
                        logging.info(f"Found beacon: {topics[-1]}")

            time.sleep(reconnect_timeout)

        # Write discovered beacons to the file
        with open(f"{logs_directory}topics.txt", "w") as topics_file:
            topics_file.writelines(f"{topic}\n" for topic in topics)
    else:
        # Load discovered beacons from file
        with open(f"{logs_directory}topics.txt", "r") as topics_file:
            topics += topics_file.read().splitlines()

    # Create topics on kafka broker
    topic_list = [
        NewTopic(name=str(topic), num_partitions=1, replication_factor=1)
        for topic in topics
    ]
    try:
        admin_client.create_topics(new_topics=topic_list, validate_only=False)
    except TopicAlreadyExistsError:
        pass

    # Create ACL
    acls_requests = []
    for topic in topics:
        acls_requests += [
            ACL(
                principal=f"User:{raspberry_host_name}",
                host="*",
                operation=operation,
                permission_type=ACLPermissionType.ALLOW,
                resource_pattern=ResourcePattern(ResourceType.TOPIC, f"{topic}"),
            )
            for operation in (ACLOperation.WRITE, ACLOperation.CREATE)
        ]

    result = admin_client.create_acls(acls_requests)
    if result["failed"]:
        logging.exception(f'Kafka-python ACL failed: {result["failed"]}')
