package com.epam.beacons.cloud.gateway.security;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * SSO login success handler.
 */
@Component
public class SsoLoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler implements
        AuthenticationSuccessHandler {

    private static final int TIME_INTERVAL_SECONDS = 60 * 15;

    /**
     * After success login returns user role.
     *
     * @param request        the request which caused the successful authentication
     * @param response       the response
     * @param authentication the <tt>Authentication</tt> object which was created during the authentication process.
     * @throws IOException IOException
     */
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication
    ) throws IOException {

        request.getSession().setMaxInactiveInterval(TIME_INTERVAL_SECONDS);
        getRedirectStrategy().sendRedirect(request, response, "/");
        clearAuthenticationAttributes(request);
    }
}
