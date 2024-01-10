package com.epam.beacons.cloud.monitor.service.oauth2;

import java.util.List;
import java.util.Map;
import org.springframework.boot.autoconfigure.security.oauth2.resource.AuthoritiesExtractor;
import org.springframework.boot.autoconfigure.security.oauth2.resource.FixedAuthoritiesExtractor;
import org.springframework.boot.autoconfigure.security.oauth2.resource.FixedPrincipalExtractor;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.OAuth2Request;
import org.springframework.security.oauth2.provider.token.ResourceServerTokenServices;

/**
 * Custom implementation {@link UserTokenInfoServices}.
 */
public class UserTokenInfoServices implements ResourceServerTokenServices {

    private final String userInfoEndpointUrl;
    private final String clientId;
    private final OAuth2RestOperations restTemplate;

    private final AuthoritiesExtractor authoritiesExtractor = new FixedAuthoritiesExtractor();
    private final PrincipalExtractor principalExtractor = new FixedPrincipalExtractor();

    /**
     * UserTokenInfoServices constructor.
     *
     * @param userInfoEndpointUrl userInfoEndpointUrl
     * @param clientId clientId
     */
    public UserTokenInfoServices(OAuth2RestOperations restTemplate, String userInfoEndpointUrl, String clientId) {
        this.restTemplate = restTemplate;
        this.userInfoEndpointUrl = userInfoEndpointUrl;
        this.clientId = clientId;
    }

    @Override
    public OAuth2Authentication loadAuthentication(String accessToken)
            throws AuthenticationException, InvalidTokenException {
        try {
            OAuth2AccessToken existingToken = restTemplate.getOAuth2ClientContext().getAccessToken();
            if (existingToken == null || !accessToken.equals(existingToken.getValue())) {
                DefaultOAuth2AccessToken token = new DefaultOAuth2AccessToken(accessToken);
                token.setTokenType(DefaultOAuth2AccessToken.BEARER_TYPE);
                restTemplate.getOAuth2ClientContext().setAccessToken(token);
            }
            @SuppressWarnings("unchecked")
            Map<String, Object> map = restTemplate.getForEntity(userInfoEndpointUrl, Map.class).getBody();
            Object principal = principalExtractor.extractPrincipal(map);
            principal = principal == null ? "unknown" : principal;
            List<GrantedAuthority> authorities = authoritiesExtractor.extractAuthorities(map);
            OAuth2Request request = new OAuth2Request(null, clientId, null, true, null, null, null, null, null);
            if (map.get("clientOnly") != null && Boolean.parseBoolean(map.get("clientOnly").toString())) {
                return new OAuth2Authentication(request, null);
            } else {
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        principal, "N/A", authorities
                );
                token.setDetails(map);
                return new OAuth2Authentication(request, token);
            }
        } catch (Exception ex) {
            throw new InvalidTokenException(accessToken, ex);
        }
    }

    @Override
    public OAuth2AccessToken readAccessToken(String accessToken) {
        throw new UnsupportedOperationException("Not supported: read access token");
    }
}
