# overview
Building services is used for building persistence. It includes building API: beacons, buildings, edges, vertices,
levels, areas, transporters.  

Building is the main entity which includes all others in a module.  
Level is a building floor.  
Scale is for building scale set up. It uses Vertices (2D points on a map).  
Edge is a level edge, consists of 2 vertices.  
Beacon is a user location on the map.  
Area is an area on the building floor with position, type (e.g. Kitchen) and description.   
Reader is used for a trilateration.

# dependencies
This microservice is feign-dependent on UAA service.

# required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found in onboarding guide.  
Run all dependent services:  
Config, Registry, Gateway, UAA. 

# how module works
Module has basic 3-tier layers logic (Controller, Service, Dao). Every entity's layers are located in its own directory.
Each `event.listener` directory contains Event Listener for cascade CRUD operations 
(MongoDB doesn't change bounded entities when Parent was changed).
