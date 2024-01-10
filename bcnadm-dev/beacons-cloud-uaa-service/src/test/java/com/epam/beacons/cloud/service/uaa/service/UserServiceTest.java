package com.epam.beacons.cloud.service.uaa.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

import com.epam.beacons.cloud.service.uaa.domain.RoleName;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.epam.beacons.cloud.service.uaa.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.uaa.exception.NonUniqueValueException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Tests for {@link UserService}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
public class UserServiceTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserService userService;

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @After
    public void cleanup() {
        userService.deleteAll();
    }

    @Test
    public void getUserDtoByLogin() {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userDto.setEmail("mail");
        userService.save(userDto);

        assertNotNull(userService.getUserDtoByLogin("login"));
        assertNull(userService.getUserDtoByLogin("incorrectLogin"));
    }

    @Test
    public void getUserByLogin() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userService.save(userDto);

        assertNotNull(userService.getUserByLogin("login"));
        assertThrows(EntityNotFoundException.class, () -> userService.getUserByLogin("incorrectLogin"));
    }

    @Test(expected = IllegalArgumentException.class)
    public void isUserEmailExists() {
        UserDto userDto = new UserDto();
        userDto.setLogin("login2");
        userDto.setEmail("email@epam.com");
        userService.save(userDto);

        assertTrue(userService.isUserEmailExists("email@epam.com"));
        assertFalse(userService.isUserEmailExists("absentEmail"));
    }

    @Test
    public void isUserLoginExists() {
        UserDto userDto = new UserDto();
        userDto.setLogin("login3");
        userDto.setName("Name");
        userService.save(userDto);

        assertTrue(userService.isUserLoginExists("login3"));
        assertFalse(userService.isUserLoginExists("absentLogin"));
    }

    @Test
    public void setUserRole() {
        UserDto userDto = new UserDto();
        String login = "login5";
        userDto.setLogin(login);
        userDto.setEmail("mail5");
        userDto.setRole(RoleName.USER);
        userService.save(userDto);

        UserDto actualUser = userService.getUserDtoByLogin(login);
        assertEquals(RoleName.USER, actualUser.getRole());
    }

    @Test(expected = NonUniqueValueException.class)
    public void saveDuplicateLoginAndEmailException() {
        UserDto userDto = new UserDto();
        userDto.setLogin("duplicate");
        userDto.setEmail("a@.com");
        userService.save(userDto);
        userService.save(userDto);
    }

    @Test(expected = NonUniqueValueException.class)
    public void saveDuplicateEmailException() {
        UserDto userDto = new UserDto();
        UserDto userDuplicateDto = new UserDto();
        userDto.setLogin("a");
        userDto.setEmail("duplicate@.com");
        userDuplicateDto.setLogin("b");
        userDuplicateDto.setEmail("duplicate@.com");
        userService.save(userDto);
        userService.save(userDuplicateDto);
    }

    @Test
    public void save() {
        UserDto user = new UserDto();
        user.setLogin("login6");
        user.setRole(RoleName.ADMINISTRATOR);
        user.setEmail("mail6");
        UserDto result = userService.save(user);

        assertEquals("login6", result.getLogin());
        assertEquals("mail6", result.getEmail());
        assertEquals(RoleName.ADMINISTRATOR, result.getRole());
        assertNotNull(result.getEntityId());
    }

    @Test
    public void update() {
        UserDto user = new UserDto();
        user.setLogin("login6");
        user.setRole(RoleName.ADMINISTRATOR);
        user.setEmail("mail6");
        userService.save(user);

        UserDto updateUser = new UserDto();
        updateUser.setEntityId(userService.findByLogin("login6").getId());
        updateUser.setRole(RoleName.USER);
        updateUser.setName("username");
        UserDto result = userService.update(updateUser);

        assertEquals("login6", result.getLogin());
        assertEquals("mail6", result.getEmail());
        assertEquals(RoleName.USER, result.getRole());
        assertEquals("username", result.getName());
        assertNotNull(result.getEntityId());
    }

    @Test
    public void updateThrowsIllegalArgumentExceptionIfIdNull() {
        UserDto user = new UserDto();
        user.setLogin("login6");
        user.setRole(RoleName.ADMINISTRATOR);
        user.setEmail("mail6");
        userService.save(user);

        UserDto updateUser = new UserDto();
        updateUser.setRole(RoleName.USER);
        updateUser.setName("username");
        assertThrows((IllegalArgumentException.class), () -> userService.update(updateUser));
    }

    @Test
    public void updateThrowsEntityNotFoundExceptionWhenUserNotExist() {
        UserDto user = new UserDto();
        user.setEntityId("620d9130ca5786263e451832");
        user.setLogin("login6");
        user.setRole(RoleName.ADMINISTRATOR);
        user.setEmail("mail6");
        assertThrows((EntityNotFoundException.class), () -> userService.update(user));
    }

    @Test
    public void deleteAllTest() {
        UserDto userDto1 = new UserDto();
        userDto1.setLogin("login1");
        userDto1.setEmail("email1");
        userDto1.setName("name1");
        userService.save(userDto1);
        UserDto userDto2 = new UserDto();
        userDto2.setLogin("login2");
        userDto2.setEmail("email2");
        userDto2.setName("name2");
        userService.save(userDto2);

        assertEquals(2,userService.findAll().size());
        userService.deleteAll();
        assertEquals(0, userService.findAll().size());
    }
}
