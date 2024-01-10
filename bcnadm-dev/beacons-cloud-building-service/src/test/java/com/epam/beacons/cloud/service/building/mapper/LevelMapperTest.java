package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Level;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class LevelMapperTest {

    private final LevelMapper mapper = Mappers.getMapper(LevelMapper.class);

    @Test
    public void testLevelMapperShouldMapEntityToDto() {
        Level entity = new Level();
        entity.setId("testId");
        entity.setNumber(1);
        entity.setBuildingId("testBuildingId");
        entity.setSouthWestLatitude(1.0);
        entity.setSouthWestLongitude(1.0);
        entity.setNorthEastLatitude(-1.0);
        entity.setNorthEastLongitude(-1.0);
        entity.setScaleStartLatitude(1.0);
        entity.setScaleStartLongitude(1.0);
        entity.setScaleEndLatitude(-1.0);
        entity.setScaleEndLongitude(-1.0);
        entity.setScaleDistance(3.44);

        LevelDto expectedDto = new LevelDto();
        expectedDto.setEntityId(entity.getId());
        expectedDto.setNumber(entity.getNumber());
        expectedDto.setBuildingId(entity.getBuildingId());
        expectedDto.setSouthWestLatitude(entity.getSouthWestLatitude());
        expectedDto.setSouthWestLongitude(entity.getSouthWestLongitude());
        expectedDto.setNorthEastLatitude(entity.getNorthEastLatitude());
        expectedDto.setNorthEastLongitude(entity.getNorthEastLongitude());
        expectedDto.setScaleStartLatitude(entity.getScaleStartLatitude());
        expectedDto.setScaleStartLongitude(entity.getScaleStartLongitude());
        expectedDto.setScaleEndLatitude(entity.getScaleEndLatitude());
        expectedDto.setScaleEndLongitude(entity.getScaleEndLongitude());
        expectedDto.setScaleDistance(entity.getScaleDistance());

        assertThat(expectedDto, samePropertyValuesAs(mapper.entityToDto(entity)));
    }

    @Test
    public void testLevelMapperShouldMapDtoToEntity() {
        LevelDto dto = new LevelDto();
        dto.setEntityId("testId");
        dto.setNumber(1);
        dto.setBuildingId("testBuildingId");
        dto.setSouthWestLatitude(1.0);
        dto.setSouthWestLongitude(1.0);
        dto.setNorthEastLatitude(-1.0);
        dto.setNorthEastLongitude(-1.0);
        dto.setScaleStartLatitude(1.0);
        dto.setScaleStartLongitude(1.0);
        dto.setScaleEndLatitude(-1.0);
        dto.setScaleEndLongitude(-1.0);
        dto.setScaleDistance(3.44);

        Level expectedEntity = new Level();
        expectedEntity.setId(dto.getEntityId());
        expectedEntity.setNumber(dto.getNumber());
        expectedEntity.setBuildingId(dto.getBuildingId());
        expectedEntity.setSouthWestLatitude(dto.getSouthWestLatitude());
        expectedEntity.setSouthWestLongitude(dto.getSouthWestLongitude());
        expectedEntity.setNorthEastLatitude(dto.getNorthEastLatitude());
        expectedEntity.setNorthEastLongitude(dto.getNorthEastLongitude());
        expectedEntity.setScaleStartLatitude(dto.getScaleStartLatitude());
        expectedEntity.setScaleStartLongitude(dto.getScaleStartLongitude());
        expectedEntity.setScaleEndLatitude(dto.getScaleEndLatitude());
        expectedEntity.setScaleEndLongitude(dto.getScaleEndLongitude());
        expectedEntity.setScaleDistance(dto.getScaleDistance());

        Level actualEntity = mapper.dtoToEntity(dto);

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
