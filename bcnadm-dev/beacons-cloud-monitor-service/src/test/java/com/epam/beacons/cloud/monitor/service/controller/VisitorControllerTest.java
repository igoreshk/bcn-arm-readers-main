package com.epam.beacons.cloud.monitor.service.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.service.TrilaterationService;
import com.epam.beacons.cloud.monitor.service.service.VisitorGroupService;
import com.epam.beacons.cloud.monitor.service.service.VisitorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
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
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.WebApplicationContext;

/**
 * Tests for {@link VisitorController}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@MockBean(TrilaterationService.class)
public class VisitorControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(VisitorControllerTest.class);

    private static final String DTO_IS_NULL = "VisitorDto is null";
    private static final String DTO_NOT_PRESENTED = "VisitorDto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "VisitorDto collection is null";
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String VISITORS_PATH = "/api/v1/visitors/";
    private final Class<VisitorDto> visitorDtoClass = VisitorDto.class;
    protected MockMvc mockMvc;

    @Autowired
    private VisitorController visitorController;
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private VisitorGroupService visitorGroupService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private WebApplicationContext webApplicationContext;

    @Before
    public void prepareData() {
        VisitorDto visitorDto = new VisitorDto();
        visitorDto.setName("Name");
        visitorDto.setDeviceId("b7b6b5b4b2b1b0");
        visitorDto.setType(DeviceType.EMITTER);
        visitorService.save(visitorDto);
    }

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<VisitorDto> expectedCollection = visitorService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        LOGGER.info("GET ALL URL {}", VISITORS_PATH);
        final String contentAsString = mockMvc.perform(get(VISITORS_PATH)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<VisitorDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, visitorDtoClass)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<VisitorDto> dtos = visitorService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final VisitorDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = VISITORS_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        VisitorDto result = objectMapper.readValue(contentAsString, visitorDtoClass);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        Collection<VisitorDto> visitorDtos = visitorService.findAll();
        VisitorDto toSave = new VisitorDto();
        toSave.setName("name");
        toSave.setDeviceId("c7c6c5c4c2c1c0");
        toSave.setType(DeviceType.EMITTER);
        byte[] content = objectMapper.writeValueAsBytes(toSave);

        LOGGER.info("POST URL {}", VISITORS_PATH);
        mockMvc.perform(post(VISITORS_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.name").value(toSave.getName()))
                .andExpect(jsonPath("$.deviceId").value(toSave.getDeviceId()))
                .andExpect(jsonPath("$.type").value(toSave.getType().toString()));
    }

    @Test
    public void postShouldThrowMethodArgumentNotValidExceptionWhenVisitorNameIsNull() throws Exception {
        VisitorDto toSave = new VisitorDto();
        toSave.setName(null);
        toSave.setDeviceId("c7c6c5c4c2c1c0");
        toSave.setType(DeviceType.EMITTER);
        byte[] content = objectMapper.writeValueAsBytes(toSave);

        LOGGER.info("POST URL {}", VISITORS_PATH);
        mockMvc.perform(post(VISITORS_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(result ->
                        assertTrue(result.getResolvedException() instanceof MethodArgumentNotValidException));
    }

    @Test
    public void putTest() throws Exception {
        Collection<VisitorDto> dtos = visitorService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        VisitorDto existed = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, existed);

        existed.setName("Changed");
        existed.setDeviceId("d7d6d5d4d2d1d0");
        byte[] content = objectMapper.writeValueAsBytes(existed);

        LOGGER.info("UPDATE URL {}", VISITORS_PATH);
        mockMvc.perform(put(VISITORS_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(existed.getEntityId()))
                .andExpect(jsonPath("$.name").value(existed.getName()))
                .andExpect(jsonPath("$.deviceId").value(existed.getDeviceId()));
    }

    private VisitorDto getVisitorDto(int number) {
        VisitorDto testVisitorDto = new VisitorDto();
        testVisitorDto.setName("Name" + number);
        testVisitorDto.setDeviceId("Device id" + number);
        testVisitorDto.setType(DeviceType.EMITTER);
        testVisitorDto.setEntityId(String.format("EntityID%016d", number));
        return testVisitorDto;
    }

    @Test
    public void findVisitorByDeviceId() throws Exception {
        VisitorDto visitorDto = getVisitorDto(1010);
        visitorService.save(visitorDto);

        String urlTemplate = String.format("%s/%s/%s", VISITORS_PATH, visitorDto.getType(), visitorDto.getDeviceId());
        LOGGER.info("GET URL {}", urlTemplate);
        mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$.entityId").value(visitorDto.getEntityId()))
                .andExpect(jsonPath("$.name").value(visitorDto.getName()))
                .andExpect(jsonPath("$.deviceId").value(visitorDto.getDeviceId()))
                .andExpect(jsonPath("$.type").value(visitorDto.getType().toString()));
    }

    @Test
    public void deleteTest() throws Exception {
        VisitorDto visitorDto1 = getVisitorDto(1);
        VisitorDto visitorDto2 = getVisitorDto(2);
        visitorService.save(visitorDto1);
        visitorService.save(visitorDto2);

        VisitorGroupDto visitorGroupDto = new VisitorGroupDto();
        visitorGroupDto.setEntityId(String.format("EntityID%016d", 1));
        visitorGroupDto.setName("name");
        visitorGroupDto.setVisitorIds(
                new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId())));
        visitorGroupService.save(visitorGroupDto);

        mockMvc.perform(delete("/api/v1/visitors/" + visitorDto1.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().string("true"));
    }

    @Test
    public void deleteAndCheckIfItWasRemovedFromVisitorGroupTest() throws Exception {
        VisitorDto visitorDto1 = getVisitorDto(1);
        VisitorDto visitorDto2 = getVisitorDto(2);
        visitorService.save(visitorDto1);
        visitorService.save(visitorDto2);

        VisitorGroupDto visitorGroupDto = new VisitorGroupDto();
        visitorGroupDto.setEntityId(String.format("EntityID%016d", 1));
        visitorGroupDto.setName("name");
        visitorGroupDto.setVisitorIds(
                new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId())));
        visitorGroupService.save(visitorGroupDto);

        mockMvc.perform(delete("/api/v1/visitors/" + visitorDto1.getEntityId()));

        assertEquals(1, visitorGroupService.findOne(visitorGroupDto.getEntityId()).getVisitorIds().size());
    }

    @After
    public void drop() {
        visitorService.deleteAll();
    }
}
