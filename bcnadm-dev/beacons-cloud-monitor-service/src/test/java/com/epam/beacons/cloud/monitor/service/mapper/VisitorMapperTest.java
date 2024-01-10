package com.epam.beacons.cloud.monitor.service.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.Visitor;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class VisitorMapperTest {

    private static final VisitorMapper MAPPER = Mappers.getMapper(VisitorMapper.class);

    @Test
    public void testVisitorMapperShouldMapEntityToDto() {
        Visitor entity = new Visitor();
        entity.setId("testId");
        entity.setName("testName");
        entity.setDeviceId("testDeviceId");
        entity.setType(DeviceType.EMITTER);

        VisitorDto expectedDto = new VisitorDto();
        expectedDto.setEntityId(entity.getId());
        expectedDto.setName(entity.getName());
        expectedDto.setDeviceId(entity.getDeviceId());
        expectedDto.setType(entity.getType());

        VisitorDto actualDto = MAPPER.entityToDto(entity);

        assertThat(expectedDto, samePropertyValuesAs(actualDto));
    }

    @Test
    public void testVisitorMapperShouldMapDtoToEntity() {
        VisitorDto dto = new VisitorDto();
        dto.setEntityId("testId");
        dto.setName("testName");
        dto.setDeviceId("testDeviceId");
        dto.setType(DeviceType.EMITTER);

        Visitor expectedEntity = new Visitor();
        expectedEntity.setId(dto.getEntityId());
        expectedEntity.setName(dto.getName());
        expectedEntity.setDeviceId(dto.getDeviceId());
        expectedEntity.setType(dto.getType());

        Visitor actualEntity = MAPPER.dtoToEntity(dto);

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
