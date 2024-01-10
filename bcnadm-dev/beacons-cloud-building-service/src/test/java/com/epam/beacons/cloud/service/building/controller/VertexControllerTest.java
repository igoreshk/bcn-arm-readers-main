package com.epam.beacons.cloud.service.building.controller;

import static org.hamcrest.MatcherAssert.assertThat;
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
import com.epam.beacons.cloud.service.building.domain.Coordinate;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.domain.VertexType;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.service.AreaService;
import com.epam.beacons.cloud.service.building.service.EdgeService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.epam.beacons.cloud.service.building.service.VertexService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.Arrays;
import java.util.Collection;
import junit.framework.TestCase;
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
 * Class for vertex tests.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@MockBean(UaaRemoteService.class)
public class VertexControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(VertexControllerTest.class);
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String VERTEX_PATH = "/api/v1/vertices/";

    private MockMvc mockMvc;
    private VertexDto vertexDto;
    private LevelDto levelDto;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VertexService vertexService;

    @Autowired
    private LevelService levelService;

    @Autowired
    private EdgeService edgeService;

    @Autowired
    private AreaService areaService;

    @Autowired
    private GraphRepository graphRepository;

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
        GraphEntity graph = new GraphEntity();
        graph.setBuildingId(String.format("1%023d", 1));
        graphRepository.save(graph);
        levelDto = new LevelDto();
        levelDto.setBuildingId(String.format("1%023d", 1));
        levelDto.setSouthWestLatitude(1);
        levelDto.setSouthWestLongitude(2);
        levelDto.setNorthEastLatitude(3);
        levelDto.setNorthEastLongitude(4);
        levelDto = levelService.save(levelDto);

        vertexDto = new VertexDto();
        vertexDto.setLatitude(5);
        vertexDto.setLongitude(6);
        vertexDto.setLevelId(levelDto.getEntityId());
        vertexDto.setType(VertexType.ENTRY_EXIT);
        vertexDto = vertexService.save(vertexDto);
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        levelService.deleteAll();
        graphRepository.deleteAll();
    }

    @Test
    public void getAllTest() throws Exception {
        final Collection<VertexDto> expectedCollection = vertexService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = VERTEX_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<VertexDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, VertexDto.class)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<VertexDto> dtos = vertexService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final VertexDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = VERTEX_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        VertexDto result = objectMapper.readValue(contentAsString, VertexDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        LevelDto levelDto = new LevelDto();
        levelDto.setEntityId(String.format("2%023d", 1));
        levelDto.setBuildingId(String.format("1%023d", 1));
        levelDto.setNumber(1);
        levelService.save(levelDto);

        VertexDto vertexDto = new VertexDto();
        vertexDto.setLatitude(2);
        vertexDto.setLongitude(2);
        vertexDto.setLevelId(String.format("2%023d", 1));
        vertexDto.setType(VertexType.ENTRY_EXIT);

        byte[] content = objectMapper.writeValueAsBytes(vertexDto);

        mockMvc.perform(post(VERTEX_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.levelId").value(vertexDto.getLevelId()))
                .andExpect(jsonPath("$.latitude").value(vertexDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(vertexDto.getLongitude()))
                .andExpect(jsonPath("$.type").value(vertexDto.getType().toString()));
    }

    @Test
    public void putTest() throws Exception {
        LevelDto levelDto2 = new LevelDto();
        levelDto2.setNumber(1);
        levelDto2.setEntityId(String.format("2%023d", 2));
        levelDto2.setBuildingId(String.format("1%023d", 1));
        final String updatedLevelId = levelService.save(levelDto2).getEntityId();
        final String originalLevelId = vertexDto.getLevelId();

        vertexDto.setLevelId(updatedLevelId);

        assertNotEquals(originalLevelId, vertexDto.getLevelId());

        byte[] content = objectMapper.writeValueAsBytes(vertexDto);

        mockMvc.perform(put(VERTEX_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(vertexDto.getEntityId()))
                .andExpect(jsonPath("$.levelId").value(updatedLevelId))
                .andExpect(jsonPath("$.latitude").value(vertexDto.getLatitude()))
                .andExpect(jsonPath("$.longitude").value(vertexDto.getLongitude()))
                .andExpect(jsonPath("$.type").value(vertexDto.getType().toString()));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<VertexDto> dtos = vertexService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final VertexDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = VERTEX_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @Test
    public void findAllByEdgeWithSameStartAndEndVerticesTest() throws Exception {
        LevelDto levelDto = new LevelDto();
        levelDto.setEntityId(String.format("2%023d", 3));
        levelDto.setBuildingId(String.format("1%023d", 1));
        levelDto.setNumber(1);
        levelService.save(levelDto);
        VertexDto vertexDto = new VertexDto();
        vertexDto.setLevelId(String.format("2%023d", 3));
        vertexDto.setLatitude(3);
        vertexDto.setLongitude(3);
        vertexDto.setType(VertexType.ENTRY_EXIT);
        VertexDto savedVertexDto = vertexService.save(vertexDto);

        EdgeDto edgeDto = new EdgeDto();
        edgeDto.setStartVertexId(savedVertexDto.getEntityId());
        edgeDto.setEndVertexId(savedVertexDto.getEntityId());
        EdgeDto savedEdgeDto = edgeService.save(edgeDto);

        String urlTemplate = VERTEX_PATH + "byEdge/" + savedEdgeDto.getEntityId();
        mockMvc.perform((get(urlTemplate)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].entityId").value(savedVertexDto.getEntityId()))
                .andExpect(jsonPath("$[0].levelId").value(savedVertexDto.getLevelId()))
                .andExpect(jsonPath("$[0].latitude").value(savedVertexDto.getLatitude()))
                .andExpect(jsonPath("$[0].longitude").value(savedVertexDto.getLongitude()))
                .andExpect(jsonPath("$[0].type").value(savedVertexDto.getType().toString()));
    }

    @Test
    public void findAllByEdgeWithDifferentStartAndEndVerticesTest() throws Exception {
        LevelDto levelDto1 = new LevelDto();
        levelDto1.setEntityId(String.format("2%023d", 4));
        levelDto1.setBuildingId(String.format("1%023d", 1));
        levelDto1.setNumber(1);
        levelService.save(levelDto1);
        LevelDto levelDto2 = new LevelDto();
        levelDto2.setEntityId(String.format("2%023d", 5));
        levelDto2.setBuildingId(String.format("1%023d", 1));
        levelDto2.setNumber(2);
        levelService.save(levelDto2);

        vertexDto.setLevelId(String.format("2%023d", 4));
        vertexDto.setLatitude(4);
        vertexDto.setLongitude(4);
        vertexDto.setType(VertexType.ENTRY_EXIT);

        VertexDto anotherVertexDto = new VertexDto();
        anotherVertexDto.setLevelId(String.format("2%023d", 5));
        anotherVertexDto.setLatitude(5);
        anotherVertexDto.setLongitude(5);
        anotherVertexDto.setType(VertexType.ENTRY_EXIT);

        VertexDto savedVertexDto = vertexService.save(vertexDto);
        VertexDto savedAnotherVertexDto = vertexService.save(anotherVertexDto);

        EdgeDto edgeDto = new EdgeDto();
        edgeDto.setStartVertexId(savedVertexDto.getEntityId());
        edgeDto.setEndVertexId(savedAnotherVertexDto.getEntityId());
        EdgeDto savedEdgeDto = edgeService.save(edgeDto);

        String urlTemplate = VERTEX_PATH + "byEdge/" + savedEdgeDto.getEntityId();
        mockMvc.perform((get(urlTemplate)).contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", is(2)))
                .andExpect(jsonPath("$[0].entityId").value(savedVertexDto.getEntityId()))
                .andExpect(jsonPath("$[0].levelId").value(savedVertexDto.getLevelId()))
                .andExpect(jsonPath("$[0].latitude").value(savedVertexDto.getLatitude()))
                .andExpect(jsonPath("$[0].longitude").value(savedVertexDto.getLongitude()))
                .andExpect(jsonPath("$[0].type").value(savedVertexDto.getType().toString()))
                .andExpect(jsonPath("$[1].entityId").value(savedAnotherVertexDto.getEntityId()))
                .andExpect(jsonPath("$[1].levelId").value(savedAnotherVertexDto.getLevelId()))
                .andExpect(jsonPath("$[1].latitude").value(savedAnotherVertexDto.getLatitude()))
                .andExpect(jsonPath("$[1].longitude").value(savedAnotherVertexDto.getLongitude()))
                .andExpect(jsonPath("$[1].type").value(savedAnotherVertexDto.getType().toString()));
    }

    @Test
    public void findAllByLevelIdTest() throws Exception {
        Collection<LevelDto> levelDtos = levelService.findAll();
        LevelDto levelDto = levelDtos.iterator().next();
        Collection<VertexDto> vertexDtos = vertexService.findAll(levelDto);
        VertexDto dto = vertexDtos.iterator().next();

        mockMvc.perform(get("/api/v1/vertices/byLevel/" + dto.getLevelId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$[0].entityId").value(dto.getEntityId()))
                .andExpect(jsonPath("$[0].latitude").value(dto.getLatitude()))
                .andExpect(jsonPath("$[0].longitude").value(dto.getLongitude()))
                .andExpect(jsonPath("$[0].levelId").value(dto.getLevelId()))
                .andExpect(jsonPath("$[0].type").value(dto.getType().toString()));
    }

    @Test
    public void deleteAllByLevelIdTest() throws Exception {
        LevelDto levelDtoToDelete = levelService.findAll().iterator().next();

        LevelDto levelDtoNotDeleted = new LevelDto();
        levelDtoNotDeleted.setBuildingId(String.format("1%023d", 1));
        levelDtoNotDeleted.setNumber(1);
        levelDtoNotDeleted = levelService.save(levelDtoNotDeleted);

        VertexDto vertexDtoNotDeleted = new VertexDto();
        vertexDtoNotDeleted.setLevelId(levelDtoNotDeleted.getEntityId());
        vertexDtoNotDeleted = vertexService.save(vertexDtoNotDeleted);

        for (int i = 0; i < 5; i++) {
            VertexDto vertexDtoToDelete = new VertexDto();
            vertexDtoToDelete.setLevelId(levelDtoToDelete.getEntityId());
            vertexService.save(vertexDtoToDelete);
        }

        mockMvc.perform(delete(VERTEX_PATH + "byLevel/" + levelDtoToDelete.getEntityId()))
                .andExpect(status().isOk());

        VertexDto vertexAfterDelete = vertexService.findOne(vertexDtoNotDeleted.getEntityId());
        TestCase.assertNotNull("Delete by LevelId should not affect other vertices on another level!",
                vertexAfterDelete);
        assertEquals("Delete by LevelId should delete all vertices on level!",
                0, vertexService.findAll(levelDtoToDelete).size());
    }

    @Test
    public void findAllInsideAreaTest() throws Exception {
        AreaDto areaDto = new AreaDto();
        areaDto.setCoordinates(Arrays.asList(
                new Coordinate(1.5, 4.3),
                new Coordinate(1.5, 7.2),
                new Coordinate(4.5, 8.8),
                new Coordinate(7.1, 7.2),
                new Coordinate(7.1, 4.3)
        ));
        areaDto.setLevelId(levelDto.getEntityId());
        areaDto = areaService.save(areaDto);

        VertexDto vertexDtoOutOfArea = new VertexDto();
        vertexDtoOutOfArea.setLatitude(1.5);
        vertexDtoOutOfArea.setLongitude(8.1);
        vertexDtoOutOfArea.setLevelId(levelDto.getEntityId());
        vertexService.save(vertexDtoOutOfArea);

        mockMvc.perform(get(VERTEX_PATH + "byLevel/" + levelDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(2)));
        mockMvc.perform(get(VERTEX_PATH + "byArea/" + areaDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].entityId").value(vertexDto.getEntityId()));
    }

    @Test
    public void findNearestVertexTest() throws Exception {
        VertexDto farVertex = new VertexDto();
        farVertex.setLatitude(2);
        farVertex.setLongitude(1);
        farVertex.setLevelId(levelDto.getEntityId());
        vertexService.save(farVertex);

        VertexDto nearestVertex = new VertexDto();
        nearestVertex.setLatitude(3.5);
        nearestVertex.setLongitude(2.8);
        nearestVertex.setLevelId(levelDto.getEntityId());
        nearestVertex = vertexService.save(nearestVertex);

        mockMvc.perform(get(VERTEX_PATH + "byLevel/" + levelDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$", hasSize(3)));

        String specifiedLatitude = "4/";
        String specifiedLongitude = "2/";
        mockMvc.perform(get(VERTEX_PATH + "nearestVertex/" + specifiedLatitude
                + specifiedLongitude + levelDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(nearestVertex.getEntityId()));
    }
}
