package com.epam.beacons.cloud.service.uaa.service;

import com.epam.beacons.cloud.service.uaa.domain.RoleName;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import java.util.ArrayList;
import java.util.List;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
public class UserDetailsServiceImplTest {

    private static final String EXISTING_USER = "test@email.com";
    private static final String NOT_EXISTING_USER = "test2@email.com";
    private static final String PASSWORD = "password";

    private MockMvc mockMvc;
    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private UserService userService;

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void loadExistingUserByUsername() {
        UserDto existingUserDto = new UserDto();
        existingUserDto.setEmail(EXISTING_USER);
        existingUserDto.setLogin(EXISTING_USER);
        existingUserDto.setRole(RoleName.USER);
        userService.save(existingUserDto);

        List<GrantedAuthority> expectedAuthorities = new ArrayList<>();
        expectedAuthorities.add(new SimpleGrantedAuthority("USER"));
        UserDetails expected = new User(EXISTING_USER, PASSWORD, expectedAuthorities);

        Assert.assertEquals(expected, userDetailsService.loadUserByUsername(EXISTING_USER));
    }

    @Test(expected = UsernameNotFoundException.class)
    public void loadNotExistingUserByUsername() {
        userDetailsService.loadUserByUsername(NOT_EXISTING_USER);
    }
}
