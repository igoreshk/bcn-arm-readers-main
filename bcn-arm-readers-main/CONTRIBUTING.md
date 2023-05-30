# CONTRIBUTING



## Workflow

When the application starts (the start point is run_scanning.py) the following steps are executing:
1. The app is configuring the logger to write log down
2. The app is opening bluetooth socket of the host machine (it should be a Linux os and have BlueZ packet installed)
3. The app is registering Kafka Producer, receiving metadata from Kafka broker
4. The app is broadcasting
5. When the presence of a BLE device is described the app is trying to parse it and check if it has needed identifier of beacon device
6. If it is a beacon device the app is parsing its advertised data and sending it to Kafka broker
7. Steps from 4 are repeating


#### PyBluez

The application is using PyBluez library for all bluetooth issues.
It can be found [here](https://pybluez.readthedocs.io/en/latest/install.html)
PyBluez is working correctly only with Linux OS! And it is necessary to have BlueZ installed on the system


#### Advertised packet structure and example

First three bytes of a packet are the packet type, the event, and the packet length

Following bytes is an advertisement.

Bytes 15, 16, 17, 18 of the advertisement are the beacon type id.
(255, 76, 0, 2) -- ibeacon
(255, 00, 128, 1) -- custom beacon
(109, 112, 116, 114) -- temp(erature) track(er)

Depending on the beacon type the structure of an advertisement can be different.

Example of an ibeacon advertising packet:
```
01 00 01 bc 30 06 8b a9 e3 1e 02 01 06 1a ff 4c 00 02 15 f7 82 6d a6 4f a2 4e 98 80 24 bc 5b 71 e0 89 3e 00 07 00 01 b8 a4
```

Example of an advertised packet skipped by the application:
```
01 03 01 4F FD 01 81 DC 34 1F 1E FF 06 00 01 09 20 02 52 F3 94 EB 4B A7 8E 88 C0 4B 87 9F 01 C8 46 1A D2 8D CC DA 72 EA 27 A2
```


#### Message to Kafka structure and example

Messages to Kafka are sent to the topic which name is the Mac address of the beacon.

Topic name example:
```
e90d9138fbc5
```

Message is a string, made up of 9 fields, white space delimited.

Message example:
```
blescan-014.petersburg.epam.com 1607345375 10011 10003 -59 -47 88 366 5000
```
where
`blescan-014.petersburg.epam.com` -- name of reader which sent a message
`1607345375` -- timestamp
`10011` -- Major (part of id)
`10003` -- Minor (part of id)
`-59` -- TX-power
`-47` -- RSSI
`88` -- heart rate
`366` -- temperature (in degree multiplied by 10)
`5000` -- step counts


#### Environment variables:

To turn on debug mode:
```bash
~ $ export DEBUG=1
```

To use local Kafka broker:
```bash
~ $ export LOCAL_TESTING_HOST='localhost:9092'
```



## Local testing


#### Testing with a false PyBluez

If you need to test the application for some features excluding work with bluetooth on the Mac or Windows system you can use the package mocking PyBluez.
To do it copy [the directory](bluetooth) to the root directory.
It will emulate _bluetooth module and the broadcasting will always find an ibeacon (so it's good idea to put a timeout into code)


#### Testing with a Docker container (only for Linux)

To start the project locally you need:

 1. Linux os (Debian is better, Ubuntu should work too but it's not checked),
either dual-boot or the main system, the virtual machine is not helpful
 2. Docker and docker-compose installed
 3. Git installed to clone the project, either you need to copy it another way

 To start follow these steps:
 1. In the terminal go to the working directory, type:

```bash
~$ cd /your-path/bcn-arm-readers
```

 2. Start docker-compose, type:

```bash
~bcn-arm-readers$ docker-compose up -d
```

 3. In case of any issues just rerun docker compose commands:

```bash
~bcn-arm-readers$ docker-compose up -d --force-recreate
```

 4. When it's successfully started to check if Kafka receives messages, type:

```bash
~bcn-arm-readers$ docker-compose exec beacons-broadcaster bash
user@host:/iscan3$ kafkacat -L -b localhost:9092
```

It should return you a list of topics, then

```bash
user@host:/iscan3$ kafkacat -b localhost:9092 -t <the name of topic>
```

It should return you a list of messages and "the end of topic", and if device is
still advertising the list will be refreshed in real time.

To return to the bash prompt type:

```bash
user@host:/iscan3$ exit
```

 5. To stop docker-compose type:

```bash
~bcn-arm-readers$ docker-compose down
```


#### Application to emulate the ibeacon for iOs:

[Link to AppStore](https://apps.apple.com/ru/app/rnf-beacon-toolkit/id1110757307)

To start advertising:
1. Open the application
2. Choose "ADVERTISE BEACONS"
3. Tap on the PLUS sign on the upper-right corner
4. Input title and tap "Generate Identifiers"
5. Confirm the form by tapping check mark on the upper-right corner
6. Click the "On" button
Voila, the advertising is started



## Testing on dev

To test the application with the whole working environment you should:
1. Deploy it to Dev
2. Depending on your purpose either check the Kafka broker or check something on Raspberry or both


#### GitLab pipeline

To deploy go to CI/CD -- Pipelines, choose the commit you need, click the button with the play-sign, choose the Deploy-python-DEV, click and wait for a green "Passed" sign.
Note! You probably don't have an access to start deployment for the main branch.


#### Kafka dev server

To reach the machine where Kafka server is running:

1. Turn on the Epam's VPN
2. Open terminal
3. Type:
```bash
~ $ ssh <your-fullname>@epam.com@ecse00500096.epam.com
```
4. Input the password

Further:
```bash
~ $ kafkacat -L -b localhost:9092
```
to see all topics

To read messages of a topic:
```bash
~ $ kafkacat -b localhost:9092 -t <the name of topic>
```
If it is a topic using by Raspberries it should be a lot of messages and the new messages should appear sometimes

To exit ssh:
```bash
~ $ logout
```


#### Raspbery-pi dev

To reach a Raspberry

Ask for the access DevOps

If yes:

Turn on the Epam's VPN
Open terminal
Type one of the following commands:

```bash
~ $ ssh pi@blescan-014
~ $ ssh pi@blescan-016
~ $ ssh pi@blescan-017
```
Input given by DevOps credentials

To see if the python application is running:
```bash
~ $ top
```
There should be a row in the table "python"

The application is situated:
```bash
~ $ /iscan3
```

The log is being written to:
```bash
~ $ /var/log/testblescan3.log
```
