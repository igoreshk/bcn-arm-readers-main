package com.epam.beacons.cloud.gateway.security;

import feign.RequestInterceptor;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor;
import org.springframework.cloud.security.oauth2.client.feign.OAuth2FeignRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.AccessTokenProvider;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsAccessTokenProvider;

/**
 * EPAM SSO configuration.
 */
@Configuration
@EnableConfigurationProperties(KeyStoreProperties.class)
@ComponentScan(basePackages = {"com.epam.beacons.cloud.gateway.security"})
@SuppressWarnings({"SpringJavaInjectionPointsAutowiringInspection"})
public class Oauth2Config {

    /**
     * An Access Token Provider.
     *
     * @param keyStoreProperties properties for KeyStore
     * @return access token provider that uses a self-signed certificate
     */
    @Bean
    public AccessTokenProvider accessTokenProvider(KeyStoreProperties keyStoreProperties) {

        return new EpamTokenProvider(keyStoreProperties);
    }

    /**
     * An OAuth2 client filter.
     *
     * @param ssoLoginSuccessHandler SSO login success handler
     * @param restTemplate           client context
     * @param tokenServices          uses a user info REST service
     * @param loginPath              user endpoint for redirect to SSO Authorization server
     * @return load balanced rest template
     */
    @Bean
    public OAuth2ClientAuthenticationProcessingFilter ssoFilter(
            SsoLoginSuccessHandler ssoLoginSuccessHandler, OAuth2RestOperations restTemplate,
            UserInfoTokenServices tokenServices, @Value("${security.oauth2.sso.login-path}") String loginPath
    ) {

        OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(loginPath);

        filter.setRestTemplate(restTemplate);
        filter.setTokenServices(tokenServices);
        filter.setAuthenticationSuccessHandler(ssoLoginSuccessHandler);

        return filter;
    }

    /**
     * Load balanced rest template.
     *
     * <p>Due to we are not utilizing spring boot auto-config, rest template must
     *
     * <p>be declared explicitly.
     *
     * @param oAuth2ClientContext client context
     * @param resourceDetails     details for an OAuth2-protected resource
     * @param accessTokenProvider token for EPAM SSO
     * @return load balanced rest template
     */
    @Bean
    @LoadBalanced
    public OAuth2RestOperations restTemplate(
            OAuth2ClientContext oAuth2ClientContext, OAuth2ProtectedResourceDetails resourceDetails,
            AccessTokenProvider accessTokenProvider
    ) {

        OAuth2RestTemplate oAuth2RestTemplate = new OAuth2RestTemplate(resourceDetails, oAuth2ClientContext);

        oAuth2RestTemplate.setAccessTokenProvider(accessTokenProvider);

        return oAuth2RestTemplate;
    }

    /**
     * LoadBalancerInterceptor for intercepting will be used,
     *
     * <p>if org.springframework.retry.support.RetryTemplate
     * in classpath <b>NOT  present</b>.
     *
     * @param oAuth2ClientContext     OAuth2ClientContext
     * @param resource                resource details
     * @param loadBalancerInterceptor RetryLoadBalancerInterceptor
     * @return OAuth2FeignRequestInterceptor
     */
    @Bean
    public RequestInterceptor oauth2FeignRequestInterceptor(
            OAuth2ClientContext oAuth2ClientContext, OAuth2ProtectedResourceDetails resource,
            LoadBalancerInterceptor loadBalancerInterceptor
    ) {
        OAuth2FeignRequestInterceptor interceptor = new OAuth2FeignRequestInterceptor(oAuth2ClientContext, resource);
        ClientCredentialsAccessTokenProvider accessTokenProvider = new ClientCredentialsAccessTokenProvider();
        accessTokenProvider.setInterceptors(Collections.singletonList(loadBalancerInterceptor));
        interceptor.setAccessTokenProvider(accessTokenProvider);
        return interceptor;
    }
}
