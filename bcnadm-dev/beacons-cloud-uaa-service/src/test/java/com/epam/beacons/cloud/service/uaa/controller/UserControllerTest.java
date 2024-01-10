package com.epam.beacons.cloud.service.uaa.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.uaa.domain.RoleName;
import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.epam.beacons.cloud.service.uaa.domain.UserStatus;
import com.epam.beacons.cloud.service.uaa.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.uaa.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.uaa.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.Objects;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Tests for user controller.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "spring.cloud.vault.enabled=false", "eureka.client.enabled=false"})
@ActiveProfiles({"LOCAL", "PRE-PROD"})
public class UserControllerTest {

    private static final String AVATAR_WAS_NOT_FOUND = "Avatar was not found";
    private static final String UNSUPPORTED_AVATAR_FORMAT = "Format of the original avatar is not supported or invalid";
    private static final String INVALID_EMAIL_FORMAT = "Provided string doesn't match specified pattern";
    private static final String INVALID_ENTITY_ID = "Invalid id was provided";
    private static final Logger LOGGER = LogManager.getLogger(UserControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String AVATAR_FORMAT = "image/png";
    private static final String ANONYMOUS_AVATAR_FORMAT = "image/jpeg";
    private static final String USERS_PATH = "/api/v1/users/";
    private static final LocalDateTime LAST_ENTRY = LocalDateTime.of(2021, 5, 1, 22, 10, 53);
    private final Class<UserDto> userDtoClass = UserDto.class;
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private UserService userService;
    @Value("classpath:avatar.png")
    private Resource avatarResource;
    @Value("classpath:avatarWithUnsupportedFormat.bmp")
    private Resource avatarWithUnsupportedFormatResource;
    @Value("classpath:anonymous.jpg")
    private Resource anonymousAvatarResource;
    private byte[] avatarAsByteArray;
    private byte[] avatarAsByteArrayWithUnsupportedFormat;
    private byte[] anonymousAvatarAsByteArray;

    @Before
    public void prepareData() {
        UserDto userDto = new UserDto();
        userDto.setEmail("user@epam.com");
        userDto.setLogin("user");
        userDto.setName("name");
        userDto.setLocale("ru");
        userDto.setRole(RoleName.ADMINISTRATOR);
        userDto.setStatus(UserStatus.ACTIVE);
        userDto.setLastEntry(LAST_ENTRY);
        userService.save(userDto);
    }

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Before
    public void prepareAvatars() throws IOException {
        avatarAsByteArray = IOUtils.toByteArray(avatarResource.getInputStream());
        avatarAsByteArrayWithUnsupportedFormat = IOUtils.toByteArray(
                avatarWithUnsupportedFormatResource.getInputStream());
        anonymousAvatarAsByteArray = IOUtils.toByteArray(anonymousAvatarResource.getInputStream());
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<UserDto> expectedCollection = userService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        LOGGER.info("GET ALL URL {}", USERS_PATH);
        final String contentAsString = mockMvc.perform(get(USERS_PATH)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<UserDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, userDtoClass)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<UserDto> dtos = userService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final UserDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = USERS_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        UserDto result = objectMapper.readValue(contentAsString, userDtoClass);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void testGetUserByLogin() throws Exception {
        UserDto user = new UserDto();
        user.setEmail("old@email.com");
        user.setName("first");
        user.setLogin("login");
        user.setEntityId("012345678901234567890123");
        user.setLastEntry(LocalDateTime.now());
        user = userService.save(user);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(UserDto.ISO_8601);
        String lastEntry = formatter.format(user.getLastEntry());

        mockMvc.perform((get("/api/v1/users/by-login/" + user.getLogin() + "/")))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId", is(user.getEntityId())))
                .andExpect(jsonPath("$.name", is(user.getName())))
                .andExpect(jsonPath("$.login", is(user.getLogin())))
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.lastEntry", is(lastEntry)));
    }

    @Test
    public void postTest() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("email@epam.com");
        userDto.setLogin("login");
        userDto.setName("Name");
        userDto.setLocale("ru");
        userDto.setRole(RoleName.USER);
        userDto.setStatus(UserStatus.ACTIVE);
        userDto.setLastEntry(LAST_ENTRY);
        byte[] content = objectMapper.writeValueAsBytes(userDto);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(UserDto.ISO_8601);
        String lastEntry = formatter.format(LAST_ENTRY);

        mockMvc.perform(post("/api/v1/users").contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.email").value(userDto.getEmail()))
                .andExpect(jsonPath("$.login").value(userDto.getLogin()))
                .andExpect(jsonPath("$.name").value(userDto.getName()))
                .andExpect(jsonPath("$.locale").value(userDto.getLocale()))
                .andExpect(jsonPath("$.role").value(userDto.getRole().toString()))
                .andExpect(jsonPath("$.status").value(userDto.getStatus().toString()))
                .andExpect(jsonPath("$.lastEntry").value(lastEntry));
    }

    @Test
    public void postShouldThrowNonUniqueValueExceptionIfUserExists() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setEmail("email@epam.com");
        userDto.setLogin("login");
        userDto.setName("Name");
        userDto.setLocale("ru");
        userDto.setRole(RoleName.USER);
        userDto.setStatus(UserStatus.ACTIVE);
        userDto.setLastEntry(LAST_ENTRY);
        byte[] content = objectMapper.writeValueAsBytes(userDto);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(UserDto.ISO_8601);
        String lastEntry = formatter.format(LAST_ENTRY);

        mockMvc.perform(post("/api/v1/users").contentType(MediaType.APPLICATION_JSON_VALUE).content(content));
        mockMvc.perform(post("/api/v1/users").contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().is4xxClientError())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof NonUniqueValueException));
    }

    @Test
    public void putTest() throws Exception {
        Collection<UserDto> userDtos = userService.findAll();
        UserDto userDto = userDtos.iterator().next();
        userDto.setEmail("newEmail@epam.com");
        userDto.setRole(RoleName.USER);
        byte[] content = objectMapper.writeValueAsBytes(userDto);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(UserDto.ISO_8601);
        String lastEntry = formatter.format(LAST_ENTRY);

        mockMvc.perform(put("/api/v1/users").contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(userDto.getEntityId()))
                .andExpect(jsonPath("$.email").value(userDto.getEmail()))
                .andExpect(jsonPath("$.login").value(userDto.getLogin()))
                .andExpect(jsonPath("$.name").value(userDto.getName()))
                .andExpect(jsonPath("$.locale").value(userDto.getLocale()))
                .andExpect(jsonPath("$.role").value(userDto.getRole().toString()))
                .andExpect(jsonPath("$.status").value(userDto.getStatus().toString()))
                .andExpect(jsonPath("$.lastEntry").value(lastEntry));
    }

    @Test
    public void testGetCurrentAvatarException() throws Exception {
        mockMvc.perform((get("/api/v1/users/current/image"))).andExpect(status().is4xxClientError())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof EntityNotFoundException))
                .andExpect(result -> assertEquals("User wasn't found", result.getResolvedException().getMessage()));
    }

    @Test
    @WithAnonymousUser
    public void testGetCurrentAvatarExceptionForAnonymous() throws Exception {
        mockMvc.perform((get("/api/v1/users/current/image"))).andExpect(status().is4xxClientError())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof EntityNotFoundException))
                .andExpect(result -> assertEquals("User wasn't found", result.getResolvedException().getMessage()));
    }

    @Test
    @WithMockUser("login")
    public void testGetCurrentAvatar() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userService.save(userDto);
        userService.saveAvatar(avatarAsByteArray, userDto.getLogin());

        mockMvc.perform((get("/api/v1/users/current/image"))).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.parseMediaType(AVATAR_FORMAT)))
                .andExpect(content().bytes(avatarAsByteArray));
    }

    @Test
    @WithAnonymousUser
    public void testGetCurrentAvatarForAnonymousUser() throws Exception {
        UserDto user = new UserDto();
        user.setLogin("Anonymous");
        userService.save(user);
        mockMvc.perform((get("/api/v1/users/current/image"))).andExpect(status().isOk())
                .andExpect(content().contentType(ANONYMOUS_AVATAR_FORMAT))
                .andExpect(content().bytes(anonymousAvatarAsByteArray));
    }

    @Test
    @WithMockUser
    public void testGetCurrentAvatarForUserWithoutImage() throws Exception {
        UserDto user = new UserDto();
        user.setLogin("login");
        user.setEmail("test@epam.com");
        userService.save(user);

        mockMvc.perform((get("/api/v1/users/current/image"))).andExpect(status().isOk())
                .andExpect(content().contentType(ANONYMOUS_AVATAR_FORMAT))
                .andExpect(content().bytes(anonymousAvatarAsByteArray));
    }

    @Test
    @WithMockUser("login")
    public void uploadAvatarTest() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userService.save(userDto);

        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", avatarAsByteArray);

        String urlTemplate = "/api/v1/users/current/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isCreated())
                .andExpect(result -> assertTrue(result.getResponse().containsHeader(HttpHeaders.LOCATION)))
                .andExpect(result -> assertTrue(Objects.requireNonNull(result.getResponse()
                                .getHeader(HttpHeaders.LOCATION)).contains(urlTemplate)));
    }

    @Test
    @WithMockUser("login")
    public void uploadAvatarThrowsIllegalArgumentExceptionIfAvatarAsByteArrayIsEmpty() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userService.save(userDto);

        byte[] emptyImageArray = new byte[0];
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", emptyImageArray);

        String urlTemplate = "/api/v1/users/current/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(AVATAR_WAS_NOT_FOUND,
                        Objects.requireNonNull(result.getResolvedException()).getMessage()));
    }

    @Test
    @WithMockUser("login")
    public void uploadAvatarThrowsIllegalArgumentExceptionIfAvatarFormatIsInvalid() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userService.save(userDto);

        byte[] invalidAvatar = {12, 13, 14, 15, 16, 17, 18};
        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", invalidAvatar);

        String urlTemplate = "/api/v1/users/current/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(UNSUPPORTED_AVATAR_FORMAT,
                        Objects.requireNonNull(result.getResolvedException()).getMessage()
                ));
    }

    @Test
    @WithMockUser("login")
    public void uploadAvatarThrowsIllegalArgumentExceptionIfAvatarFormatIsNotSupported() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setLogin("login");
        userService.save(userDto);

        MockMultipartFile mockMultipartFile = new MockMultipartFile("image", avatarAsByteArrayWithUnsupportedFormat);

        String urlTemplate = "/api/v1/users/current/image";
        mockMvc.perform(multipart(urlTemplate).file(mockMultipartFile))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(UNSUPPORTED_AVATAR_FORMAT,
                        Objects.requireNonNull(result.getResolvedException()).getMessage()
                ));
    }

    @Test
    @WithMockUser("login")
    public void testGetCurrentUser() throws Exception {
        UserDto user = new UserDto();
        user.setLogin("login");
        user.setEmail("test@test.com");
        user = userService.save(user);

        mockMvc.perform((get("/api/v1/users/current"))).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.login", is(user.getLogin())))
                .andExpect(jsonPath("$.entityId", is(user.getEntityId())));
    }

    @Test
    @WithAnonymousUser
    public void testGetCurrentAnonymousUser() throws Exception {
        mockMvc.perform((get("/api/v1/users/current"))).andExpect(status().isOk())
                .andExpect(jsonPath("$").doesNotExist());
    }

    @Test
    public void testUpdateEmail() throws Exception {
        UserDto user = new UserDto();
        user.setEmail("old@email.com");
        user.setName("Name");
        user.setLogin("login");
        user.setEntityId("012345678901234567890123");
        user = userService.save(user);

        String newEmail = "new@em.ai";
        user.setEmail(newEmail);

        byte[] userBytes = objectMapper.writeValueAsBytes(user);

        mockMvc.perform((put("/api/v1/users/")).contentType(MediaType.APPLICATION_JSON_VALUE).content(userBytes))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId", notNullValue()))
                .andExpect(jsonPath("$.login", is(user.getLogin())))
                .andExpect(jsonPath("$.email", is(newEmail)));
    }

    @Test
    public void isEmailExistsTest() throws Exception {
        UserDto user = new UserDto();
        user.setEmail("test@epam.com");
        userService.save(user);

        mockMvc.perform((get("/api/v1/users/check-email/" + user.getEmail())))
                .andExpect(status().isOk())
                .andExpect(result -> assertEquals("true", result.getResponse().getContentAsString()));
    }

    @Test
    public void isEmailExistsReturnsFalseIfEmailNotExists() throws Exception {
        String nonExistentEmail = "test@epam.com";
        boolean exists = userService.isUserEmailExists(nonExistentEmail);
        MvcResult mvcResult = mockMvc.perform(get("/api/v1/users/check-email/" + nonExistentEmail)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(String.valueOf(exists)))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andExpect(status().isOk())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertEquals("false", content);
    }

    @Test
    public void isEmailExistsThrowsIllegalArgumentExceptionIfEmailFormatIsInvalid() throws Exception {
        String invalidEmail = "test_epam.com";
        mockMvc.perform((get("/api/v1/users/check-email/" + invalidEmail)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(INVALID_EMAIL_FORMAT,
                        Objects.requireNonNull(result.getResolvedException()).getMessage()
                ));
    }

    @Test
    public void testIsLoginExists() throws Exception {
        String nonExistentLogin = "login";
        boolean exists = userService.isUserLoginExists(nonExistentLogin);
        MvcResult mvcResult = mockMvc.perform(get("/api/v1/users/check-login/" + nonExistentLogin)
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content(String.valueOf(exists)))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertEquals("false", content);
    }

    @Test
    public void findOneThrowsIllegalArgumentExceptionWhenReceiveInvalidEntityId() throws Exception {
        String invalidEntityId = "5@3$%tEst";
        mockMvc.perform((get("/api/v1/users/" + invalidEntityId))).andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(INVALID_ENTITY_ID,
                        Objects.requireNonNull(result.getResolvedException()).getMessage()
                ));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<UserDto> dtos = userService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final UserDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = USERS_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @After
    public void drop() {
        userService.deleteAll();
    }
}
