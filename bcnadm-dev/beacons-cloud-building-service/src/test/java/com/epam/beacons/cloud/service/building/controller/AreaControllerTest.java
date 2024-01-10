package com.epam.beacons.cloud.service.building.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.building.domain.AreaDto;
import com.epam.beacons.cloud.service.building.domain.AreaSearchDto;
import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.domain.Coordinate;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.service.AreaService;
import com.epam.beacons.cloud.service.building.service.BuildingService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;
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
 * Test for AreaController.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@MockBean(UaaRemoteService.class)
public class AreaControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(AreaControllerTest.class);
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String AREA_NAME = "Test Area Name";
    private static final String AREA_DESCRIPTION = "Test Area Description";
    private static final String AREA_PATH = "/api/v1/areas/";

    private MockMvc mockMvc;
    private LevelDto levelDto;
    private AreaDto areaDto;
    private String buildingId;
    private AreaSearchDto areaSearchDto;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AreaService areaService;

    @Autowired
    private LevelService levelService;

    @Autowired
    private BuildingService buildingService;

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
        BuildingDto buildingDto = new BuildingDto();
        buildingDto.setLatitude(1);
        buildingDto.setLongitude(1);
        buildingDto.setAddress("Test Building Address");
        buildingDto.setHeight(10);
        buildingDto.setWidth(10);
        buildingDto.setName("Test Building Name");
        buildingDto.setWorkingHours("11-12");
        buildingDto.setPhoneNumber("999-666-753");
        buildingDto.setCreatedBy("Test Created By");
        buildingId = buildingService.save(buildingDto).getEntityId();

        levelDto = new LevelDto();
        levelDto.setNumber(1);
        levelDto.setBuildingId(buildingId);
        levelDto.setSouthWestLatitude(1);
        levelDto.setSouthWestLongitude(2);
        levelDto.setNorthEastLatitude(3);
        levelDto.setNorthEastLongitude(4);
        levelDto = levelService.save(levelDto);

        LevelDto levelDto1 = new LevelDto();
        levelDto1.setNumber(2);
        levelDto1.setBuildingId(buildingId);
        levelDto1.setSouthWestLatitude(1);
        levelDto1.setSouthWestLongitude(2);
        levelDto1.setNorthEastLatitude(3);
        levelDto1.setNorthEastLongitude(4);
        levelDto1 = levelService.save(levelDto1);

        areaDto = new AreaDto();
        areaDto.setDescription(AREA_DESCRIPTION);
        areaDto.setName(AREA_NAME);
        areaDto.setLevelId(levelDto.getEntityId());
        areaDto.setCoordinates(Arrays.asList(
                new Coordinate(11.0011,22.0022),
                new Coordinate(33.0033,44.0044),
                new Coordinate(55.0055,66.0066)
        ));
        areaDto = areaService.save(areaDto);

        AreaDto areaDto1 = new AreaDto();
        areaDto1.setDescription(AREA_DESCRIPTION);
        areaDto1.setLevelId(levelDto1.getEntityId());
        areaDto1.setCoordinates(Arrays.asList(
                new Coordinate(11.0011,22.0022),
                new Coordinate(33.0033,44.0044),
                new Coordinate(55.0055,66.0066)
        ));
        areaService.save(areaDto1);

        areaSearchDto = new AreaSearchDto();
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        areaService.deleteAll();
        levelService.deleteAll();
        buildingService.deleteAll();
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<AreaDto> expectedCollection = areaService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = AREA_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<AreaDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, AreaDto.class)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<AreaDto> dtos = areaService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final AreaDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = AREA_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        AreaDto result = objectMapper.readValue(contentAsString, AreaDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        AreaDto areaDto = new AreaDto();
        areaDto.setDescription("Post Test Area Description");
        areaDto.setName("Post Test Area Name");
        areaDto.setLevelId(levelDto.getEntityId());
        areaDto.setCoordinates(Arrays.asList(
                new Coordinate(12,13),
                new Coordinate(14,15),
                new Coordinate(16,17)
        ));

        byte[] content = objectMapper.writeValueAsBytes(areaDto);

        mockMvc.perform(post(AREA_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.description").value(areaDto.getDescription()))
                .andExpect(jsonPath("$.name").value(areaDto.getName()))
                .andExpect(jsonPath("$.levelId").value(areaDto.getLevelId()))
                .andExpect(jsonPath("$.coordinates[*].latitude").value(areaDto.getCoordinates().stream()
                        .map(Coordinate::getLatitude).collect(Collectors.toList())))
                .andExpect(jsonPath("$.coordinates[*].longitude").value(areaDto.getCoordinates().stream()
                        .map(Coordinate::getLongitude).collect(Collectors.toList())));
    }

    @Test
    public void putTest() throws Exception {
        final String originalDescription = areaDto.getDescription();
        final String updatedDescription = "Put Test New Description";

        areaDto.setDescription(updatedDescription);

        assertNotEquals(originalDescription, areaDto.getDescription());

        byte[] content = objectMapper.writeValueAsBytes(areaDto);

        mockMvc.perform(put(AREA_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(areaDto.getEntityId()))
                .andExpect(jsonPath("$.description").value(updatedDescription))
                .andExpect(jsonPath("$.name").value(areaDto.getName()))
                .andExpect(jsonPath("$.levelId").value(areaDto.getLevelId()))
                .andExpect(jsonPath("$.coordinates[*].latitude").value(areaDto.getCoordinates().stream()
                        .map(Coordinate::getLatitude).collect(Collectors.toList())))
                .andExpect(jsonPath("$.coordinates[*].longitude").value(areaDto.getCoordinates().stream()
                        .map(Coordinate::getLongitude).collect(Collectors.toList())));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<AreaDto> dtos = areaService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final AreaDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = AREA_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @Test
    public void findByLevelTest() throws Exception {
        String urlTemplate = AREA_PATH + "byLevelId/" + levelDto.getEntityId();
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$[0].entityId", is(areaDto.getEntityId())))
                .andExpect(jsonPath("$[0].description", is(areaDto.getDescription())))
                .andExpect(jsonPath("$[0].name", is(areaDto.getName())))
                .andExpect(jsonPath("$[0].levelId", is(areaDto.getLevelId())))
                .andExpect(jsonPath("$[0].coordinates[*].latitude").value(areaDto.getCoordinates().stream()
                        .map(Coordinate::getLatitude).collect(Collectors.toList())))
                .andExpect(jsonPath("$[0].coordinates[*].longitude").value(areaDto.getCoordinates().stream()
                        .map(Coordinate::getLongitude).collect(Collectors.toList())));
    }

    @Test
    public void findByNameAndLevelIdTest() throws Exception {
        String urlTemplate = AREA_PATH + "/search/level/" + levelDto.getEntityId();
        areaSearchDto.setName(AREA_NAME);

        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);

        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].entityId", is(areaDto.getEntityId())));
    }

    @Test
    public void findByNameDescriptionAndLevelIdTest() throws Exception {
        String urlTemplate = AREA_PATH + "/search/level/" + levelDto.getEntityId();
        areaSearchDto.setName(AREA_NAME);
        areaSearchDto.setDescription(AREA_DESCRIPTION);

        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);

        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].entityId", is(areaDto.getEntityId())));
    }

    @Test
    public void findByNameAndBuildingIdTest() throws Exception {
        String urlTemplate = AREA_PATH + "/search/building/" + buildingId;
        areaSearchDto.setName(AREA_NAME);

        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);

        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].entityId", is(areaDto.getEntityId())));
    }

    @Test
    public void findByDescriptionAndBuildingIdTest() throws Exception {
        String urlTemplate = AREA_PATH + "/search/building/" + buildingId;
        areaSearchDto.setDescription(AREA_DESCRIPTION);

        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);

        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void specifiedSearchInBuildingShouldReturnEmptyListWhenProvidedNameDoesNotExist() throws Exception {
        String urlTemplate = AREA_PATH + "/search/building/" + buildingId;
        areaSearchDto.setName("NonExistedName");

        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);

        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", empty()));
    }

    @Test
    public void specifiedSearchInBuildingShouldThrowExceptionWhenProvidedDtoIsNotValid() throws Exception {
        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);
        String urlTemplate = AREA_PATH + "/search/building/" + buildingId;
        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(
                        "At least one field should not be null",
                        Objects.requireNonNull(result.getResolvedException()).getMessage()
                ));
    }

    @Test
    public void specifiedSearchInBuildingShouldThrowExceptionWhenBuildingIdIsNotValid() throws Exception {
        areaSearchDto.setName(AREA_NAME);
        byte[] content = objectMapper.writeValueAsBytes(areaSearchDto);
        String urlTemplate = AREA_PATH + "/search/building/" + "InvalidId";
        mockMvc.perform(post(urlTemplate).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(
                        "Incorrect entity id",
                        Objects.requireNonNull(result.getResolvedException()).getMessage()
                ));
    }

    @Test
    public void getCoordinatesTest() throws Exception {
        final String urlTemplate = AREA_PATH + areaDto.getEntityId() + "/coordinates";
        LOGGER.info("GET URL {}", urlTemplate);
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()", is(areaDto.getCoordinates().size())));
    }

    @Test
    public void deleteAllByLevelTest() throws Exception {
        String urlTemplate = AREA_PATH + "byLevelId/" + levelDto.getEntityId();
        mockMvc.perform(delete(urlTemplate))
                .andExpect(status().isOk());
    }
}
