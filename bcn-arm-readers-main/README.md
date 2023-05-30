# Beacon arm-readers


## Short project overview:

The project is designed to provide localization and tracking services through
several different use cases.
The main two groups of use cases are:
1. Stationary beacons and mobile reader application (run on a cell phone)
2. Stationary readers and mobile beacons (or beacon-like devices such as
  wristbands and possible any other devices that can advertise BLE - Bluetooth Low Energy - packet with RSSI (Radio Signal Strength Indication) and/or TX-power in case of the trilateration)
The localization can be received by the trilateration algorithm if it should be tracked with precision or just by receiving a BLE-signal in case of presence localization.

For now the both use cases are being developed in the project.
The Android team is developing the first scenario.
The Python team is developing the second scenario.

#### Terms:
1. Beacon - device advertising BLE packet, can be carried device or stationary one depending on use case as described above.
2. Reader - device hearing for advertised BLE packets to discover a presence and/or RSSI/TX-power to localize itself or beacon depending on use case.

For additional entire project information please follow [Project's Knowledge Base](https://kb.epam.com/pages/viewpage.action?pageId=467207975)


## Stationary readers use case:

This repository contains an application related to the stationary readers use case.

In this case:
Few readers are situated in every room of interest. Each reader broadcasts for the presence of BLE devices, tries to read an information and sends it into Apache Kafka to further using.

### Readers, summary:

Readers are Raspberry Pi 3 mini computers with bluetooth module.
The Python application is deployed on them and works as a bluetooth server and Kafka Producer.

[For Developers](CONTRIBUTING.md)
