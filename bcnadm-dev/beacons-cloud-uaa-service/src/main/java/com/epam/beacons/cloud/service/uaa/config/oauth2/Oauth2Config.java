package com.epam.beacons.cloud.service.uaa.config.oauth2;

import com.epam.beacons.cloud.service.uaa.authentication.EpamJwtAccessTokenConverter;
import com.epam.beacons.cloud.service.uaa.service.UserService;
import feign.RequestInterceptor;
import java.util.Base64;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.OAuth2ClientProperties;
import org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor;
import org.springframework.cloud.security.oauth2.client.feign.OAuth2FeignRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsAccessTokenProvider;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.DefaultUserAuthenticationConverter;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;

/**
 * Configuration for OAuth2 authorization server.
 *
 * @author Niyaz Bikbaev
 */
@Configuration
@EnableAuthorizationServer
public class Oauth2Config extends AuthorizationServerConfigurerAdapter {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final OAuth2ClientProperties oAuth2ClientProperties;
    private final BeaconsCloudSecurityProperties securityProperties;
    private final String redirectUri;

    public Oauth2Config(
            UserService userService, OAuth2ClientProperties properties,
            @Qualifier("userDetailsServiceImpl") UserDetailsService userDetailsService,
            AuthenticationManager authenticationManager, BeaconsCloudSecurityProperties securityProperties,
            @Value("${beacons.sso.registeredRedirectUri}") String redirectUri
    ) {
        this.userService = userService;
        this.oAuth2ClientProperties = properties;
        this.userDetailsService = userDetailsService;
        this.authenticationManager = authenticationManager;
        this.securityProperties = securityProperties;
        this.redirectUri = redirectUri;
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();

        byte[] keyStoreFile = Base64.getDecoder().decode(securityProperties.getKeyStoreEncodedFile());
        ByteArrayResource resource = new ByteArrayResource(keyStoreFile);

        KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(resource,
                securityProperties.getKeyStorePassword().toCharArray()
        );

        converter.setKeyPair(keyStoreKeyFactory.getKeyPair(securityProperties.getAlias()));
        endpoints.userDetailsService(userDetailsService).tokenStore(new JwtTokenStore(converter))
                .accessTokenConverter(converter).authenticationManager(authenticationManager)
                .pathMapping("/oauth/token", "/api/v1/oauth/token")
                .pathMapping("/oauth/authorize", "/api/v1/oauth/authorize")
                .pathMapping("/oauth/check_token", "/api/v1/oauth/check_token");
    }


    @Override
    public void configure(AuthorizationServerSecurityConfigurer oauthServer) {
        oauthServer.checkTokenAccess("isAuthenticated()");
        oauthServer.allowFormAuthenticationForClients();
        oauthServer.passwordEncoder(passwordEncoder());
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory().withClient(oAuth2ClientProperties.getClientId())
                .secret(passwordEncoder().encode(oAuth2ClientProperties.getClientSecret())).redirectUris(redirectUri)
                .autoApprove(true)
                .authorizedGrantTypes("authorization_code", "refresh_token", "client_credentials", "password")
                .scopes("scope");
    }

    /**
     * Password encoder.
     *
     * @return PasswordEncoder instance with BCryptPasswordEncoder implementation.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Resource server config.
     */
    @Configuration
    @EnableResourceServer
    protected class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {

        @Value("${security.oauth2.resource.id}")
        private String resourceId;
        @Value("${security.oauth2.resource.jwt.keyValue}")
        private String epamKeyValue;

        @Override
        public void configure(ResourceServerSecurityConfigurer resources) {
            resources.resourceId(resourceId);
        }

        @Override
        public void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests().antMatchers("/api/v1/oauth/me").authenticated()
                    .and().authorizeRequests().antMatchers("/**").authenticated()
                    .and().csrf().disable();
        }

        @Bean
        public JwtAccessTokenConverter epamTokenConverter() {
            DefaultUserAuthenticationConverter userTokenConverter = new DefaultUserAuthenticationConverter();
            userTokenConverter.setUserDetailsService(userDetailsService);
            DefaultAccessTokenConverter accessTokenConverter = new DefaultAccessTokenConverter();
            accessTokenConverter.setUserTokenConverter(userTokenConverter);
            accessTokenConverter.setIncludeGrantType(false);
            accessTokenConverter.setClientIdAttribute("appid");
            JwtAccessTokenConverter converter = new EpamJwtAccessTokenConverter(userService);
            converter.setVerifierKey(epamKeyValue);
            converter.setAccessTokenConverter(accessTokenConverter);
            return converter;
        }

        @Bean
        public TokenStore jwtTokenStore() {
            return new JwtTokenStore(epamTokenConverter());
        }

        /**
         * LoadBalancerInterceptor for intercepting will be used.
         *
         * @param oAuth2ClientContext OAuth2ClientContext
         * @param resource resource details
         * @param loadBalancerInterceptor RetryLoadBalancerInterceptor
         * @return OAuth2FeignRequestInterceptor
         */
        @Bean
        public RequestInterceptor oauth2FeignRequestInterceptor(
                OAuth2ClientContext oAuth2ClientContext, OAuth2ProtectedResourceDetails resource,
                LoadBalancerInterceptor loadBalancerInterceptor
        ) {
            OAuth2FeignRequestInterceptor interceptor = new OAuth2FeignRequestInterceptor(
                    oAuth2ClientContext, resource
            );
            ClientCredentialsAccessTokenProvider accessTokenProvider = new ClientCredentialsAccessTokenProvider();
            accessTokenProvider.setInterceptors(Collections.singletonList(loadBalancerInterceptor));
            interceptor.setAccessTokenProvider(accessTokenProvider);
            return interceptor;
        }

    }
}
