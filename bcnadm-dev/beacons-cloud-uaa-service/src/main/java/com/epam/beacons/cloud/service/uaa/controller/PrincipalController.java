package com.epam.beacons.cloud.service.uaa.controller;

import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * PrincipalController.
 **/
@RestController
@RequestMapping("/api/v1/oauth")
public class PrincipalController {

    /**
     * Returns user/token authentication.
     *
     * @param authentication current authentication
     * @return user/token authentication
     */
    @GetMapping("/me")
    public Object user(OAuth2Authentication authentication) {
        return authentication;
    }
}
