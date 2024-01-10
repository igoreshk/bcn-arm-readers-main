package com.epam.beacons.cloud.gateway.security;

import com.epam.beacons.cloud.gateway.feign.UaaRemoteService;
import java.util.Collection;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class UserAccessDecisionVoter implements AccessDecisionVoter {

    private final UaaRemoteService uaaRemoteService;

    public UserAccessDecisionVoter(UaaRemoteService uaaRemoteService) {
        this.uaaRemoteService = uaaRemoteService;
    }

    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    @Override
    public boolean supports(Class clazz) {
        return true;
    }

    @Override
    public int vote(Authentication authentication, Object object, Collection collection) {
        if (authentication.isAuthenticated()) {
            String login = authentication.getName();
            if (uaaRemoteService.isInactive(login)) {
                return ACCESS_DENIED;
            }
        }

        return ACCESS_ABSTAIN;
    }
}
