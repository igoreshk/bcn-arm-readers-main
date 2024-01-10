package com.epam.beacons.cloud.service.uaa.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.xpath;

import com.epam.beacons.cloud.service.uaa.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.uaa.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.uaa.service.UserService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class UaaControllerExceptionHandlerTest {

    private UaaControllerExceptionHandler controllerExceptionHandler = new UaaControllerExceptionHandler();
    private MockMvc mockMvc;
    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.mockMvc = MockMvcBuilders.standaloneSetup(userController).setControllerAdvice(controllerExceptionHandler)
                .build();
    }

    @Test
    public void handleIllegalArgumentException() throws Exception {

        when(userService.findAll()).thenThrow(new IllegalArgumentException("IllegalArgumentException caught"));

        mockMvc.perform(get("/api/v1/users")).andExpect(status().isBadRequest())
                .andExpect(xpath("ExceptionResponseDto/message").string("IllegalArgumentException caught"));
    }

    @Test
    public void handleEntityNotFoundException() throws Exception {

        when(userService.findAll()).thenThrow(new EntityNotFoundException("EntityNotFoundException caught"));

        mockMvc.perform(get("/api/v1/users")).andExpect(status().isBadRequest())
                .andExpect(xpath("ExceptionResponseDto/message").string("EntityNotFoundException caught"));
    }


    @Test
    public void handleNonUniqueValueException() throws Exception {

        when(userService.findAll()).thenThrow(new NonUniqueValueException("NonUniqueValueException caught",
                new DuplicateKeyException("Duplicate exception")));

        mockMvc.perform(get("/api/v1/users")).andExpect(status().is4xxClientError())
                .andExpect(xpath("ExceptionResponseDto/message").string("NonUniqueValueException caught"));
    }

    @Test
    public void handleUnexpectedException() throws Exception {

        when(userService.findAll()).thenThrow(new RuntimeException("UnexpectedException caught"));

        mockMvc.perform(get("/api/v1/users")).andExpect(status().isInternalServerError())
                .andExpect(xpath("ExceptionResponseDto/message").string("UnexpectedException caught"));

    }
}
