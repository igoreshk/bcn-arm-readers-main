package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Area;
import com.epam.beacons.cloud.service.building.domain.AreaDto;
import com.epam.beacons.cloud.service.building.domain.Coordinate;
import java.util.ArrayList;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class AreaMapperTest {

    private final AreaMapper mapper = Mappers.getMapper(AreaMapper.class);

    @Test
    public void testAreaMapperShouldMapEntityToDto() {
        Area area = new Area();
        area.setId("testId");
        area.setDescription("testDescription");
        area.setName("testName");
        area.setLevelId("testLevelId");
        area.setCoordinates(new ArrayList<Coordinate>());

        AreaDto expectedAreaDto = new AreaDto();
        expectedAreaDto.setEntityId(area.getId());
        expectedAreaDto.setDescription(area.getDescription());
        expectedAreaDto.setName(area.getName());
        expectedAreaDto.setLevelId(area.getLevelId());
        expectedAreaDto.setCoordinates(area.getCoordinates());

        assertThat(expectedAreaDto, samePropertyValuesAs(mapper.entityToDto(area)));
    }

    @Test
    public void testAreaMapperShouldMapDtoToEntity() {
        AreaDto areaDto = new AreaDto();
        areaDto.setEntityId("testId");
        areaDto.setDescription("testDescription");
        areaDto.setName("testName");
        areaDto.setLevelId("testLevelId");
        areaDto.setCoordinates(new ArrayList<>());

        Area expectedEntity = new Area();
        expectedEntity.setId(areaDto.getEntityId());
        expectedEntity.setDescription(areaDto.getDescription());
        expectedEntity.setName(areaDto.getName());
        expectedEntity.setLevelId(areaDto.getLevelId());
        expectedEntity.setCoordinates(areaDto.getCoordinates());

        Area actualEntity = mapper.dtoToEntity(areaDto);

        assertThat(expectedEntity, samePropertyValuesAs(actualEntity));
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
