package com.epam.beacons.cloud.service.building.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.service.building.domain.AreaDto;
import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.domain.Coordinate;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.domain.VertexType;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.service.AreaService;
import com.epam.beacons.cloud.service.building.service.BeaconService;
import com.epam.beacons.cloud.service.building.service.BuildingService;
import com.epam.beacons.cloud.service.building.service.EdgeService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.epam.beacons.cloud.service.building.service.VertexService;
import java.util.Arrays;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * This {@code BuildingCascadeDeletionTest} class tests the {@code BuildingController} class.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
@MockBean(UaaRemoteService.class)
public class BuildingCascadeDeletionTest {

    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private BuildingService buildingService;
    @Autowired
    private LevelService levelService;
    @Autowired
    private AreaService areaService;
    @Autowired
    private BeaconService beaconService;
    @Autowired
    private EdgeService edgeService;
    @Autowired
    private VertexService vertexService;
    @Autowired
    private GraphRepository graphRepository;

    private MockMvc mockMvc;
    private BuildingDto buildingDto;
    private LevelDto levelDto;
    private VertexDto vertexDto;
    private EdgeDto edgeDto;
    private AreaDto areaDto;
    private BeaconDto beaconDto;
    private GraphEntity graph;

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
        buildingDto = new BuildingDto();
        buildingDto.setLatitude(1.0023);
        buildingDto.setLongitude(1.0023);
        buildingDto.setAddress("Test Building Address");
        buildingDto.setHeight(10.0023);
        buildingDto.setWidth(10.0023);
        buildingDto.setName("Test Building Name");
        buildingDto.setWorkingHours("11-12");
        buildingDto.setPhoneNumber("999-666-753");
        buildingDto.setCreatedBy("Test Created By");
        buildingDto = buildingService.save(buildingDto);

        graph = new GraphEntity();
        graph.setBuildingId(buildingDto.getEntityId());
        graphRepository.save(graph);

        levelDto = new LevelDto();
        levelDto.setBuildingId(buildingDto.getEntityId());
        levelDto.setNumber(1);
        levelDto.setSouthWestLatitude(1.0023);
        levelDto.setSouthWestLongitude(2.0023);
        levelDto.setNorthEastLatitude(3.0023);
        levelDto.setNorthEastLongitude(4.0023);
        levelDto = levelService.save(levelDto);

        vertexDto = new VertexDto();
        vertexDto.setLevelId(levelDto.getEntityId());
        vertexDto.setLatitude(1.0023);
        vertexDto.setLongitude(2.0023);
        vertexDto.setType(VertexType.ENTRY_EXIT);
        vertexDto = vertexService.save(vertexDto);

        edgeDto = new EdgeDto();
        edgeDto.setStartVertexId(vertexDto.getEntityId());
        edgeDto.setEndVertexId(vertexDto.getLevelId());
        edgeDto = edgeService.save(edgeDto);

        areaDto = new AreaDto();
        areaDto.setLevelId(levelDto.getEntityId());
        areaDto.setName("name");
        areaDto.setDescription("description");
        areaDto.setCoordinates(Arrays.asList(new Coordinate(1.0023, 2.0023),
                new Coordinate(3.0023, 4.0023)));
        areaDto = areaService.save(areaDto);

        beaconDto = new BeaconDto();
        beaconDto.setLevelId(levelDto.getEntityId());
        beaconDto.setLatitude(1.0023);
        beaconDto.setLongitude(2.0023);
        beaconDto.setUuid("10001");
        beaconDto = beaconService.save(beaconDto);
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        areaService.deleteAll();
        beaconService.deleteAll();
        buildingService.deleteAll();
        edgeService.deleteAll();
        vertexService.deleteAll();
        levelService.deleteAll();
        graphRepository.deleteAll();
    }

    /**
     * Test cascade deletion of all building's nested objects.
     */
    @Test
    @DisplayName("The first step is the presence check of entities, then deletion occurs. "
            + "At the end the absence check of entities is made")
    public void cascadeDeletionTest() throws Exception {
        mockMvc.perform(get("/api/v1/buildings/" + buildingDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityId").value(buildingDto.getEntityId()));

        mockMvc.perform(get("/api/v1/levels/" + levelDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityId").value(levelDto.getEntityId()));

        mockMvc.perform(get("/api/v1/vertices/" + vertexDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityId").value(vertexDto.getEntityId()));

        mockMvc.perform(get("/api/v1/edges/" + edgeDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityId").value(edgeDto.getEntityId()));

        mockMvc.perform(get("/api/v1/areas/" + areaDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityId").value(areaDto.getEntityId()));

        mockMvc.perform(get("/api/v1/beacons/" + beaconDto.getEntityId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entityId").value(beaconDto.getEntityId()));

        mockMvc.perform(delete("/api/v1/buildings/" + buildingDto.getEntityId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/levels/" + levelDto.getEntityId()))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/v1/vertices/" + vertexDto.getEntityId()))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/v1/edges/" + edgeDto.getEntityId()))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/v1/areas/" + areaDto.getEntityId()))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/v1/beacons/" + beaconDto.getEntityId()))
                .andExpect(status().isNotFound());
    }
}
