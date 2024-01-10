package com.epam.beacons.cloud.service.uaa;

import static org.junit.Assert.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.uaa.domain.UserDto;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import java.util.Objects;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.OAuth2ClientProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.util.Base64Utils;

/**
 * Tests for uaa service.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false"})
@AutoConfigureMockMvc
@ActiveProfiles({"LOCAL", "PRE-PROD"})
public class UaaTests {

    @Autowired
    private OAuth2ClientProperties oAuth2ClientProperties;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    public void authorizationCodeFlowTest() throws Exception {
        UserDto dto = new UserDto();
        dto.setEmail("test@test.com");
        dto.setLogin("user");
        dto.setName("John");
        mongoTemplate.save(dto.toUser());

        MvcResult result = mockMvc.perform(
                get("/api/v1/oauth/authorize").with(user("user").password("user"))
                        .param("client_id", oAuth2ClientProperties.getClientId()).param("response_type", "code")
                        .param("redirect_uri", "http://bcn.lab.epam.com")).andExpect(status().is3xxRedirection())
                .andReturn();

        String[] splitedResponse = Objects.requireNonNull(result.getResponse().getRedirectedUrl()).split("=");
        String code = splitedResponse[1];

        mockMvc.perform(
                post("/api/v1/oauth/token").param("client_id", oAuth2ClientProperties.getClientId())
                        .param("client_secret", oAuth2ClientProperties.getClientSecret())
                        .param("grant_type", "authorization_code").param("redirect_uri", "http://bcn.lab.epam.com")
                        .param("code", code)

        ).andExpect(status().isOk());
    }

    /*
    @Test
    public void invalidUserCredentialsTest() throws Exception {

        MvcResult result = mockMvc.perform(post("/oauth/authorize")
                .param("client_id", CLIENT_ID)
                .param("response_type", "code")
                .param("redirect_uri", "http://www.example.com/test")
        )
                .andExpect(status().is3xxRedirection()).andReturn();

        // invalid login should redirect to login page
        assertTrue(result.getResponse().getRedirectedUrl().endsWith("/login"));
    }
    */

    @Test
    public void invalidClientCredentialsTest() throws Exception {
        UserDto dto = new UserDto();
        dto.setEmail("test2@test.com");
        dto.setLogin("user2");
        mongoTemplate.save(dto.toUser());

        String clientCredentials =
                oAuth2ClientProperties.getClientId() + ":" + oAuth2ClientProperties.getClientSecret() + "test";

        mockMvc.perform(post("/api/v1/oauth/token")
                .header("Authorization", "Basic " + Base64Utils.encodeToUrlSafeString(clientCredentials.getBytes()))
                .param("grant_type", "authorization_code").param("redirect_uri", "http://bcn.lab.epam.com")
                .param("code", "some_code")).andExpect(status().is4xxClientError());
    }


    @Test
    public void checkTokenTest() throws Exception {
        UserDto dto = new UserDto();
        dto.setEmail("test3@test.com");
        dto.setLogin("user3");
        dto.setName("Michael");
        mongoTemplate.save(dto.toUser());

        MvcResult result = mockMvc.perform(
                post("/api/v1/oauth/authorize").with(user("user3").password("user"))
                        .param("client_id", oAuth2ClientProperties.getClientId()).param("response_type", "code")
                        .param("redirect_uri", "http://bcn.lab.epam.com")).andReturn();

        String[] splitedResponse = Objects.requireNonNull(result.getResponse().getRedirectedUrl()).split("=");
        String code = splitedResponse[1];

        result = mockMvc.perform(post("/api/v1/oauth/token")
                .with(httpBasic(oAuth2ClientProperties.getClientId(), oAuth2ClientProperties.getClientSecret()))
                .param("grant_type", "authorization_code").param("redirect_uri", "http://bcn.lab.epam.com")
                .param("code", code)

        ).andExpect(status().isOk()).andReturn();

        String tokenResponse = result.getResponse().getContentAsString();
        DocumentContext documentContext = JsonPath.parse(tokenResponse);
        JsonPath jsonPath = JsonPath.compile("$.access_token");
        String token = documentContext.read(jsonPath).toString();

        result = mockMvc.perform(post("/api/v1/oauth/check_token")
                .with(httpBasic(oAuth2ClientProperties.getClientId(), oAuth2ClientProperties.getClientSecret()))
                .param("token", token).accept(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk()).andReturn();

        String checkTokenResponse = result.getResponse().getContentAsString();
        String userName = JsonPath.parse(checkTokenResponse).read(JsonPath.compile("$.user_name")).toString();
        assertEquals(dto.getLogin(), userName);
    }
}
