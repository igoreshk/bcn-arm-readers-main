package com.epam.beacons.cloud.monitor.service.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.xpath;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.exception.EntityNotFoundException;
import com.epam.beacons.cloud.monitor.service.exception.NonUniqueValueException;
import com.epam.beacons.cloud.monitor.service.service.VisitorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import feign.Request;
import feign.RequestTemplate;
import java.util.HashMap;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class MonitorControllerExceptionHandlerTest {

    private static final String VISITORS_PATH = "/api/v1/visitors";
    private MonitorControllerExceptionHandler controllerExceptionHandler = new MonitorControllerExceptionHandler();
    private MockMvc mockMvc;

    @Mock
    private VisitorService visitorService;

    @InjectMocks
    private VisitorController visitorController;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(visitorController)
                .setControllerAdvice(controllerExceptionHandler)
                .build();
    }

    @Test
    public void testHandleIllegalArgumentException() throws Exception {
        when(visitorService.findAll()).thenThrow(new IllegalArgumentException("IllegalArgumentException caught"));
        mockMvc.perform(get(VISITORS_PATH)).andExpect(status().isBadRequest())
                .andExpect(xpath("ExceptionResponseDto/message").string("IllegalArgumentException caught"));
    }

    @Test
    public void testHandleEntityNotFoundException() throws Exception {
        when(visitorService.findAll()).thenThrow(new EntityNotFoundException("EntityNotFoundException caught"));
        mockMvc.perform(get(VISITORS_PATH)).andExpect(status().isNotFound())
                .andExpect(xpath("ExceptionResponseDto/message").string("EntityNotFoundException caught"));
    }

    @Test
    public void testHandleFeignException() throws Exception {
        Request request = Request.create(Request.HttpMethod.GET, VISITORS_PATH,
                new HashMap<>(), null, new RequestTemplate());
        when(visitorService.findAll())
                .thenThrow(new FeignException.BadRequest("FeignException caught", request, null));
        mockMvc.perform(get(VISITORS_PATH)).andExpect(status().isBadRequest())
                .andExpect(xpath("ExceptionResponseDto/message").string("FeignException caught"));
    }

    @Test
    public void testHandleUnexpectedException() throws Exception {
        when(visitorService.findAll()).thenThrow(new RuntimeException("UnexpectedException caught"));
        mockMvc.perform(get(VISITORS_PATH)).andExpect(status().isInternalServerError())
                .andExpect(xpath("ExceptionResponseDto/message").string("UnexpectedException caught"));
    }

    @Test
    public void testNonUniqueValueException() throws Exception {
        VisitorDto visitorDto = new VisitorDto();
        visitorDto.setDeviceId("deviceId");
        visitorDto.setName("name");
        visitorDto.setType(DeviceType.EMITTER);
        when(visitorService.save(visitorDto))
                .thenThrow(new NonUniqueValueException("NonUniqueValueException caught", new RuntimeException()));
        mockMvc.perform(post(VISITORS_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(visitorDto)))
                .andExpect(status().isBadRequest())
                .andExpect(xpath("ExceptionResponseDto/message")
                        .string("NonUniqueValueException caught"));
    }
}
