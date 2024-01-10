package com.epam.beacons.cloud.service.building.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false",
        "spring.cloud.config.enabled=false", "spring.cloud.vault.enabled=false",
        "eureka.client.enabled=false"})
public class BeaconServiceTest {

    @Autowired
    private BeaconService beaconService;

    @Test
    public void deleteAllTest() {
        BeaconDto beaconDto1 = new BeaconDto();
        beaconDto1.setUuid("uuid1");
        beaconDto1.setLevelId(String.format("EntityID%016d", 1));
        beaconService.save(beaconDto1);
        BeaconDto beaconDto2 = new BeaconDto();
        beaconDto2.setUuid("uuid2");
        beaconDto2.setLevelId(String.format("EntityID%016d", 1));
        beaconService.save(beaconDto2);
        BeaconDto beaconDto3 = new BeaconDto();
        beaconDto3.setUuid("uuid3");
        beaconDto3.setLevelId(String.format("EntityID%016d", 2));
        beaconService.save(beaconDto3);

        Assert.assertEquals(3, beaconService.findAll().size());
        beaconService.deleteAll();
        Assert.assertEquals(0, beaconService.findAll().size());
    }

    @Test
    public void deleteAllByLevelTest() {
        String levelId1 = String.format("EntityID%016d", 1);
        BeaconDto beaconDto1 = new BeaconDto();
        beaconDto1.setUuid("uuid1");
        beaconDto1.setLevelId(levelId1);
        beaconService.save(beaconDto1);
        BeaconDto beaconDto2 = new BeaconDto();
        beaconDto2.setUuid("uuid2");
        beaconDto2.setLevelId(levelId1);
        beaconService.save(beaconDto2);
        String levelId2 = String.format("EntityID%016d", 2);
        BeaconDto beaconDto3 = new BeaconDto();
        beaconDto3.setUuid("uuid3");
        beaconDto3.setLevelId(levelId2);
        beaconDto3 = beaconService.save(beaconDto3);

        Assert.assertEquals(3, beaconService.findAll().size());
        beaconService.deleteAll(levelId1);
        Assert.assertEquals(1, beaconService.findAll().size());
        Assert.assertEquals(beaconDto3, beaconService.findOne(beaconDto3.getEntityId()));
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsNull() {
        Exception ex = Assert.assertThrows(IllegalArgumentException.class, () -> beaconService.deleteAll(null));
        Assert.assertEquals("Level id wasn't provided", ex.getMessage());
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsIncorrect() {
        Exception ex = Assert.assertThrows(IllegalArgumentException.class,
                () -> beaconService.deleteAll("InvalidId"));
        Assert.assertEquals("Incorrect level id", ex.getMessage());
    }

    @Test
    public void throwsExceptionWhenAddingBeaconWithSameUuid() {
        BeaconDto beaconDto = new BeaconDto();
        beaconDto.setUuid("test1");
        beaconService.save(beaconDto);
        BeaconDto beaconWithSameUuid = new BeaconDto();
        beaconWithSameUuid.setUuid("test1");
        Exception exception = assertThrows(NonUniqueValueException.class, () ->
                beaconService.save(beaconWithSameUuid));
        assertEquals("Beacon with such uuid already exists", exception.getMessage());
    }

    @After
    public void drop() {
        beaconService.deleteAll();
    }
}
