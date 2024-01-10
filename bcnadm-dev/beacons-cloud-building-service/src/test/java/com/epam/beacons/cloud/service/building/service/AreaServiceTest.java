package com.epam.beacons.cloud.service.building.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import com.epam.beacons.cloud.service.building.domain.AreaDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "spring.cloud.vault.enabled=false", "eureka.client.enabled=false"})
public class AreaServiceTest {

    @Autowired
    private AreaService areaService;

    @Test
    public void deleteAllTest() {
        AreaDto areaDto1 = new AreaDto();
        areaDto1.setLevelId(String.format("EntityID%016d", 1));
        areaService.save(areaDto1);
        AreaDto areaDto2 = new AreaDto();
        areaDto2.setLevelId(String.format("EntityID%016d", 1));
        areaService.save(areaDto2);
        AreaDto areaDto3 = new AreaDto();
        areaDto3.setLevelId(String.format("EntityID%016d", 2));
        areaService.save(areaDto3);

        assertEquals(3, areaService.findAll().size());
        areaService.deleteAll();
        assertEquals(0, areaService.findAll().size());
    }

    @Test
    public void deleteAllOnLevelTest() {
        String levelId1 = String.format("EntityID%016d", 1);
        AreaDto areaDto1 = new AreaDto();
        areaDto1.setLevelId(levelId1);
        areaService.save(areaDto1);
        AreaDto areaDto2 = new AreaDto();
        areaDto2.setLevelId(levelId1);
        areaService.save(areaDto2);
        String levelId2 = String.format("EntityID%016d", 2);
        AreaDto areaDto3 = new AreaDto();
        areaDto3.setLevelId(levelId2);
        areaDto3 = areaService.save(areaDto3);

        assertEquals(3, areaService.findAll().size());
        areaService.deleteAll(levelId1);
        assertEquals(1, areaService.findAll().size());
        assertEquals(areaDto3, areaService.findOne(areaDto3.getEntityId()));
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsNull() {
        Exception ex = assertThrows(IllegalArgumentException.class, () -> areaService.deleteAll(null));
        assertEquals("Level id wasn't provided", ex.getMessage());
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsIncorrect() {
        Exception ex = assertThrows(
                IllegalArgumentException.class, () -> areaService.deleteAll("InvalidId")
        );
        assertEquals("Incorrect level id", ex.getMessage());
    }

    @After
    public void drop() {
        areaService.deleteAll();
    }
}
