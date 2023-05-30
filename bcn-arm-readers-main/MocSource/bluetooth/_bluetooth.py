import struct


def hci_open_dev(device_id):  # ble_connect
    return BluetoothSocket()


def hci_send_cmd(
    sock, OGF_LE_CTL, OCF_LE_SET_SCAN_ENABLE, command_packet
):  # ble_connect
    pass


SOL_HCI = None  # ble_connect

HCI_FILTER = None  # ble_connect

EVT_DISCONN_COMPLETE = None  # beacon_response_parse

EVT_NUM_COMP_PKTS = None  # beacon_response_parse

EVT_INQUIRY_RESULT_WITH_RSSI = None  # beacon_response_parse

HCI_EVENT_PKT = None  # beacon_response_parse


def hci_filter_new():
    pass


def hci_filter_all_events(filter_rule):
    pass


def hci_filter_set_ptype(filter_rule, HCI_EVENT_PKT):
    pass


class BluetoothSocket:
    def setsockopt(self, SOL_HCI, HCI_FILTER, filter_rule):
        pass

    def getsockopt(self, SOL_HCI, HCI_FILTER, a):
        pass

    def recv(self, a):
        a = struct.pack(
            "<BBBBBBBBBBBBBBBBBBBBBBBBBBBB",
            0x02,
            0x3E,
            0x06,
            0x02,
            0x01,
            0x00,
            0x4C,
            0x02,
            0x15,
            61,
            255,
            111,
            250,
            26,
            0xFF,
            0x00,
            0x00,
            0x00,
            255,
            76,
            0,
            2,
            21,
            61,
            55,
            3,
            246,
            100,
        )
        return a
