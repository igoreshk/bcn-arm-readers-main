package com.epam.beacons.cloud.gateway.security;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.socket.LayeredConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClients;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeAccessTokenProvider;

public class EpamTokenProvider extends AuthorizationCodeAccessTokenProvider {

    private static final Logger LOGGER = LogManager.getLogger(EpamTokenProvider.class);
    private static final String KEYSTORE_FILE_NOT_FOUND_MESSAGE = "Keystore file not found.";
    private static final String FAILED_KEYSTORE_MESSAGE = "Failed to initialize Keystore";
    private static final String FAILED_SSL_CONNECTION_SOCKET_FACTORY_MESSAGE =
            "Failed to initialize SSLConnectionSocketFactory";

    public EpamTokenProvider(KeyStoreProperties keyStoreProperties) {
        super();

        KeyStore keyStore = createKeyStore(keyStoreProperties);

        SSLConnectionSocketFactory connectionSocketFactory = createSslConnectionSocketFactory(keyStore);

        ClientHttpRequestFactory clientHttpRequestFactory = clientHttpRequestFactory(connectionSocketFactory);

        this.setRequestFactory(clientHttpRequestFactory);
    }

    private KeyStore createKeyStore(KeyStoreProperties keyStoreProperties) {
        byte[] keyStoreFile = keyStoreProperties.getKeyStoreDecodedFile();

        try (InputStream keyStoreStream = new ByteArrayInputStream(keyStoreFile)) {

            KeyStore keyStore = KeyStore.getInstance(keyStoreProperties.getKeyStoreType());

            keyStore.load(keyStoreStream, keyStoreProperties.getKeyStorePassword().toCharArray());

            return keyStore;

        } catch (IOException e) {
            LOGGER.info(KEYSTORE_FILE_NOT_FOUND_MESSAGE, e);
            throw new RuntimeException(KEYSTORE_FILE_NOT_FOUND_MESSAGE);

        } catch (GeneralSecurityException e) {
            LOGGER.info(FAILED_KEYSTORE_MESSAGE, e);
            throw new RuntimeException(FAILED_KEYSTORE_MESSAGE);
        }
    }

    private SSLConnectionSocketFactory createSslConnectionSocketFactory(KeyStore keyStore) {

        try {
            TrustManagerFactory trustManagerFactory = TrustManagerFactory
                    .getInstance(TrustManagerFactory.getDefaultAlgorithm());
            trustManagerFactory.init(keyStore);

            TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();

            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustManagers, null);

            return new SSLConnectionSocketFactory(sc);

        } catch (GeneralSecurityException e) {
            LOGGER.info(FAILED_SSL_CONNECTION_SOCKET_FACTORY_MESSAGE, e);
            throw new RuntimeException(FAILED_SSL_CONNECTION_SOCKET_FACTORY_MESSAGE);
        }
    }

    private ClientHttpRequestFactory clientHttpRequestFactory(LayeredConnectionSocketFactory connectionSocketFactory) {

        HttpClient httpClient = HttpClients.custom().setSSLSocketFactory(connectionSocketFactory).build();

        return new HttpComponentsClientHttpRequestFactory(httpClient);
    }
}
