package com.epam.beacons.cloud.service.building.controller;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.ReaderDto;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.epam.beacons.cloud.service.building.service.ReaderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.Collection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Assert;
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

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@MockBean(UaaRemoteService.class)
public class ReaderControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(ReaderControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String UUID_IS_NOT_UNIQUE = "Uuid is not unique";
    private static final String NON_UNIQUE_UUID = "12345";
    private static final String READER_PATH = "/api/v1/readers/";

    private MockMvc mockMvc;
    private LevelDto levelDto;
    private ReaderDto readerDto;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReaderService readerService;

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
        levelDto = new LevelDto();
        levelDto.setNumber(1);
        levelDto.setBuildingId(String.format("1%023d", 1));
        levelDto.setSouthWestLatitude(1);
        levelDto.setSouthWestLongitude(2);
        levelDto.setNorthEastLatitude(3);
        levelDto.setNorthEastLongitude(4);
        levelDto = levelService.save(levelDto);

        readerDto = new ReaderDto();
        readerDto.setLatitude(5);
        readerDto.setLongitude(6);
        readerDto.setUuid("Test Uuid");
        readerDto.setLevelId(levelDto.getEntityId());
        readerDto = readerService.save(readerDto);
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        readerService.deleteAll();
        levelService.deleteAll();
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<ReaderDto> expectedCollection = readerService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = READER_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<ReaderDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, ReaderDto.class)
        );

        Assert.assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<ReaderDto> dtos = readerService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final ReaderDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = READER_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        ReaderDto result = objectMapper.readValue(contentAsString, ReaderDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        ReaderDto readerDto = new ReaderDto();
        readerDto.setLatitude(10);
        readerDto.setLongitude(11);
        readerDto.setUuid("Save Test Uuid");
        readerDto.setLevelId(levelDto.getEntityId());

        byte[] content = objectMapper.writeValueAsBytes(readerDto);

        mockMvc.perform(post(READER_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.latitude").value(readerDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(readerDto.getLongitude()))
                .andExpect(jsonPath("$.uuid").value(readerDto.getUuid()))
                .andExpect(jsonPath("$.levelId").value(readerDto.getLevelId()));
    }

    @Test
    public void putTest() throws Exception {
        final String originalUuid = readerDto.getUuid();
        final String updatedUuid = "Updated Test Uuid";

        readerDto.setUuid(updatedUuid);

        assertNotEquals(originalUuid, readerDto.getUuid());

        byte[] content = objectMapper.writeValueAsBytes(readerDto);

        mockMvc.perform(put(READER_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(readerDto.getEntityId()))
                .andExpect(jsonPath("$.latitude").value(readerDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(readerDto.getLongitude()))
                .andExpect(jsonPath("$.uuid").value(readerDto.getUuid()))
                .andExpect(jsonPath("$.levelId").value(readerDto.getLevelId()));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<ReaderDto> dtos = readerService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final ReaderDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = READER_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @Test
    public void findByUuidTest() throws Exception {
        String urlTemplate = READER_PATH + "byUuid/" + readerDto.getUuid();
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("entityId", is(readerDto.getEntityId())))
                .andExpect(jsonPath("latitude", is(readerDto.getLatitude())))
                .andExpect(jsonPath("longitude", is(readerDto.getLongitude())))
                .andExpect(jsonPath("uuid", is(readerDto.getUuid())))
                .andExpect(jsonPath("levelId", is(readerDto.getLevelId())));
    }

    @Test
    public void findAllByLevelIdTest() throws Exception {
        ReaderDto readerDto1 = new ReaderDto();
        readerDto1.setLevelId(levelDto.getEntityId());
        readerDto1.setUuid("Uuid 1");
        readerDto1 = readerService.save(readerDto1);

        Collection<LevelDto> levelDtos = levelService.findAll();
        LevelDto levelDto = levelDtos.iterator().next();
        Collection<ReaderDto> readerDtos = readerService.findAll(levelDto);
        ReaderDto dto = readerDtos.iterator().next();

        mockMvc.perform(get(READER_PATH + "byLevel/" + dto.getLevelId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()", is(2)))
                .andExpect(jsonPath("$[0].levelId").value(readerDto.getLevelId()))
                .andExpect(jsonPath("$[0].entityId").value(readerDto.getEntityId()))
                .andExpect(jsonPath("$[0].uuid").value(readerDto.getUuid()))
                .andExpect(jsonPath("$[1].levelId").value(readerDto1.getLevelId()))
                .andExpect(jsonPath("$[1].entityId").value(readerDto1.getEntityId()))
                .andExpect(jsonPath("$[1].uuid").value(readerDto1.getUuid()));
    }

    @Test
    public void deleteAllByLevelIdTest() throws Exception {
        ReaderDto readerDto1 = new ReaderDto();
        readerDto1.setLevelId(levelDto.getEntityId());
        readerDto1.setUuid("Uuid 12");
        readerDto1 = readerService.save(readerDto1);

        ReaderDto readerDto2 = new ReaderDto();
        readerDto2.setLevelId(levelDto.getEntityId());
        readerDto2.setUuid("Uuid 13");
        readerDto2 = readerService.save(readerDto2);

        Assert.assertEquals(3, readerService.findAll(levelDto).size());

        String urlTemplate = READER_PATH + "byLevel/" + levelDto.getEntityId();
        mockMvc.perform(delete(urlTemplate))
                .andExpect(status().isOk());

        Assert.assertEquals("Some readers are still on the level",
                0, readerService.findAll(levelDto).size());
    }

    @Test
    public void saveReaderWithNonUniqueUuidReturnsConflictResponseStatus() throws Exception {
        ReaderDto readerDto = new ReaderDto();
        readerDto.setUuid(NON_UNIQUE_UUID);
        readerDto.setLevelId(levelDto.getEntityId());
        readerDto.setLatitude(123);
        readerDto.setLongitude(321);
        readerService.save(readerDto);

        ReaderDto nonUniqueReaderDto = new ReaderDto();
        nonUniqueReaderDto.setUuid(NON_UNIQUE_UUID);
        nonUniqueReaderDto.setLevelId(levelDto.getEntityId());
        nonUniqueReaderDto.setLatitude(456);
        nonUniqueReaderDto.setLongitude(890);

        byte[] content = objectMapper.writeValueAsBytes(readerDto);

        mockMvc.perform(post(READER_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isConflict())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof NonUniqueValueException))
                .andExpect(result -> assertEquals(
                        UUID_IS_NOT_UNIQUE,
                        result.getResolvedException().getMessage()));
    }
}
