# overview
Config service performs as Configuration Server, it links other services to repository (currently git) where all of them can find their properties.

# dependencies
Depends on registry service.

# required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found in onboarding guide.  
Config should start first and set up his localhost port, after that Registry can be started. When config has started,
it throws exceptions - don't pay attention, they just inform that registry hasn't started yet.

# how module works
Module is a simple configuration server, enabled by `@EnableConfigServer`. It has 3 different profiles:  
DEV - is used for frontend development on localhost.   
LOCAL - is for backend developers. Properties contain local MongoDB settings.  
PRE-PROD - is similar to local profile, but is used for project instance deployed on Epam Cloud.  

If you want to use DEV or PRE-PROD locally, you must change mongo settings to local mongoDB.

By default, service gets configuration from Master branch of bcn-config git repository. To change branch you should add:
`spring.cloud.config.server.git.default-label: exact.name.of.branch`
This property changes config branch for all other microservices.

Or you can clone git project and use local configs (changes must be committed otherwise they will be erased on start):
use `spring.cloud.config.server.git.uri: file://${user.home}/way/to/local/repo`
Don't forget to remove private-key property and set `force-pull`, `ignoreLocalSshSettings` to false

# useful links
 - [spring docs](https://cloud.spring.io/spring-cloud-config/multi/multi__spring_cloud_config_server.html)  
