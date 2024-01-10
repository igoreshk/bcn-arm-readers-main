package com.epam.beacons.cloud.service.uaa.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * {@link UserDetailsService} implementation.
 *
 * @author Niyaz Bikbaev
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final String ROLE_PREFIX = "ROLE_";

    private final UserService userService;

    public UserDetailsServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.epam.beacons.cloud.service.uaa.domain.User user = userService.findByLogin(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + user.getRole()));

        /*
        Authentication is performed by SSO so we do not store a password
        TODO: seems that UserDetailsService is used only to extract authorities in EpamJwtAccessTokenConverter,
         consider removing it
        */
        return new User(username, "", grantedAuthorities);
    }
}
