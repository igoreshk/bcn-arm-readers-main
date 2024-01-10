package com.epam.beacons.cloud.gateway.security;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * SSO logout success handler.
 */
@Component
public class SsoLogoutSuccessHandler extends SimpleUrlLogoutSuccessHandler {

    /**
     * After success logout returns user role.
     *
     * @param request        the request which caused the successful logout
     * @param response       the response
     * @param authentication the <tt>Authentication</tt> object which was cleared the authentication process.
     * @throws IOException if error
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        getRedirectStrategy().sendRedirect(request, response, "/");
    }
}
