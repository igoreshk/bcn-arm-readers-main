package com.epam.beacons.cloud.monitor.service.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.service.TrilaterationService;
import com.epam.beacons.cloud.monitor.service.service.VisitorGroupService;
import com.epam.beacons.cloud.monitor.service.service.VisitorHistoryService;
import com.epam.beacons.cloud.monitor.service.service.VisitorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Tests for {@link VisitorController}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@MockBean(TrilaterationService.class)
public class VisitorGroupControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(VisitorGroupControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String VISITOR_GROUP_PATH = "/api/v1/visitor-groups/";
    private final Class<VisitorGroupDto> visitorGroupDtoClass = VisitorGroupDto.class;
    private MockMvc mockMvc;

    @SpyBean
    private VisitorGroupService visitorGroupService;
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private VisitorHistoryService visitorHistoryService;
    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private ObjectMapper objectMapper;

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Before
    public void prepareData() {
        VisitorDto visitorDto = new VisitorDto();
        visitorDto.setName("Name");
        visitorDto.setDeviceId("b7b6b5b4b2b1b0");
        visitorDto.setType(DeviceType.EMITTER);
        visitorService.save(visitorDto);

        VisitorGroupDto visitorGroupDto = new VisitorGroupDto();
        visitorGroupDto.setName("GroupName");
        visitorGroupService.save(visitorGroupDto);
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<VisitorGroupDto> expectedCollection = visitorGroupService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        LOGGER.info("GET ALL URL {}", VISITOR_GROUP_PATH);
        final String contentAsString = mockMvc.perform(get(VISITOR_GROUP_PATH)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<VisitorGroupDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, visitorGroupDtoClass)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<VisitorGroupDto> dtos = visitorGroupService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final VisitorGroupDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = VISITOR_GROUP_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        VisitorGroupDto result = objectMapper.readValue(contentAsString, visitorGroupDtoClass);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        Collection<VisitorDto> visitorDtos  = visitorService.findAll();
        VisitorDto existed = visitorDtos.iterator().next();
        Set<String> visitorIdSet = new HashSet<>();
        visitorIdSet.add(existed.getEntityId());

        VisitorGroupDto toSave = new VisitorGroupDto();
        toSave.setName("Name");
        toSave.setVisitorIds(visitorIdSet);
        byte[] content = objectMapper.writeValueAsBytes(toSave);

        LOGGER.info("POST URL {}", VISITOR_GROUP_PATH);
        mockMvc.perform(post(VISITOR_GROUP_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.name").value(toSave.getName()))
                .andExpect(jsonPath("$.visitorIds").value(new ArrayList<>(toSave.getVisitorIds())));
    }

    @Test
    public void deleteTest() throws Exception {
        VisitorGroupDto visitorGroupDto = visitorGroupService.findAll().iterator().next();
        String urlTemplate = VISITOR_GROUP_PATH + visitorGroupDto.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteThrowsClientErrorIfVisitorGroupDoesntExist() throws Exception {
        String urlTemplate = VISITOR_GROUP_PATH + "non-existingId";
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().is4xxClientError());
    }

    @After
    public void drop() {
        visitorService.deleteAll();
    }
}
