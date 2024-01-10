package com.epam.beacons.cloud.gateway.security;

import com.epam.beacons.cloud.gateway.domain.RoleName;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.vote.AuthenticatedVoter;
import org.springframework.security.access.vote.RoleVoter;
import org.springframework.security.access.vote.UnanimousBased;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.expression.WebExpressionVoter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * SSO security config.
 */
@Configuration
@EnableOAuth2Sso
@EnableWebSecurity
public class SsoSecurityConfig extends WebSecurityConfigurerAdapter {

    private static final long oneYearInSeconds = 31536000;

    private final OAuth2ClientAuthenticationProcessingFilter ssoFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final SsoLogoutSuccessHandler logoutSuccessHandler;
    private final AccessDecisionVoter userAccessDecisionVoter;
    @Value("${endpoints.cors.origins: #{null}}")
    private String[] origins;

    public SsoSecurityConfig(
            OAuth2ClientAuthenticationProcessingFilter ssoFilter, AuthenticationEntryPoint authenticationEntryPoint,
            SsoLogoutSuccessHandler logoutSuccessHandler, AccessDecisionVoter userAccessDecisionVoter
    ) {
        this.ssoFilter = ssoFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.logoutSuccessHandler = logoutSuccessHandler;
        this.userAccessDecisionVoter = userAccessDecisionVoter;
    }

    /**
     * SSO http config.
     *
     * @param http configurer
     * @throws Exception exception
     */
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.headers().httpStrictTransportSecurity().includeSubDomains(true).maxAgeInSeconds(oneYearInSeconds);
        http.csrf().disable().cors().and().authorizeRequests()
                .antMatchers(HttpMethod.GET,
                        "/api/v1/favicon.ico", "/static/**", "/rest/**", "/api/v1/oauth/**",
                        "/api/v1/roles/**", "/api/v1/users/current/**", "/*.jpg"
                ).hasAnyRole(RoleName.ADMINISTRATOR.name(), RoleName.USER.name(), RoleName.WATCHER.name())
                .antMatchers("/api/v1/beacons/**", "/api/v1/buildings/**",
                        "/api/v1/edges/**", "/api/v1/levels/**",
                        "/api/v1/areas/**", "/api/v1/scale/**",
                        "/api/v1/scale-vertex/**", "/api/v1/vertices/**", "api/v1/route/**"
                ).hasAnyRole(RoleName.ADMINISTRATOR.name(), RoleName.USER.name())
                .antMatchers("/api/v1/visitors/**", "/api/v1/visitor-groups/**")
                .hasAnyRole(RoleName.ADMINISTRATOR.name(), RoleName.WATCHER.name())
                .antMatchers("/api/v1/users/**", "/api/v1/favicon.ico",
                        "/api/v1/oauth/**", "/static/**", "/rest/**", "/*.jpg"
                ).hasRole(RoleName.ADMINISTRATOR.name()).antMatchers("/login*").permitAll().anyRequest().authenticated()
                .accessDecisionManager(accessDecisionManager()).and().exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint).and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/api/v1/logout"))
                .deleteCookies("JSESSIONID").invalidateHttpSession(true).logoutSuccessHandler(logoutSuccessHandler)
                .and().sessionManagement().maximumSessions(1).expiredUrl("/api/v1/login")
                .maxSessionsPreventsLogin(false);
        http.addFilterAfter(ssoFilter, BasicAuthenticationFilter.class);
        http.headers().contentSecurityPolicy(
                "base-uri 'self'; object-src 'none';" + "script-src 'self'; default-src'self'; style-src'self';"
                        + "frame-ancestors 'self'; worker-src https:; object-src 'none';"
                        + "font-src https:; img-src https://*.epam.com data: https: 'self';");
    }

    @Bean
    @ConditionalOnProperty(value = "endpoints.cors.enabled")
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(origins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AccessDecisionManager accessDecisionManager() {
        List<AccessDecisionVoter<?>> decisionVoters = Arrays
                .asList(new WebExpressionVoter(), new RoleVoter(), new AuthenticatedVoter(), userAccessDecisionVoter);

        return new UnanimousBased(decisionVoters);
    }
}
