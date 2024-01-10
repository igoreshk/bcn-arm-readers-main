# overview
UAA service is a user authorization/resource service, used for user persistence, and it's also used to set/get user role info.  

# dependencies
Depends on the config, registry and gateway service.
Module receives user image from `EPAM Telescope API`. Note that Beacons has special account for that which expires on May, 2021.

# required steps
Insert `-Dvault-token=TOKEN` parameter in VM options. The `TOKEN` itself can be received from DevOps engineer or found in onboarding guide.  
Run config, registry and gateway first. UAA can be started right after gateway, unlike gateway and registry which must
be started with short delay.

# how module works
Module has basic controllers, services and DAOs for user and role.
One of main purposes of UAA is to decode tokens from EPAM SSO authorization server, extract required fields and 
return user role as `GrantedAuthorities` to gateway.  

Main authorization flow steps are:  
1 - Filter chain is started on the Gateway. `OAuth2ClientAuthenticationProcessingFilter` calls `UserInfoTokenServices`, 
 which uses restTemplate to send request to `/me`, UAA endpoint to get user information. 
2 - `OAuth2AuthenticationProcessingFilter` on UAA triggers `DefaultTokenService.loadAuthentication()` method which calls
`readAccessToken()` and `readAuthentication()` methods of `JwtTokenChain`.  
3 - When reading access token, `EpamJwtAccessTokenConverter.decode()` method is used. It maps token into HashMap.
Tokens are encoded with Base64 (default encoding). `EpamJwtAccessTokenConverter` is Beacon's `JwtAccessTokenConverter` 
implementation. 
4 - The standard Spring's flow assumed that the map contains key `user_name` with user's login. But EPAM's token stores 
it with key `upn`. So after reading token to map, we copy value from `user_name` to `upn` in 
`EpamJwtAccessTokenConverter.extractAuthentication()`. It does also two actions:
- creates a user if it isn't present in DB;
- updates `User.lastEntry` field with current Date and Time.

5 - `DefaultUserAuthenticationConverter.extractAuthentication()` extract authorities from a user. 
`UserDetailsServiceImp.loadUserByUsername()` locates the user based on the username (key `user_name` in the map).  
6 - After that security chain on UAA is successfully completed and `/me` endpoint returns `OAuth2Authentication` to Gateway.  

UAA is also a typical authorization service, enabled by `@EnableAuthorizationServer`. It already has predefined 
endpoints which give authorization code and then access and refresh tokens can be received with this code. Currently it 
authorizes feign clients requests!

Authorization server works in link with Resource Server. UAA uses `OAuth2Config` inner class `ResourceServerConfiguration`
and `@EnableResourceServer` to act in this role. Resource server is another role in an OAuth flow. Authorization server 
emits token while resource server requires one.  

Same like UAA, every Beacons microservice, which has resources to share, is secured by Resource Server Configuration! 
Common service has default configuration bean (marked with `@ConditionalOnMissingBean`) in `ResourceServerConfig` class. 
Other services override it in order to secure custom endpoints.  

Also, there are important `OAuth2FeignRequestInterceptor` configurations! This interceptor is essential for feign client 
to pass through security filters.  

Finally, there is `WebSecurityConfig`, basic Spring Security configurer.

# how to update sso certificate public key
KB page: [Staging/Dev/QA Environment](https://kb.epam.com/pages/viewpage.action?pageId=512370492)  
In case the link to KB page is expired you should search for EPAM SSO info in KB.

The SSO certificate expires on 5th of November 2022. To update public key you need to download it from the link above. 
Currently, the name of required file is `certificate_publickey.pem`. Then you need to copy public key from `.pem` file 
and replace the value in the vault with the new one (the key for the value is in the property `security.oauth2.resource.jwt.keyValue`). 

Key must be changed in all profiles: `DEV`, `LOCAL` and `PRE_PROD`. The file can be deleted after that.

# useful links
 - [description of authorization code](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type)   

Articles to better understand OAuth configs:  
 - [sso and resource server difference](https://www.baeldung.com/spring-security-oauth2-enable-resource-server-vs-enable-oauth2-sso)  
 - [WebSecurityConfigurer with Resource Server](https://stackoverflow.com/questions/44234159/using-websecurityconfigureradapter-with-spring-oauth2-and-user-info-uri) 


# test data

### public key for JWT token
You can generate it either with `openssl` ([stackoverflow.com](https://stackoverflow.com/questions/5244129/use-rsa-private-key-to-generate-public-key)): 
1. produce a public - private key pair:  
`openssl genrsa -out mykey.pem 512`
2. extract the public key   
`openssl rsa -in mykey.pem -out public.pem -outform PEM -pubout`  

or with online service [Online RSA Key Generator](https://travistidwell.com/jsencrypt/demo/)

### keystore with private key
1. generate a key pair in keystore(lifetime about 100 years = 365 * 100):    
`keytool -v -genkey -dname "CN=test" -alias mytest -storetype pkcs12 -keystore teststore.p12 -validity 36500 -keyalg RSA -keysize 512 -storepass 123456`  
2. encode the keystore into Base64 format  
`certutil -f -encodehex teststore.p12 teststore.b64 0x40000001` 
