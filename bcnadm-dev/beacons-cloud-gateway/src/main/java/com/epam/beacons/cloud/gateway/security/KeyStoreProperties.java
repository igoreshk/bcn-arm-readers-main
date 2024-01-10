package com.epam.beacons.cloud.gateway.security;

import java.util.Base64;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * SSO KeyStore properties.
 */
@ConfigurationProperties(prefix = "security.oauth2.sso")
public class KeyStoreProperties {

    private String keyStorePassword;
    private String keyStoreType;

    /**
     * The BASE64-encoded KeyStore file.
     */
    private String keyStoreEncodedFile;

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

    /**
     * Get a byte array from the KeyStore file.
     *
     * @return a byte array containing the bytes from the KeyStore file
     */
    public byte[] getKeyStoreDecodedFile() {
        return Base64.getDecoder().decode(keyStoreEncodedFile);
    }

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
     * Get the type of KeyStore.
     *
     * @return the type of file password
     */
    public String getKeyStoreType() {
        return keyStoreType;
    }

    /**
     * Set the type of KeyStore.
     *
     * @param keyStoreType the type of file password
     */
    public void setKeyStoreType(String keyStoreType) {
        this.keyStoreType = keyStoreType;
    }
}
