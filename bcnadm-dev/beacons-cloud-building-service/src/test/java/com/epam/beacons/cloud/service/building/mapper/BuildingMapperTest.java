package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Building;
import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.mapper.BuildingMapper;
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
public class BuildingMapperTest {

    @Autowired
    private BuildingMapper mapper;

    @Test
    public void testBuildingMapperShouldMapEntityToDto() {
        Building building = new Building();
        building.setId("testId");
        building.setAddress("testAddress");
        building.setName("testName");
        building.setLatitude(1.23);
        building.setLongitude(3.21);
        building.setWidth(1.0);
        building.setHeight(1.0);
        building.setPhoneNumber("testPhoneNumber");
        building.setWorkingHours("testWorkingHours");

        BuildingDto expectedBuildingDto = new BuildingDto();
        expectedBuildingDto.setEntityId(building.getId());
        expectedBuildingDto.setAddress(building.getAddress());
        expectedBuildingDto.setName(building.getName());
        expectedBuildingDto.setLatitude(building.getLatitude());
        expectedBuildingDto.setLongitude(building.getLongitude());
        expectedBuildingDto.setWidth(building.getWidth());
        expectedBuildingDto.setHeight(building.getHeight());
        expectedBuildingDto.setPhoneNumber(building.getPhoneNumber());
        expectedBuildingDto.setWorkingHours(building.getWorkingHours());

        assertThat(expectedBuildingDto, samePropertyValuesAs(mapper.entityToDto(building)));
    }

    @Test
    public void testBuildingMapperShouldMapDtoToEntity() {
        BuildingDto buildingDto = new BuildingDto();
        buildingDto.setEntityId("testId");
        buildingDto.setAddress("testAddress");
        buildingDto.setName("testName");
        buildingDto.setLatitude(1.23);
        buildingDto.setLongitude(3.21);
        buildingDto.setWidth(1.0);
        buildingDto.setHeight(1.0);
        buildingDto.setPhoneNumber("testPhoneNumber");
        buildingDto.setWorkingHours("testWorkingHours");

        Building expectedBuilding = new Building();
        expectedBuilding.setId(buildingDto.getEntityId());
        expectedBuilding.setAddress(buildingDto.getAddress());
        expectedBuilding.setName(buildingDto.getName());
        expectedBuilding.setLatitude(buildingDto.getLatitude());
        expectedBuilding.setLongitude(buildingDto.getLongitude());
        expectedBuilding.setWidth(buildingDto.getWidth());
        expectedBuilding.setHeight(buildingDto.getHeight());
        expectedBuilding.setPhoneNumber(buildingDto.getPhoneNumber());
        expectedBuilding.setWorkingHours(buildingDto.getWorkingHours());

        Building actualBuilding = mapper.dtoToEntity(buildingDto);

        assertThat(expectedBuilding, samePropertyValuesAs(actualBuilding));
    }

    @Test
    public void testEntityToDtoShouldReturnNullWhenSupplyNull() {
        assertNull(mapper.entityToDto(null));
    }

    @Test
    public void testDtoToEntityShouldReturnNullWhenSupplyNull() {
        assertNull(mapper.dtoToEntity(null));
    }
}
