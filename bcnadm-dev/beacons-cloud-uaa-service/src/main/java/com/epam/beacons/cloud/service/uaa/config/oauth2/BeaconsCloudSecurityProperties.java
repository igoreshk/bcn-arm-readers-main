package com.epam.beacons.cloud.service.uaa.config.oauth2;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * OAuth2 KeyStore properties.
 */
@ConfigurationProperties(prefix = "beacons.cloud.security")
public class BeaconsCloudSecurityProperties {

    private String keyStorePassword;
    private String alias;

    /**
     * The BASE64-encoded KeyStore file.
     */
    private String keyStoreEncodedFile;

    /**
     * Get the password used to unlock the keystore.
     *
     * @return the password used to unlock the keystore
     */
    public String getKeyStorePassword() {
        return keyStorePassword;
    }

    /**
     * Set the password used to unlock the keystore.
     *
     * @param keyStorePassword the password used to unlock the keystore
     */
    public void setKeyStorePassword(String keyStorePassword) {
        this.keyStorePassword = keyStorePassword;
    }

    /**
     * Return the "alias" string that identified the entry in the keystore.
     *
     * @return the alias of the key
     */
    public String getAlias() {
        return alias;
    }

    /**
     * Set the "alias" string that identified the entry in the keystore.
     *
     * @param alias the alias of the key
     */
    public void setAlias(String alias) {
        this.alias = alias;
    }

    /**
     * Get the BASE64-encoded KeyStore file.
     *
     * @return the BASE64-encoded KeyStore file
     */
    public String getKeyStoreEncodedFile() {
        return keyStoreEncodedFile;
    }

    /**
     * Set a BASE64-encoded KeyStore file.
     *
     * @param keyStoreEncodedFile a BASE64-encoded KeyStore file
     */
    public void setKeyStoreEncodedFile(String keyStoreEncodedFile) {
        this.keyStoreEncodedFile = keyStoreEncodedFile;
    }

}
