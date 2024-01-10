package com.epam.beacons.cloud.service.building.service;

import static org.junit.jupiter.api.Assertions.assertThrows;

import com.epam.beacons.cloud.service.building.domain.AreaDto;
import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link LevelService}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})

public class LevelServiceTest {

    @MockBean
    protected UaaRemoteService uaaRemoteService;
    @Autowired
    private BeaconService beaconService;
    @Autowired
    private LevelService levelService;
    @Autowired
    private AreaService areaService;
    @Autowired
    private VertexService vertexService;
    @Autowired
    private EdgeService edgeService;
    @Autowired
    private GraphRepository graphRepository;

    @After
    public void drop() {
        levelService.deleteAll();
    }

    @Test
    public void deleteTest() {
        GraphEntity graph = new GraphEntity();
        graph.setBuildingId(String.format("Building%016d", 1));
        graphRepository.save(graph);
        LevelDto levelDto = new LevelDto();
        levelDto.setBuildingId(String.format("Building%016d", 1));
        levelDto = levelService.save(levelDto);

        AreaDto areaDto = new AreaDto();
        areaDto.setLevelId(levelDto.getEntityId());
        areaDto = areaService.save(areaDto);

        VertexDto vertexDto = new VertexDto();
        vertexDto.setLevelId(levelDto.getEntityId());
        vertexDto = vertexService.save(vertexDto);

        BeaconDto beaconDto = new BeaconDto();
        beaconDto.setLevelId(levelDto.getEntityId());
        beaconDto = beaconService.save(beaconDto);

        EdgeDto edgeDto = new EdgeDto();
        edgeDto.setEndVertexId(vertexDto.getEntityId());
        edgeDto = edgeService.save(edgeDto);

        levelService.delete(levelDto);

        final String levelEntityId = levelDto.getEntityId();
        assertThrows(EntityNotFoundException.class, () -> levelService.findOne(levelEntityId));

        final String areaEntityId = areaDto.getEntityId();
        assertThrows(EntityNotFoundException.class, () -> areaService.findOne(areaEntityId));

        final String vertexEntityId = vertexDto.getEntityId();
        assertThrows(EntityNotFoundException.class, () -> vertexService.findOne(vertexEntityId));

        final String beaconEntityId = beaconDto.getEntityId();
        assertThrows(EntityNotFoundException.class, () -> beaconService.findOne(beaconEntityId));

        final String edgeEntityId = edgeDto.getEntityId();
        assertThrows(EntityNotFoundException.class, () -> edgeService.findOne(edgeEntityId));
    }

    @Test
    public void saveThrowsNonUniqueValueExceptionIfLevelHaveSameBuildingIdAndNumberTest() {
        LevelDto levelDto1 = new LevelDto();
        levelDto1.setBuildingId(String.format("1%023d", 1));
        levelDto1.setNumber(1);
        levelService.save(levelDto1);
        LevelDto levelDto2 = new LevelDto();
        levelDto2.setBuildingId(String.format("1%023d", 1));
        levelDto2.setNumber(1);

        Assert.assertThrows(NonUniqueValueException.class, () -> levelService.save(levelDto2));
    }
}
