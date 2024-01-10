# overview
Registry service is a Eureka server instance.

# dependencies
Depends on the config service.

# required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found in onboarding guide.  
Config should start first and set up his localhost port, after that Registry can be started. Once Eureka cannot find
config it would set up default port `8080` and you must re-run it!

# how module works
Module is enabled by `@EnableEurekaServer`. Eureka is a service discovery framework. It helps developer to make
microservices(MS) automatically find each other and scale application up using replicas of MSs.
When started Eureka searches for config service to get properties, such as port and `eureka.client` settings.  
Eureka also tries to find and register itself, `register-with-eureka: false` and `fetch-registry: false` prevents it 
from self registering.

`eureka.client.service-url.defaultZone` is the url(1 or more) to search for eureka.  
`prefer-ip-address: true` makes Eureka use ip rather than hostname, it's essential for running services in separated pods 
in Kubernetes.  

# module public api
http://localhost:10005/ - service current address for LOCAL profile  
http://ecse00500411.epam.com:30205/ - service current address for DEV profile
http://ecse0050040f.epam.com:31205/ - service current address for TESTING profile
`/eureka` - is used by MSs to register  

# useful links
[guide for MS creation](https://kb.epam.com/display/EPMLSTR/Create+new+microservice)  
[Spring docs](https://cloud.spring.io/spring-cloud-netflix/multi/multi_spring-cloud-eureka-server.html)  
[good description of main eureka features](https://www.baeldung.com/spring-cloud-netflix-eureka)  
