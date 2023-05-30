"""
Provides helper functions for converting etc.
"""
import struct


def return_number_packet(packet: tuple):
    """
    Converts given packet to its number representation (a sum of all numbers in a packet)
    Used to calculate Major and Minor of ids coded in several bytes
    :param packet: a packet
    :return: an integer representation of a given fragment of a packet
    """
    integer_repr = 0
    multiple = 256
    for bite in packet:
        integer_repr += bite * multiple
        multiple = 1
    return integer_repr


def return_string_packet(packet: tuple):
    """
    Represents a packet as a string with format XX XX XX where XX - hexadecimal integers
    :param packet: a packet
    :return: string representation of a packet
    """
    packet_string = ""
    for bite in packet:
        packet_string += "%02x " % bite
    return packet_string


def get_packed_bluetooth_device_address(bd_address_string: str):
    """
    Converts a string representation of an address to a packed address
    :param bd_address_string: string in format "XXXXXX:XXXXX"  # Put here a valid format
    :return: a packed bluetooth device's address
    """
    packable_address = []
    address = bd_address_string.split(":")
    address.reverse()
    for bite in address:
        packable_address.append(int(bite, 16))
    return struct.pack("<BBBBBB", *packable_address)


def convert_packed_bluetooth_device_address_to_str(bd_address_packed: bytes):
    """
    Converts a given packed bluetooth device address to a represent form
    :param bd_address_packed: packed bluetooth device address
    :return: a represent string
    """
    return ":".join(
        "%02x" % i for i in struct.unpack("<BBBBBB", bd_address_packed[::-1])
    )


def limit_data(data: int, low: int, high: int):
    """
    Used to limit some parts of a given part (data) of a packet with minimum and maximum value
    :param data: given part of a packet
    :param low: minimum value
    :param high: maximum value
    :return: either low if data less than low or high if data more than high or data
    """
    if data < low:
        return low
    elif data > high:
        return high
    else:
        return data
