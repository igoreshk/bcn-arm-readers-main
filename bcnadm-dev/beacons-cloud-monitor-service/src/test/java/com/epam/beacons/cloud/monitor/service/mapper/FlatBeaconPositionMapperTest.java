package com.epam.beacons.cloud.monitor.service.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPosition;
import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class FlatBeaconPositionMapperTest {

    private static final FlatBeaconPositionMapper MAPPER = Mappers.getMapper(FlatBeaconPositionMapper.class);

    @Test
    public void testFlatBeaconPositionMapperShouldMapEntityToDto() {
        FlatBeaconPosition entity = new FlatBeaconPosition();
        entity.setId("testId");
        entity.setLevelId("testLevelId");
        entity.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
        entity.setLatitude(1.0);
        entity.setLongitude(1.0);
        entity.setDeviceId("testDeviceId");
        entity.setHeartRate(80);
        entity.setBodyTemperature(36.6);
        entity.setStepCount(2000);

        FlatBeaconPositionDto expectedDto = new FlatBeaconPositionDto();
        expectedDto.setEntityId(entity.getId());
        expectedDto.setTimestamp(entity.getTimestamp());
        expectedDto.setLevelId(entity.getLevelId());
        expectedDto.setLatitude(entity.getLatitude());
        expectedDto.setLongitude(entity.getLongitude());
        expectedDto.setDeviceId(entity.getDeviceId());
        expectedDto.setHeartRate(entity.getHeartRate());
        expectedDto.setBodyTemperature(entity.getBodyTemperature());
        expectedDto.setStepCount(entity.getStepCount());

        FlatBeaconPositionDto actualDto = MAPPER.entityToDto(entity);

        assertThat(expectedDto, samePropertyValuesAs(actualDto));
    }

    @Test
    public void testFlatBeaconPositionMapperShouldMapDtoToEntity() {
        FlatBeaconPositionDto dto = new FlatBeaconPositionDto();
        dto.setEntityId("testId");
        dto.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
        dto.setLevelId("testLevelId");
        dto.setLatitude(1.0);
        dto.setLongitude(1.0);
        dto.setDeviceId("testUuid");
        dto.setHeartRate(80);
        dto.setBodyTemperature(36.6);
        dto.setStepCount(2000);

        FlatBeaconPosition expectedEntity = new FlatBeaconPosition();
        expectedEntity.setId(dto.getEntityId());
        expectedEntity.setTimestamp(dto.getTimestamp());
        expectedEntity.setLevelId(dto.getLevelId());
        expectedEntity.setLatitude(dto.getLatitude());
        expectedEntity.setLongitude(dto.getLongitude());
        expectedEntity.setDeviceId(dto.getDeviceId());
        expectedEntity.setHeartRate(dto.getHeartRate());
        expectedEntity.setBodyTemperature(dto.getBodyTemperature());
        expectedEntity.setStepCount(dto.getStepCount());

        FlatBeaconPosition actualEntity = MAPPER.dtoToEntity(dto);

        assertThat(expectedEntity, samePropertyValuesAs(actualEntity));
    }

    @Test
    public void testEntityToDtoShouldReturnNullWhenSupplyNull() {
        assertNull(MAPPER.entityToDto(null));
    }

    @Test
    public void testDtoToEntityShouldReturnNullWhenSupplyNull() {
        assertNull(MAPPER.dtoToEntity(null));
    }
}
