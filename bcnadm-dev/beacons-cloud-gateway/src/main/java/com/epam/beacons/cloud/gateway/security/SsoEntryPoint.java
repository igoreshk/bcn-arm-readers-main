package com.epam.beacons.cloud.gateway.security;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * SSO entry point.
 */
@Component
public class SsoEntryPoint implements AuthenticationEntryPoint {

    /**
     * Commences an authentication scheme.
     *
     * @param request       {@link HttpServletRequest}
     * @param response      {@link HttpServletResponse}
     * @param authException {@link AuthenticationException}
     * @throws IOException IOException
     */
    @Override
    public void commence(
            final HttpServletRequest request, final HttpServletResponse response,
            final AuthenticationException authException
    ) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
