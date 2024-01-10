package com.epam.beacons.cloud.service.uaa.authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import com.epam.beacons.cloud.service.uaa.domain.RoleName;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.epam.beacons.cloud.service.uaa.domain.UserStatus;
import com.epam.beacons.cloud.service.uaa.service.UserService;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
public class EpamJwtAccessTokenConverterTest {

    private static final String UNIQUE_NAME = "unique_name";
    private static final String USER_PRINCIPAL_NAME = "upn";

    private MockMvc mockMvc;
    @Autowired
    private WebApplicationContext webApplicationContext;

    @SpyBean
    private UserService userService;
    private EpamJwtAccessTokenConverter converter;

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Before
    public void init() {
        converter = new EpamJwtAccessTokenConverter(userService);
        converter.setAccessTokenConverter(new DefaultAccessTokenConverter());
    }

    @Test
    public void newUserAddingTest() {
        String login = "test@test.com";
        Map<String, String> convertMap = new HashMap<>();
        convertMap.put(USER_PRINCIPAL_NAME, login);
        convertMap.put(UNIQUE_NAME, "Name");

        UserDto expected = new UserDto();
        expected.setLogin(login);
        expected.setName("Name");
        expected.setEmail("test@test.com");
        expected.setStatus(UserStatus.ACTIVE);
        expected.setRole(RoleName.getDefault());
        LocalDateTime localDateTime = LocalDateTime.now().minusSeconds(1);

        converter.extractAuthentication(convertMap);
        UserDto actualDto = userService.getUserDtoByLogin(login);
        assertThat(actualDto)
                .usingRecursiveComparison()
                .ignoringFields("entityId", "lastEntry")
                .isEqualTo(expected);
        assertThat(actualDto.getLastEntry()).isCloseTo(localDateTime, within(1, ChronoUnit.MINUTES));
        assertThat(actualDto.getLastEntry()).isAfter(localDateTime);
    }

    @Test
    public void existUserShouldNotUpdateTest() {
        String login = "test@test.com";

        UserDto expected = new UserDto();
        expected.setLogin(login);
        expected.setName("Name");
        expected.setEmail("expected@expected.com");
        expected.setStatus(UserStatus.INACTIVE);
        expected.setRole(RoleName.ADMINISTRATOR);
        expected.setLastEntry(LocalDateTime.now().minusDays(1));
        expected = userService.save(expected);

        Map<String, String> convertMap = new HashMap<>();
        convertMap.put(USER_PRINCIPAL_NAME, login);
        convertMap.put(UNIQUE_NAME, "NewName");
        LocalDateTime localDateTime = LocalDateTime.now().minusSeconds(1);
        converter.extractAuthentication(convertMap);
        UserDto actualDto = userService.getUserDtoByLogin(login);
        assertThat(actualDto)
                .usingRecursiveComparison()
                .ignoringFields("lastEntry")
                .isEqualTo(expected);
        assertThat(actualDto.getLastEntry()).isCloseTo(localDateTime, within(1, ChronoUnit.MINUTES));
        assertThat(actualDto.getLastEntry()).isAfter(localDateTime);
    }

    @Test
    public void withoutUpnKeyUserServiceShouldNotInvokeTest() {
        Map<String, String> convertMap = new HashMap<>();
        convertMap.put(UNIQUE_NAME, "NewName");
        converter.extractAuthentication(convertMap);
        verify(userService, Mockito.never()).save(any());
        verify(userService, Mockito.never()).getUserDtoByLogin(any());
    }

    @After
    public void drop() {
        userService.deleteAll();
    }
}
