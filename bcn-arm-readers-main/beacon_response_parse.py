"""
Provides parsing service for the advertising packets of bluetooth devices with a class BeaconResponseParser

NOTE: Python's struct.pack() will add padding bytes unless you make the endianness explicit. Little endian
should be used for BLE. Always start a struct.pack() format string with "<"
"""

import struct
import bluetooth._bluetooth as bluetooth
from bluetooth import BluetoothSocket
import logging
import helpers
from typing import Tuple
import os


class BeaconResponseParser:
    """
    Provides methods for parsing beacon advertising packets received by inquiring through bluetooth.
    The start point -- parse_events method
    """

    # Codes of events, commands and parameters
    LE_META_EVENT = 0x3E
    LE_PUBLIC_ADDRESS = 0x00
    LE_RANDOM_ADDRESS = 0x01

    # These are actually subevents of LE_META_EVENT
    EVT_LE_CONN_COMPLETE = 0x01
    EVT_LE_ADVERTISING_REPORT = 0x02
    EVT_LE_CONN_UPDATE_COMPLETE = 0x03
    EVT_LE_READ_REMOTE_USED_FEATURES_COMPLETE = 0x04

    # Advertisement event types
    ADV_IND = 0x00
    ADV_DIRECT_IND = 0x01
    ADV_SCAN_IND = 0x02
    ADV_NONCONN_IND = 0x03
    ADV_SCAN_RSP = 0x04

    CONSTANT_RSSI = -1

    beacon_header = {
        "packet_type": 0,
        "event": 1,
        "packet_length": 2,
        "subevent": 3,
        "body start": 4,
    }

    type_id_frames = (14, 18)

    def __init__(self):

        self.DEBUG = os.getenv("DEBUG") == "1"
        self.set_blacklist()

    @classmethod
    def set_blacklist(cls):
        """
        Sets a blacklist of bluetooth devices not to inquire them
        """
        cls.bluetooth_device_addresses_blacklist = [
            [0x15, 0xA2, 0x8A, 0x37, 0x33, 0xD4],
            [0xBD, 0xF2, 0xCC, 0x2E, 0xB3, 0xFD],
        ]

    def parse_events(self, sock: BluetoothSocket, loop_count: int):
        """
        Perform a device inquiry on bluetooth device #0
        The inquiry should last 8 * 1.28 = 10.24 seconds
        before the inquiry is performed, bluez should flush its cache of
        previously discovered devices

        :param sock: a bluetooth socket object
        :param loop_count:
        :return: list of parsed events
        """

        old_filter = sock.getsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, 14)
        filter_rule = bluetooth.hci_filter_new()
        bluetooth.hci_filter_all_events(filter_rule)
        bluetooth.hci_filter_set_ptype(filter_rule, bluetooth.HCI_EVENT_PKT)
        sock.setsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, filter_rule)

        parsed_events_list = []
        for i in range(0, loop_count):
            packet = sock.recv(255)
            packet_type, event, packet_length = struct.unpack("BBB", packet[:3])

            if self.DEBUG:
                logging.debug(
                    f"------paket_type:::event:::paket_len--------\n{packet_type}:::{event}:::{packet_length}"
                )

            if event == bluetooth.EVT_INQUIRY_RESULT_WITH_RSSI:
                logging.debug(
                    "if event == bluetooth.EVT_INQUIRY_RESULT_WITH_RSSI: reached inner scope"
                )
            elif event == bluetooth.EVT_NUM_COMP_PKTS:
                logging.debug(
                    "if event == bluetooth.EVT_NUM_COMP_PKTS: reached inner scope"
                )
            elif event == bluetooth.EVT_DISCONN_COMPLETE:
                logging.debug(
                    "if event == bluetooth.bluetooth.EVT_DISCONN_COMPLETE: reached inner scope"
                )
            elif event == self.LE_META_EVENT:
                sub_event = packet[self.beacon_header["subevent"]]
                packet = packet[self.beacon_header["body start"] :]

                if len(packet) < 20:
                    continue

                beacon_type_id = struct.unpack(
                    "BBBB", packet[self.type_id_frames[0] : self.type_id_frames[1]]
                )
                parser = self.get_parser(beacon_type_id)

                if sub_event == self.EVT_LE_CONN_COMPLETE:
                    self.le_handle_connection_complete(packet)
                elif sub_event == self.EVT_LE_ADVERTISING_REPORT:
                    parsed_events_list.append(parser(packet))

        sock.setsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, old_filter)
        return parsed_events_list

    def check_if_address_blacklisted(self, address: list):
        """
        Checks if address in blacklist or not
        :param address: bluetooth device address
        :return:
        """
        for black_address in self.bluetooth_device_addresses_blacklist:
            if address == black_address:
                return True

        return False

    def get_parser(self, beacon_type_id: Tuple[int, int, int, int]):
        """

        :param beacon_type_id:
        :return: a concrete parsing method
        """
        mapped_parsers = {
            (255, 76, 0, 2): self.ibeacon_parser,
            (255, 00, 128, 1): self.custom_beacon_parser,
            (109, 112, 116, 114): self.temp_track_parser,
        }
        # ibeacon -- Type - xFF (255), MFGID - x4C x00 (76 0), Type - Proximity / iBeacon - x02 (2), Length - x15 (21)
        # custom beacon -- Type - xFF (255), MFGID - x00 x80 (0 128), Type - x01 Bio telemetry (1)
        # temp tracker -- Type - x6D (109), MFGID - x7A x74 (112 116), Type  - x72 (114)

        try:
            parser = mapped_parsers[beacon_type_id]
        except KeyError:
            parser = self.null_parser

        return parser

    def null_parser(self, packet: tuple):
        """
        Used to emulate a handling with a packet when a data in the packet is unexpected
        :param packet: bluetooth packet or anything, param is not used in func
        :return: empty string
        """
        if self.DEBUG:
            logging.debug("null_beacon: ")
            for i in packet:
                logging.debug("%02X " % i)
        return ""

    def ibeacon_parser(self, packet: tuple):
        """
        Parses information from a given bluetooth packet.
        :param packet: a bluetooth packet
        :return: a formatted string with info from the packet
        """
        advertised_string = ""
        if self.DEBUG:
            logging.debug(helpers.return_string_packet(packet))

        num_reports = packet[0]
        for i in range(0, num_reports):
            heart_rate = packet[19]
            temperature = packet[21] * 0x100 + packet[20]
            step_count = packet[23] * 0x100 + packet[22]

            if not self.check_if_address_blacklisted(packet[3:9]):

                advertised_list = [
                    helpers.convert_packed_bluetooth_device_address_to_str(
                        packet[3:9]
                    ),  # Device address
                    helpers.return_string_packet(packet[15:24]),
                    helpers.return_number_packet(
                        packet[-6:-4]
                    ),  # BLE Major (part of id)
                    helpers.return_number_packet(
                        packet[-4:-2]
                    ),  # BLE Minor (part of id)
                    helpers.limit_data(
                        packet[-1] - 256, -100, -1
                    ),  # TX power (wifi signal power)
                    self.CONSTANT_RSSI,  # RSSI (received signal strength indicator)
                    helpers.limit_data(heart_rate, 0, 73),
                    helpers.limit_data(temperature, 340, 360),
                    helpers.limit_data(step_count, 0, 65535),
                ]
                advertised_list = [str(item) for item in advertised_list]
                advertised_string = ",".join(advertised_list)

            else:

                if self.DEBUG:
                    logging.debug(
                        "Blacklisted bluetooth device address "
                        + helpers.convert_packed_bluetooth_device_address_to_str(
                            packet[3:9]
                        )
                    )
                advertised_string = ""

            if self.DEBUG:
                logging.debug(f"iBeacon\n\tadvertised_string = {advertised_string}")

        return advertised_string

    def custom_beacon_parser(self, packet: tuple):
        """
        Parses information from a given bluetooth packet. Used when it is a custom packet
        :param packet: a bluetooth packet
        :return: a formatted string with info from the packet
        """
        advertised_string = ""
        num_reports = packet[0]
        for i in range(0, num_reports):
            heart_rate = packet[18]
            temperature = packet[20] * 0x100 + packet[19]
            step_count = packet[22] * 0x100 + packet[21]

            advertised_list = [
                helpers.convert_packed_bluetooth_device_address_to_str(
                    packet[3:9]
                ),  # Device address
                helpers.return_string_packet(packet[15:23]),
                10011,  # fake major                               # BLE Major (part of id)
                11000,  # fake minor                               # BLE Minor (part of id)
                helpers.limit_data(
                    packet[-1] - 256, -100, -1
                ),  # TX power (wifi signal power)
                self.CONSTANT_RSSI,  # RSSI (received signal strength indicator)
                helpers.limit_data(heart_rate, 0, 73),
                helpers.limit_data(temperature, 340, 360),
                helpers.limit_data(step_count, 0, 65535),
            ]

            advertised_list = [str(item) for item in advertised_list]
            advertised_string = ",".join(advertised_list)

            if self.DEBUG:
                logging.debug(
                    f"custom beacon\n\tadvertised_string = {advertised_string}"
                )

        return advertised_string

    def temp_track_parser(self, packet: tuple):
        """
        Parses information from a given bluetooth packet. Used if the packet consists a biometry info?
        :param packet: bluetooth packet
        :return: a formatted string with info from the packet
        """
        advertised_string = ""

        if self.DEBUG:
            logging.debug(helpers.return_string_packet(packet))

        num_reports = packet[0]

        for i in range(0, num_reports):
            heart_rate = 10  # Fake
            temperature = packet[25] * 10 + int(packet[26] / 10)
            step_count = 10  # Fake

            if self.DEBUG:
                logging.debug("TempTracker")
                for report in packet:
                    logging.debug("%02X " % report)

            advertised_list = [
                helpers.convert_packed_bluetooth_device_address_to_str(
                    packet[3:9]
                ),  # Device address
                helpers.return_string_packet(packet[15:24]),
                helpers.return_number_packet(packet[28:30]),  # BLE Major (part of id)
                helpers.return_number_packet(packet[30:32]),  # BLE Minor (part of id)
                helpers.limit_data(
                    packet[-1] - 256, -100, -1
                ),  # TX power (wifi signal power)
                self.CONSTANT_RSSI,  # RSSI (received signal strength indicator)
                helpers.limit_data(heart_rate, 0, 73),
                helpers.limit_data(temperature, 340, 360),
                helpers.limit_data(step_count, 0, 65535),
            ]

            advertised_list = [str(item) for item in advertised_list]
            advertised_string = ",".join(advertised_list)

            if self.DEBUG:
                logging.debug(f"\tadvertised_string = {advertised_string}")

        return advertised_string

    def le_handle_connection_complete(self, packet: list):
        """
        Unknown function, it's used in parse_events function, for the moment it's written as an empty plug
        :param packet:
        :return:
        """
        logging.debug("le_handle_connection_complete method is called")
