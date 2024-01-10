package com.epam.beacons.cloud.service.building.service;

import static org.junit.Assert.assertThrows;

import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BuildingServiceTest {

    @Autowired
    private BuildingService buildingService;

    @Before
    public void setUp() {
        BuildingDto buildingDto = new BuildingDto();
        buildingDto.setName("Cathedral");
        buildingDto.setAddress("Nevsky avenue");
        buildingService.save(buildingDto);
    }

    @After
    public void tearDown() {
        buildingService.deleteAll();
    }

    @Test
    public void saveThrowsNonUniqueValueExceptionIfTwoBuildingsHaveSameNameTest() {
        BuildingDto buildingWithSameName = new BuildingDto();
        buildingWithSameName.setName("Cathedral");
        buildingWithSameName.setAddress("Fontanka");

        assertThrows(NonUniqueValueException.class, () -> buildingService.save(buildingWithSameName));
    }

    @Test
    public void saveThrowsNonUniqueValueExceptionIfTwoBuildingsHaveSameAddressTest() {
        BuildingDto buildingWithSameAddress = new BuildingDto();
        buildingWithSameAddress.setName("Bank");
        buildingWithSameAddress.setAddress("Nevsky avenue");

        assertThrows(NonUniqueValueException.class, () -> buildingService.save(buildingWithSameAddress));
    }

    @Test
    public void saveThrowsIllegalArgumentExceptionIfEntityIdIsSetExplicitlyTest() {
        BuildingDto buildingWithExplicitEntityId = new BuildingDto();
        buildingWithExplicitEntityId.setEntityId("explicit entityId");
        buildingWithExplicitEntityId.setName("Building");
        buildingWithExplicitEntityId.setAddress("Fontanka");

        assertThrows(IllegalArgumentException.class, () -> buildingService.save(buildingWithExplicitEntityId));
    }
}
