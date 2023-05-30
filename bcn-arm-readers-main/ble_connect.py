"""
Provides a service to open bluetooth socket, scan for advertising devices.
"""

import struct
import bluetooth._bluetooth as bluetooth


class BleConnection:
    """
    Provides methods to handle Bluetooth Low Energy connection: opening socket and scanning for bluetooth devices.
    The socket is used for the inquiring an advertisement from found bluetooth devices.
    The constructor takes four optional arguments:
     - 'device_id', which is an id of internal bluetooth device, by default equals 0,
    The instantiation opens hci device socket, sets scan parameters and enables scan.
    """

    LE_SET_SCAN_PARAMETERS_CP_SIZE = 7
    OGF_LE_CTL = 0x08
    OCF_LE_SET_SCAN_PARAMETERS = 0x000B
    OCF_LE_SET_SCAN_ENABLE = 0x000C
    OCF_LE_CREATE_CONN = 0x000D

    LE_ROLE_MASTER = 0x00
    LE_ROLE_SLAVE = 0x01

    def __init__(self, device_id: int = 0):

        self.sock = bluetooth.hci_open_dev(device_id)
        self.hci_le_set_scan_parameters()
        self.hci_enable_le_scan()

    def hci_enable_le_scan(self):
        """
        Toggles hci scan mode to enable
        """
        self.hci_toggle_le_scan(0x01)

    def hci_disable_le_scan(self):
        """
        Toggles hci scan mode to disable
        """
        self.hci_toggle_le_scan(0x00)

    def hci_toggle_le_scan(self, enable: int):
        """
        Toggles hci scan mode
        :param enable: enable (0x01) or disable (0x00) scan mode
        """
        command_packet = struct.pack("<BB", enable, 0x00)
        bluetooth.hci_send_cmd(
            self.sock, self.OGF_LE_CTL, self.OCF_LE_SET_SCAN_ENABLE, command_packet
        )

    def hci_le_set_scan_parameters(self):
        """
        Sets standard parameters to a given socket (socket options for the HCI protocol, standard options for
        the filter, length of an accepted packet)
        """
        self.sock.getsockopt(bluetooth.SOL_HCI, bluetooth.HCI_FILTER, 14)
