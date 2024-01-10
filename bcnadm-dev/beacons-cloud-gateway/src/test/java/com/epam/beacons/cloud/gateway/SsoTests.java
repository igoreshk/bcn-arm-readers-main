package com.epam.beacons.cloud.gateway;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.gateway.feign.UaaRemoteService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.client.token.AccessTokenProvider;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Sso service tests.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {
        "spring.cloud.config.discovery.enabled=false",
        "spring.cloud.config.enabled=false",
        "spring.cloud.vault.enabled=false",
        "eureka.client.enabled=false"
})
@AutoConfigureMockMvc
@MockBean(classes = {AccessTokenProvider.class, UserInfoTokenServices.class, UaaRemoteService.class})
public class SsoTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    public void authorizedUserGetsAccessTest() throws Exception {
        mockMvc.perform(get("/api/v1/ping")).andExpect(status().isOk());
    }

    @Test
    public void unauthorizedUserGetsErrorTest() throws Exception {
        mockMvc.perform(get("/api/v1/ping")).andExpect(status().isUnauthorized());
    }
}
