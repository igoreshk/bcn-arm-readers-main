package com.epam.beacons.cloud.service.mobile.oauth2;

import feign.RequestInterceptor;
import java.util.Collections;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingClass;
import org.springframework.boot.autoconfigure.security.oauth2.OAuth2ClientProperties;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor;
import org.springframework.cloud.client.loadbalancer.RetryLoadBalancerInterceptor;
import org.springframework.cloud.security.oauth2.client.feign.OAuth2FeignRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsAccessTokenProvider;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

/**
 * Resource server for configuring security.
 */
@EnableWebSecurity
@EnableResourceServer
public class ResourceServerSecurityConfigurator implements ResourceServerConfigurer {

    private final OAuth2ClientProperties oAuth2ClientProperties;
    private final OAuth2RestTemplate restTemplate;
    private final ResourceServerProperties resourceServerProperties;
    private final OAuth2FeignRequestInterceptor interceptor;

    public ResourceServerSecurityConfigurator(
            OAuth2ClientContext oAuth2ClientContext, OAuth2ProtectedResourceDetails resource,
            OAuth2ClientProperties oAuth2ClientProperties, ResourceServerProperties resourceServerProperties
    ) {
        this.restTemplate = new OAuth2RestTemplate(resource, oAuth2ClientContext);
        this.interceptor = new OAuth2FeignRequestInterceptor(oAuth2ClientContext, resource);
        this.oAuth2ClientProperties = oAuth2ClientProperties;
        this.resourceServerProperties = resourceServerProperties;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        UserTokenInfoServices tokenServices = new UserTokenInfoServices(
                restTemplate,
                resourceServerProperties.getUserInfoUri(),
                oAuth2ClientProperties.getClientId()
        );
        resources.tokenServices(tokenServices);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/**").authenticated().and().csrf().disable();
    }

    @Bean
    @LoadBalanced
    public OAuth2RestTemplate restTemplate() {
        return restTemplate;
    }

    /**
     * RetryLoadBalancerInterceptor for intercepting will be used,
     *
     * <p>if RetryTemplate in classpath present.
     *
     * @param loadBalancerInterceptor RetryLoadBalancerInterceptor
     * @return OAuth2FeignRequestInterceptor
     */
    @Bean
    @ConditionalOnClass(name = "org.springframework.retry.support.RetryTemplate")
    public RequestInterceptor retryOauth2FeignRequestInterceptor(
            RetryLoadBalancerInterceptor loadBalancerInterceptor
    ) {
        return interceptor(loadBalancerInterceptor);
    }

    /**
     * LoadBalancerInterceptor for intercepting will be used,
     *
     * <p>if org.springframework.retry.support.RetryTemplate
     * in classpath <b>NOT  present</b>.
     *
     * @param loadBalancerInterceptor RetryLoadBalancerInterceptor
     * @return OAuth2FeignRequestInterceptor
     */
    @Bean
    @ConditionalOnMissingClass("org.springframework.retry.support.RetryTemplate")
    public RequestInterceptor oauth2FeignRequestInterceptor(LoadBalancerInterceptor loadBalancerInterceptor) {
        return interceptor(loadBalancerInterceptor);
    }

    private RequestInterceptor interceptor(ClientHttpRequestInterceptor loadBalancerInterceptor) {
        ClientCredentialsAccessTokenProvider accessTokenProvider = new ClientCredentialsAccessTokenProvider();
        accessTokenProvider.setInterceptors(Collections.singletonList(loadBalancerInterceptor));
        interceptor.setAccessTokenProvider(accessTokenProvider);
        return interceptor;
    }
}
