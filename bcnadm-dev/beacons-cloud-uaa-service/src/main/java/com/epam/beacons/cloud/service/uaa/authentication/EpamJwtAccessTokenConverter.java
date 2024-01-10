package com.epam.beacons.cloud.service.uaa.authentication;

import com.epam.beacons.cloud.service.uaa.domain.RoleName;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.epam.beacons.cloud.service.uaa.domain.UserStatus;
import com.epam.beacons.cloud.service.uaa.service.UserService;
import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.UserAuthenticationConverter;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

public class EpamJwtAccessTokenConverter extends JwtAccessTokenConverter {

    private static final String USER_PRINCIPAL_NAME = "upn";

    private final UserService userService;

    public EpamJwtAccessTokenConverter(UserService userService) {
        this.userService = userService;
    }

    /**
     * {@inheritDoc}
     * The {@link JwtTokenStore#readAuthentication(String)} maps token into {@link OAuth2Authentication}. It happens
     * with 2 steps: <br>
     * - Maps token into map in {@link JwtAccessTokenConverter#decode(String)}<br>
     * - Create {@link OAuth2Authentication} in {@link JwtAccessTokenConverter#extractAuthentication(Map)} with help
     * {@link org.springframework.security.oauth2.provider.token.DefaultUserAuthenticationConverter#extractAuthentication(Map)
     * DefaultUserAuthenticationConverter.extractAuthentication(Map)}<br>
     * The main Spring's flow assumed that user's login stored in <b>user_name</b> claim, bust EPAM token stored login
     * in <b>upn</b> (User Principal Name) claim. This method add <b>user_name</b> claim, create new user and update
     * user's lastEntry field. All Beacons logic placed between 2 Spring's method, after decoding and before using
     * {@link org.springframework.security.oauth2.provider.token.DefaultUserAuthenticationConverter#extractAuthentication(Map)
     * DefaultUserAuthenticationConverter.extractAuthentication(Map)}
     */
    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> map) {
        Map<String, String> extendedMap = (Map<String, String>) map;
        if (map.containsKey(USER_PRINCIPAL_NAME)) {
            String login = (String) map.get(USER_PRINCIPAL_NAME);
            extendedMap.put(UserAuthenticationConverter.USERNAME, login);

            UserDto userDto = userService.getUserDtoByLogin(login);
            if (userDto == null) {
                userDto = createUser(login, extendedMap);
            }
            userDto.setLastEntry(LocalDateTime.now());
            userService.save(userDto);
        }
        return super.extractAuthentication(extendedMap);
    }

    private UserDto createUser(String login, Map<String, String> map) {
        UserDto userDto = new UserDto();
        userDto.setEmail(login);
        userDto.setLogin(login);
        userDto.setStatus(UserStatus.ACTIVE);
        userDto.setRole(RoleName.getDefault());

        String displayName = map.get("unique_name");
        userDto.setName(displayName);

        return userDto;
    }
}
