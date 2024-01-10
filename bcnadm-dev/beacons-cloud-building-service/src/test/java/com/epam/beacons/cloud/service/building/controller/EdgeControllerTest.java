package com.epam.beacons.cloud.service.building.controller;

import static org.hamcrest.MatcherAssert.assertThat;
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

import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.domain.VertexType;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.service.EdgeService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.epam.beacons.cloud.service.building.service.VertexService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.util.Collection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Class for edges tests.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
public class EdgeControllerTest {

    private static final Logger LOGGER = LogManager.getLogger(EdgeControllerTest.class);
    private static final String VERTICES_ARE_EQUAL = "Vertices are equal. You are trying to find a POINT.";
    private static final String DTO_DOES_NOT_MATCH = "Dto doesn't match";
    private static final String DTO_IS_NULL = "Dto is null";
    private static final String DTO_NOT_PRESENTED = "Dto not presented!";
    private static final String DTO_COLLECTION_IS_NULL = "Dto collection is null";
    private static final String EDGE_PATH = "/api/v1/edges/";

    private MockMvc mockMvc;
    private EdgeDto edgeDto;
    private VertexDto startVertexDto;
    private VertexDto endVertexDto;
    private LevelDto levelDto;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EdgeService edgeService;

    @Autowired
    private VertexService vertexService;

    @Autowired
    private LevelService levelService;

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
        levelDto.setNumber(1);
        levelDto.setBuildingId(String.format("1%023d", 1));
        levelDto.setSouthWestLatitude(1);
        levelDto.setSouthWestLongitude(2);
        levelDto.setNorthEastLatitude(3);
        levelDto.setNorthEastLongitude(4);
        levelDto = levelService.save(levelDto);

        startVertexDto = new VertexDto();
        startVertexDto.setLatitude(1);
        startVertexDto.setLongitude(2);
        startVertexDto.setLevelId(levelDto.getEntityId());
        startVertexDto.setType(VertexType.ENTRY_EXIT);
        startVertexDto = vertexService.save(startVertexDto);

        endVertexDto = new VertexDto();
        endVertexDto.setLatitude(3);
        endVertexDto.setLongitude(4);
        endVertexDto.setLevelId(levelDto.getEntityId());
        endVertexDto.setType(VertexType.ENTRY_EXIT);
        endVertexDto = vertexService.save(endVertexDto);

        edgeDto = new EdgeDto();
        edgeDto.setStartVertexId(startVertexDto.getEntityId());
        edgeDto.setEndVertexId(endVertexDto.getEntityId());
        edgeDto = edgeService.save(edgeDto);
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
        final Collection<EdgeDto> expectedCollection = edgeService.findAll();
        assertNotNull("Settings is null", expectedCollection);
        assertFalse("Settings not presented!", expectedCollection.isEmpty());

        final String allMapping = EDGE_PATH;
        LOGGER.info("GET ALL URL {}", allMapping);
        final String contentAsString = mockMvc.perform(get(allMapping)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.length()", is(expectedCollection.size()))).andReturn().getResponse()
                .getContentAsString();

        final Collection<EdgeDto> resultCollection = objectMapper.readValue(contentAsString,
                TypeFactory.defaultInstance().constructCollectionType(Collection.class, EdgeDto.class)
        );

        assertTrue(DTO_DOES_NOT_MATCH, resultCollection.containsAll(expectedCollection));
    }

    @Test
    public void getTest() throws Exception {
        final Collection<EdgeDto> dtos = edgeService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final EdgeDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = EDGE_PATH + expected.getEntityId();
        LOGGER.info("GET URL {}", urlTemplate);
        final String contentAsString = mockMvc.perform(get(urlTemplate)).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE)).andReturn().getResponse()
                .getContentAsString();
        EdgeDto result = objectMapper.readValue(contentAsString, EdgeDto.class);

        assertThat(DTO_DOES_NOT_MATCH, result, is(expected));
    }

    @Test
    public void postTest() throws Exception {
        LevelDto levelDto = new LevelDto();
        levelDto.setNumber(2);
        levelDto.setBuildingId(String.format("1%023d", 1));
        String levelId = levelService.save(levelDto).getEntityId();

        VertexDto startVertexDto = new VertexDto();
        startVertexDto.setLongitude(5);
        startVertexDto.setLongitude(6);
        startVertexDto.setLevelId(levelId);
        startVertexDto.setType(VertexType.ENTRY_EXIT);
        final VertexDto savedStartVertexDto = vertexService.save(startVertexDto);

        VertexDto endVertexDto = new VertexDto();
        endVertexDto.setLatitude(7);
        endVertexDto.setLongitude(8);
        endVertexDto.setLevelId(levelId);
        endVertexDto.setType(VertexType.ENTRY_EXIT);
        final VertexDto savedEndVertexDto = vertexService.save(endVertexDto);

        EdgeDto edgeDto = new EdgeDto();
        edgeDto.setStartVertexId(savedStartVertexDto.getEntityId());
        edgeDto.setEndVertexId(savedEndVertexDto.getEntityId());

        byte[] content = objectMapper.writeValueAsBytes(edgeDto);

        mockMvc.perform(post(EDGE_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").isNotEmpty())
                .andExpect(jsonPath("$.startVertexId", is(edgeDto.getStartVertexId())))
                .andExpect(jsonPath("$.endVertexId", is(edgeDto.getEndVertexId())));
    }

    @Test
    public void putTest() throws Exception {
        final String originalStartVertexId = edgeDto.getStartVertexId();
        final String updatedStartVertexId = String.format("2%023d", 2);

        edgeDto.setStartVertexId(updatedStartVertexId);

        assertNotEquals(originalStartVertexId, updatedStartVertexId);

        byte[] content = objectMapper.writeValueAsBytes(edgeDto);

        mockMvc.perform(put(EDGE_PATH).contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(edgeDto.getEntityId()))
                .andExpect(jsonPath("$.startVertexId", is(updatedStartVertexId)))
                .andExpect(jsonPath("$.endVertexId", is(edgeDto.getEndVertexId())));
    }

    @Test
    public void deleteTest() throws Exception {
        final Collection<EdgeDto> dtos = edgeService.findAll();
        assertNotNull(DTO_COLLECTION_IS_NULL, dtos);
        assertFalse(DTO_NOT_PRESENTED, dtos.isEmpty());
        final EdgeDto expected = dtos.iterator().next();
        assertNotNull(DTO_IS_NULL, expected);

        final String urlTemplate = EDGE_PATH + expected.getEntityId();
        LOGGER.info("DELETE URL {}", urlTemplate);
        mockMvc.perform(delete(urlTemplate)).andExpect(status().isOk());
    }

    @Test
    public void exceptionShouldBeThrownWhenRightVertexIdEqualsLeftVertexId() throws Exception {
        VertexDto vertexDto = new VertexDto();
        vertexDto.setLevelId(levelDto.getEntityId());
        vertexDto = vertexService.save(vertexDto);
        EdgeDto edgeDto = new EdgeDto();

        edgeDto.setStartVertexId(vertexDto.getEntityId());
        edgeDto.setEndVertexId(vertexDto.getEntityId());
        edgeService.save(edgeDto);

        String leftVertexId = edgeDto.getStartVertexId();
        String rightVertexId = edgeDto.getEndVertexId();

        final byte[] content = objectMapper.writeValueAsBytes(edgeDto);

        mockMvc.perform(get("/api/v1/edges/byVertices/" + leftVertexId + "/" + rightVertexId)
                .contentType(MediaType.APPLICATION_JSON_VALUE).content(content))
                .andExpect(status().isBadRequest())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals(VERTICES_ARE_EQUAL, result.getResolvedException().getMessage()));
    }

    @Test
    public void findAllByVertexTest() throws Exception {
        String urlTemplate = EDGE_PATH + "byVertex/" + startVertexDto.getEntityId();
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$[0].entityId").value(edgeDto.getEntityId()))
                .andExpect(jsonPath("$[0].startVertexId").value(edgeDto.getStartVertexId()))
                .andExpect(jsonPath("$[0].endVertexId").value(edgeDto.getEndVertexId()));
    }

    @Test
    public void findEdgedByVerticesIdTest() throws Exception {
        String urlTemplate = EDGE_PATH + "byVertices/"
                + startVertexDto.getEntityId() + "/"
                + endVertexDto.getEntityId();
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$.entityId").value(edgeDto.getEntityId()))
                .andExpect(jsonPath("$.startVertexId").value(edgeDto.getStartVertexId()))
                .andExpect(jsonPath("$.endVertexId").value(edgeDto.getEndVertexId()));
    }

    @Test
    public void findAllByLevelIdTest() throws Exception {
        String urlTemplate = EDGE_PATH + "byLevel/" + levelDto.getEntityId();
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$[0].entityId").value(edgeDto.getEntityId()))
                .andExpect(jsonPath("$[0].startVertexId").value(edgeDto.getStartVertexId()))
                .andExpect(jsonPath("$[0].endVertexId").value(edgeDto.getEndVertexId()));
    }
}
