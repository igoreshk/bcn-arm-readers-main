package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Beacon;
import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class BeaconMapperTest {

    private final BeaconMapper mapper = Mappers.getMapper(BeaconMapper.class);

    @Test
    public void testBeaconMapperShouldMapEntityToDto() {
        Beacon entity = new Beacon();
        entity.setId("testId");
        entity.setLatitude(0.0);
        entity.setLongitude(0.0);
        entity.setUuid("testUuis");
        entity.setLevelId("testLevelId");

        BeaconDto expectedDto = new BeaconDto();
        expectedDto.setEntityId(entity.getId());
        expectedDto.setLatitude(entity.getLatitude());
        expectedDto.setLongitude(entity.getLongitude());
        expectedDto.setUuid(entity.getUuid());
        expectedDto.setLevelId(entity.getLevelId());

        assertThat(expectedDto, samePropertyValuesAs(mapper.entityToDto(entity)));
    }

    @Test
    public void testBeaconMapperShouldMapDtoToEntity() {
        BeaconDto dto = new BeaconDto();
        dto.setEntityId("testEntityId");
        dto.setLatitude(0.0);
        dto.setLongitude(0.0);
        dto.setUuid("testUuis");
        dto.setLevelId("testLevelId");

        Beacon expectedEntity = new Beacon();
        expectedEntity.setId(dto.getEntityId());
        expectedEntity.setLatitude(dto.getLatitude());
        expectedEntity.setLongitude(dto.getLongitude());
        expectedEntity.setUuid(dto.getUuid());
        expectedEntity.setLevelId(dto.getLevelId());

        assertThat(expectedEntity, samePropertyValuesAs(mapper.dtoToEntity(dto)));
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
