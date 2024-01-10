# Overview
Mobile service is a microservice that receives data from mobile clients, processes it, and sends it to other microservices via Kafka.

# Dependencies
During runtime, it requires configured local or remote Kafka to send data.

# Required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found
in "Microservices startup roadmap" KB article. Run all dependent services:  
Config, Registry, Gateway, UAA, Building, Monitor. 
