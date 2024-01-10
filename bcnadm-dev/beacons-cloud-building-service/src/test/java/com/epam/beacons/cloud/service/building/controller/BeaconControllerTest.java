package com.epam.beacons.cloud.service.building.controller;

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

import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.service.BeaconService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.ArrayList;
import java.util.Collection;
import java.util.stream.Collectors;
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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Test class for beacon controller.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@MockBean(UaaRemoteService.class)
public class BeaconControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(BeaconControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String WRONG_COLLECTION_SIZE = "Wrong dto collection size";
    private static final String BEACONS_PATH = "/api/v1/beacons/";

    private MockMvc mockMvc;
    private String secondLevelId;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private BeaconService beaconService;

    @Autowired
    private LevelService levelService;

    /**
     * Inits context before every test.
     */
    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    /**
     * Prepare data for tests.
     */
    @Before
    public void prepareData() {
        LevelDto levelDto = new LevelDto();
        levelDto.setBuildingId(String.format("1%023d", 1));
        levelDto.setNumber(1);
        levelDto = levelService.save(levelDto);

        BeaconDto beaconDto = new BeaconDto();
        beaconDto.setLatitude(78.0078);
        beaconDto.setLongitude(89.0089);
        beaconDto.setUuid("testUuis1");
        beaconDto.setLevelId(levelDto.getEntityId());
        beaconService.save(beaconDto);

        LevelDto secondLevelDto = new LevelDto();
        secondLevelDto.setBuildingId(levelDto.getBuildingId());
        secondLevelDto.setNumber(2);
        secondLevelDto = levelService.save(secondLevelDto);
        secondLevelId = secondLevelDto.getEntityId();

        BeaconDto beaconDto1 = new BeaconDto();
        beaconDto1.setLevelId(secondLevelDto.getEntityId());
        beaconDto1.setUuid("1");
        BeaconDto beaconDto2 = new BeaconDto();
        beaconDto2.setLevelId(secondLevelDto.getEntityId());
        beaconDto2.setUuid("2");
        BeaconDto beaconDto3 = new BeaconDto();
        beaconDto3.setLevelId(secondLevelDto.getEntityId());
        beaconDto3.setUuid("3");

        beaconService.save(beaconDto1);
        beaconService.save(beaconDto2);
        beaconService.save(beaconDto3);
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        beaconService.deleteAll();
        levelService.deleteAll();
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<BeaconDto> expectedCollection = beaconService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = BEACONS_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<BeaconDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, BeaconDto.class)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<BeaconDto> dtos = beaconService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final BeaconDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = BEACONS_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        BeaconDto result = objectMapper.readValue(contentAsString, BeaconDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        Collection<LevelDto> levelDtos = levelService.findAll();
        LevelDto levelDto = levelDtos.iterator().next();

        BeaconDto beaconDto = new BeaconDto();
        beaconDto.setLatitude(12.00322);
        beaconDto.setLongitude(45.00123);
        beaconDto.setLevelId(levelDto.getEntityId());
        beaconDto.setUuid("123");
        byte[] content = objectMapper.writeValueAsBytes(beaconDto);

        LOGGER.info("POST URL {}", BEACONS_PATH);
        mockMvc.perform(post(BEACONS_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.levelId").value(beaconDto.getLevelId()))
                .andExpect(jsonPath("$.uuid").value(beaconDto.getUuid()))
                .andExpect(jsonPath("$.latitude").value(beaconDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(beaconDto.getLongitude()));
    }

    @Test
    public void putTest() throws Exception {
        Collection<BeaconDto> beaconDtos = beaconService.findAll();
        BeaconDto beaconDto = beaconDtos.iterator().next();
        beaconDto.setLatitude(11.00234);
        beaconDto.setLongitude(22.00345);
        byte[] content = objectMapper.writeValueAsBytes(beaconDto);

        LOGGER.info("PUT URL {}", BEACONS_PATH);
        mockMvc.perform(put(BEACONS_PATH)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(beaconDto.getEntityId()))
                .andExpect(jsonPath("$.levelId").value(beaconDto.getLevelId()))
                .andExpect(jsonPath("$.uuid").value(beaconDto.getUuid()))
                .andExpect(jsonPath("$.latitude").value(beaconDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(beaconDto.getLongitude()));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<BeaconDto> dtos = beaconService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final BeaconDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = BEACONS_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @Test
    public void findAllByLevelTest() throws Exception {
        Collection<BeaconDto> expectedCollection = getBeaconDtosFromSecondLevel();
        assertNotNull(DTO_COLLECTION_IS_NULL, expectedCollection);
        assertFalse(DTO_NOT_PRESENTED, expectedCollection.isEmpty());
        assertEquals(WRONG_COLLECTION_SIZE, 3, expectedCollection.size());

        String urlTemplate = BEACONS_PATH + "byLevel/" + secondLevelId;
        LOGGER.info("GET ALL BY LEVEL URL {}", urlTemplate);
        String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        Collection<BeaconDto> resultCollection = objectMapper.readValue(
                contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, BeaconDto.class)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void deleteAllByLevelTest() throws Exception {
        Collection<BeaconDto> dtos = getBeaconDtosFromSecondLevel();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        BeaconDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);
        assertEquals(WRONG_COLLECTION_SIZE, 3, dtos.size());

        String urlTemplate = BEACONS_PATH + "byLevel/" + secondLevelId;
        LOGGER.info("DELETE ALL BY LEVEL URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());

        dtos = getBeaconDtosFromSecondLevel();
        assertEquals(WRONG_COLLECTION_SIZE, 0, dtos.size());
    }

    private Collection<BeaconDto> getBeaconDtosFromSecondLevel() {
        return beaconService.findAll().stream()
                .filter(x -> x.getLevelId().equals(secondLevelId))
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
