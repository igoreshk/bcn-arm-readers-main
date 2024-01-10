# overview
Monitor service computes and saves visitor position using raw measurement data coming from readers via Kafka what allows service
to provide access to position history. Service has a quite simple CRUD-logic for monitoring Visitors and VisitorGroup.
If you need to find the exact beacon-user, for example, to display someone’s location in a building, this service can be applied.

# dependencies
- Local or remote Kafka with data producers to get and send data
- Building service to get reader and level information
- Mongo database

# required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found in onboarding guide.  
Run all dependent services:  
Config, Registry, Gateway, UAA, Building 

# how module works
Each visitor has his own wristband with a unique device ID. Every reader that notices the wristband, sends data 
to the Kafka topic, which name is the same as the wristband device ID, so each wristband has its own Kafka topic.
Using the web interface, we create a visitor with the corresponding wristband device ID (`deviceId` field), which triggers
subscription to corresponding Kafka topic by monitor service. Next, we can create a watcher and select the visitor
whom he will monitor.

Data flow looks like this:

1. RawReaderDataDeserializer receives byte[] data from Kafka topics and process it in
   deserializeMessage(String topic, byte[] data) creating RawReaderData.
   String value of "topic" is written to "deviceId" in RawReaderData.
   Message sample: blescan-007.petersburg.epam.com 1603718242 8 1 -77 -83
   "blescan-007.petersburg.epam.com" here is reader ID.

2. TrilaterationSolver receives accumulated list of RawReaderData of size 5, computes FlatBeaconPositionDto and saved to the db `latest_history`,
   where stored last position, `position_history` where stored history for the period of time and db `history` with all historic data.

Data flow from mobile app looks like this:

1. Mobile service receives data from mobile app and sends it to kafka topic based on deviceId.

2. TrilaterationService creates listener that listens to the corresponding topics, 
   gets FlatBeaconPositionDto and saves it in `latest_history`, `position_history` and `history` db's.

# debug mode
If there is a need to debug monitor service and populate DB with data, there is a possibility to do it. 
Set to true property `beacons.cloud.debug-mode.enabled` in the [bootstrap.yml](src/main/resources/bootstrap.yml)
to enable the debug mode.

# useful links
 - [How to start local kafka](https://kb.epam.com/display/EPMLSTR/How+to+launch+kafka+and+zookeper+locally+on+Win10)
 - [Testing data chain from Beacons (Kafka) to Monitor service](https://kb.epam.com/pages/viewpage.action?pageId=1237756411#)
