# overview
Gateway service is a proxy for all resource services. It redirects http requests to other services and implements 
Single-Sign-On security.

# dependencies
Depends on the config and registry service. It also use configurations from common service. 
Authentication process is connected with UAA service.

# required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found in onboarding guide.  
Run config and registry first. Gateway can be registered after config service is registered.
Use DEV profile to turn off the security.

# how module works
Gateway is enabled by `@EnableZuulProxy`. Zuul routes all requests to other services using mappings in properties.
(`stripPrefix: false` setting prevents zuul from stripping `/api/v1` prefix)

Security is implemented in SsoSecurityConfig.

SSO Authentication is enabled by `@EnableOAuth2Sso`. When user follows `security.oauth2.sso.loginPath` endpoint, 
Oauth2 redirects to EPAM SSO Authorization server, which emits access and refresh tokens. After tokens are received, 
OAuth2 filter sends access token to UAA for user authorization (`me` endpoint). 

After authorization is done, `SessionHandler.newHttpSession()` method creates new session and stores it in 
DefaultSessionCache. Session is created on the first call of `request.getSession()` method. JSESSIONID is saved in 
cookies. JSESSIONID tells backend that user is authorized. You as developer can use it in Postman to pass request 
through authentication. JSESSIONID can be found in gateway console logs.  

Eureka also provides Ribbon as out-of-box load balancer. It's activated by `ribbon.eureka.enabled: true`. And annotation 
`@LoadBalanced` marks restTemplate to use `RibbonLoadBalancerClient` for interaction with other services. Ribbon works 
together with Hystrix (circuit breaker).  

CertUtils class loads certificate for SSL connection to EPAM SSO, key is provided by EPAM. Without this certificate you 
can't get token from EPAM. Certificate is also linked to RSA Public Key. This key is used to validate EPAM token on 
UAA service. 

# how to update sso certificate
KB page: [Staging/Dev/QA Environment](https://kb.epam.com/pages/viewpage.action?pageId=512370492)  
In case the link to KB page is expired you should search for EPAM SSO info in KB.

The SSO certificate expires on 5th of November 2022. To update it you need to get the decoded keystore file. For that you 
must save the BASE64 encoding of the file from the vault in a file (the key for the value is in the property 
`security.oauth2.sso.keyStoreEncodedFile` in `gateway.yml`), for example you can name a new file `sso-keystore.b64`. Then you run command 
to decode the file:   
`certutil -f -decode sso-keystore.b64 sso-keystore.p12`

After that, you need to update the keystore. You shall download a new certificate from the link above and place the `.cer` file in 
the same directory as `sso-keystore.p12`. Currently, the name of the required file is `Staging_ADFS_Cert_Base64_to_060921.cer`. 
Go to a terminal, change directory to one where the keystore and certificate are and run:  
`keytool -importcert -file Staging_ADFS_Cert_Base64_to_060921.cer -keystore sso-keystore.p12`  
Enter the password, upon request (you can find it in the vault, the key for the value is in the property 
`security.oauth2.sso.keyStorePassword` in `gateway.yml`) and type `yes` to dialog `Trust this certificate?`. 

Finally, you need replace the BASE64 encoding of the file in the vault. You can encode the file with command (Windows):   
`certutil -f -encodehex sso-keystore.p12 sso-keystore.b64 0x40000001`    

The value must be changed in all profiles: `DEV`, `LOCAL`and `PRE_PROD`. The files can be deleted after that.

# useful links
 - [auth flow schema, links to sso and oauth descriptions](https://kb.epam.com/display/EPMLSTR/SSO+in+Beacons)  
 - [full description of Beacons microservices OAuth security](https://kb.epam.com/pages/viewpage.action?pageId=590267594)
 - [zuul spring docs](https://cloud.spring.io/spring-cloud-netflix/multi/multi__router_and_filter_zuul.html)
 - [oauth basic description in russian](https://www.digitalocean.com/community/tutorials/oauth-2-ru)  
 - [service to see decoded representation of token](https://jwt.io/)  
 - [request flow inside spring security filter chain](https://habr.com/ru/post/346628/)  
 - [hystrix + ribbon settings description](https://github.com/spring-cloud/spring-cloud-netflix/issues/1324)  
 - [oauth spring docs](https://docs.spring.io/spring-security-oauth2-boot/docs/2.0.0.RC2/reference/htmlsingle/)
