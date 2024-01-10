# Import SSL certificate in JDK to make Vault work (on Windows)

1. If you don't have it, create a security directory `<JAVA_HOME>/lib/security` 
(`<JAVA_HOME>/jre/lib/security` for Java 8) 
2. Download this file - [bcn-registry.crt.pem](../bcn-registry.crt.pem)
3. Paste in command line:
   `keytool -import -alias vault -keystore <JAVA_HOME>/lib/security/cacerts -file <Path_to_file>/bcn-registry.crt.pem`

*Make sure you don't have any whitespaces in Paths (`JAVA_HOME`, `Path`)*

<details>
   <summary> 
      <b>Spoiler</b> 
   </summary>

> in `-keystore <JAVA_HOME>/lib/security/cacerts` cacerts is a "list" with trusted certs, 
> so if you use different JAVA installations, 
> check twice if `<JAVA_HOME>/lib/security/cacerts` is the file your JAVA installation use when you start a service

</details>

If you make it correct, you will be asked to enter the password two times. The password - **changeit**

After that you will receive in console `...certificate was added successfully..`

4. Then you have to change your Vault token in each microservice you want to start. `-Dvault-token=<Actual_token_for_vault>`
5. If you have multiple JDKs, make sure your IDE uses the same JDK, as it was in your `<JAVA_HOME>`
