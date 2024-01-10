package com.epam.beacons.cloud.service.mobile.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.mobile.domain.MobileDto;
import com.epam.beacons.cloud.service.mobile.service.MobileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Tests for {@link MobileController}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(properties = {"spring.kafka.property.bootstrap.servers=someServer",
        "spring.kafka.property.retries=0", "spring.kafka.property.batch.size=16384",
        "spring.kafka.property.linger.ms=1", "spring.kafka.property.buffer.memory=33554432"})
public class MobileControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(MobileControllerTest.class);
    private static final String MOBILE_PATH = "/api/v1/mobile/";
    private MockMvc mockMvc;

    @MockBean
    MobileService mobileService;

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private WebApplicationContext webApplicationContext;

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    /**
     * Provide mobile dto.
     *
     * @return mobileDto.
     */
    private MobileDto provideMobileDto() {
        String levelId = String.format("abcdf%019d", 1);
        String deviceId = String.format("abcdf%019d", 2);
        LocalDateTime localDateTime = LocalDateTime.now();

        MobileDto mobileDto = new MobileDto();
        mobileDto.setTimestamp(localDateTime);
        mobileDto.setLatitude(5.0);
        mobileDto.setLongitude(5.0);
        mobileDto.setLevelId(levelId);
        mobileDto.setDeviceId(deviceId);
        mobileDto.setHeartRate(88);
        mobileDto.setBodyTemperature(36.6);
        mobileDto.setStepCount(5000);
        return mobileDto;
    }

    @Test
    public void acceptMobileDataShouldReturnHttpStatusAcceptedWhenDataIsAccepted() throws Exception {
        MobileDto toAccept = provideMobileDto();

        byte[] content = objectMapper.writeValueAsBytes(toAccept);

        String urlTemplate = String.format("%shistory/visitors", MOBILE_PATH);
        LOGGER.info("POST URL {}", urlTemplate);
        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isAccepted());
    }

    @Test
    public void acceptMobileDataShouldThrowWhenDeviceIdIsNull() throws Exception {
        MobileDto toAccept = provideMobileDto();
        toAccept.setDeviceId(null);

        byte[] content = objectMapper.writeValueAsBytes(toAccept);

        String urlTemplate = String.format("%shistory/visitors", MOBILE_PATH);
        LOGGER.info("POST URL {}", urlTemplate);
        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isBadRequest());
    }

}
