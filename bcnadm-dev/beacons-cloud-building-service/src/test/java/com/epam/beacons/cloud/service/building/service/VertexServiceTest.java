package com.epam.beacons.cloud.service.building.service;

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.Level;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.domain.VertexType;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.repository.LevelRepository;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link VertexService}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})
public class VertexServiceTest {

    @Autowired
    private VertexService vertexService;
    @Autowired
    private EdgeService edgeService;
    @Autowired
    private LevelRepository levelRepository;
    @Autowired
    private GraphRepository graphRepository;
    
    @After
    public void drop() {
        vertexService.deleteAll();
        levelRepository.deleteAll();
        graphRepository.deleteAll();
    }

    @Test
    public void whenSaveVertexWithoutTypeThenDefaultTypeIsSetToNoneTest() {
        GraphEntity graph = new GraphEntity();
        graph.setBuildingId(String.format("Building%016d", 1));
        graphRepository.save(graph);
        Level level = new Level();
        level.setBuildingId(String.format("Building%016d", 1));
        String levelId = levelRepository.save(level).getId();
        VertexDto vertexDto = new VertexDto();
        vertexDto.setLevelId(levelId);
        vertexDto.setLatitude(1);
        vertexDto.setLongitude(1);
        VertexDto savedVertex = vertexService.save(vertexDto);
        assertEquals(VertexType.getDefault(), savedVertex.getType());
    }
    
    @Test
    public void deleteAllTest() {
        GraphEntity graph1 = new GraphEntity();
        graph1.setBuildingId(String.format("Building%016d", 1));
        graphRepository.save(graph1);
        Level level = new Level();
        level.setBuildingId(String.format("Building%016d", 1));
        String levelId1 = levelRepository.save(level).getId();
        VertexDto vertexDto1 = new VertexDto();
        vertexDto1.setLevelId(levelId1);
        String vertexId1 = vertexService.save(vertexDto1).getEntityId();
        EdgeDto edgeDto1 = new EdgeDto();
        edgeDto1.setStartVertexId(vertexId1);
        edgeService.save(edgeDto1);
        VertexDto vertexDto2 = new VertexDto();
        vertexDto2.setLevelId(levelId1);
        String vertexId2 = vertexService.save(vertexDto2).getEntityId();
        EdgeDto edgeDto2 = new EdgeDto();
        edgeDto2.setStartVertexId(vertexId2);
        edgeService.save(edgeDto2);

        GraphEntity graph2 = new GraphEntity();
        graph2.setBuildingId(String.format("Building%016d", 2));
        graphRepository.save(graph2);
        Level level2 = new Level();
        level2.setBuildingId(String.format("Building%016d", 2));
        String levelId2 = levelRepository.save(level2).getId();
        VertexDto vertexDto3 = new VertexDto();
        vertexDto3.setLevelId(levelId2);
        String vertexId3 = vertexService.save(vertexDto3).getEntityId();
        EdgeDto edgeDto3 = new EdgeDto();
        edgeDto3.setStartVertexId(vertexId3);
        edgeService.save(edgeDto3);

        Assert.assertEquals(3, vertexService.findAll().size());
        Assert.assertEquals(3, edgeService.findAll().size());
        vertexService.deleteAll();
        Assert.assertEquals(0, vertexService.findAll().size());
        Assert.assertEquals(0, edgeService.findAll().size());
    }

    @Test
    public void deleteAllByLevelTest() {
        GraphEntity graph1 = new GraphEntity();
        graph1.setBuildingId(String.format("Building%016d", 1));
        graphRepository.save(graph1);
        Level level1 = new Level();
        String levelId1 = String.format("EntityID%016d", 1);
        level1.setBuildingId(String.format("Building%016d", 1));
        level1.setId(levelId1);
        levelRepository.save(level1);
        VertexDto vertexDto1 = new VertexDto();
        vertexDto1.setLevelId(levelId1);
        String vertexId1 = vertexService.save(vertexDto1).getEntityId();
        EdgeDto edgeDto1 = new EdgeDto();
        edgeDto1.setStartVertexId(vertexId1);
        edgeDto1 = edgeService.save(edgeDto1);
        VertexDto vertexDto2 = new VertexDto();
        vertexDto2.setLevelId(levelId1);
        vertexService.save(vertexDto2);

        Level level2 = new Level();
        String levelId2 = String.format("EntityID%016d", 2);
        level2.setBuildingId(String.format("Building%016d", 1));
        level2.setId(levelId2);
        level2.setNumber(1);
        levelRepository.save(level2);
        VertexDto vertexDto3 = new VertexDto();
        vertexDto3.setLevelId(levelId2);
        String vertexId3 = vertexService.save(vertexDto3).getEntityId();
        EdgeDto edgeDto2 = new EdgeDto();
        edgeDto2.setEndVertexId(vertexId3);
        edgeService.save(edgeDto2);
        EdgeDto edgeDto3 = new EdgeDto();
        edgeDto3.setStartVertexId(vertexId3);
        edgeService.save(edgeDto3);

        Assert.assertEquals(3, vertexService.findAll().size());
        Assert.assertEquals(3, edgeService.findAll().size());
        vertexService.deleteAll(levelId1);
        Assert.assertEquals(1, vertexService.findAll().size());
        Assert.assertEquals(vertexId3, vertexService.findOne(vertexId3).getEntityId());
        Assert.assertEquals(2, edgeService.findAll().size());
        String edgeId1 = edgeDto1.getEntityId();
        Assert.assertThrows(EntityNotFoundException.class, () -> edgeService.findOne(edgeId1));
        vertexService.deleteAll(levelId2);
        assertEquals(0, vertexService.findAll().size());
        assertEquals(0, edgeService.findAll().size());
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsNull() {
        Exception ex = assertThrows(IllegalArgumentException.class, () -> vertexService.deleteAll(null));
        Assert.assertEquals("Level id wasn't provided", ex.getMessage());
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsIncorrect() {
        Exception ex = assertThrows(IllegalArgumentException.class, () -> vertexService.deleteAll("InvalidId"));
        Assert.assertEquals("Incorrect level id", ex.getMessage());
    }
}
