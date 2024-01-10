package com.epam.beacons.cloud.monitor.service.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.monitor.service.domain.VisitorGroup;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import java.util.HashSet;
import java.util.Set;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class VisitorGroupMapperTest {

    private static final VisitorGroupMapper MAPPER = Mappers.getMapper(VisitorGroupMapper.class);

    @Test
    public void testVisitorGroupMapperShouldMapEntityToDto() {
        VisitorGroup entity = new VisitorGroup();
        entity.setId("testId");
        entity.setName("testGroup");
        Set<String> visitors = new HashSet<>();
        visitors.add("testVisitor1");
        visitors.add("testVisitor2");
        visitors.add("testVisitor3");
        entity.setVisitorIds(visitors);
        VisitorGroupDto expectedDto = new VisitorGroupDto();
        expectedDto.setEntityId(entity.getId());
        expectedDto.setName(entity.getName());
        Set<String> visitorIds = new HashSet<>(entity.getVisitorIds());
        expectedDto.setVisitorIds(visitorIds);

        VisitorGroupDto actualDto = MAPPER.entityToDto(entity);

        assertThat(expectedDto, samePropertyValuesAs(actualDto));
    }

    @Test
    public void testVisitorGroupMapperShouldMapDtoToEntity() {
        VisitorGroupDto dto = new VisitorGroupDto();
        dto.setEntityId("testId");
        dto.setName("testGroup");
        Set<String> visitors = new HashSet<>();
        visitors.add("testVisitor1");
        visitors.add("testVisitor2");
        visitors.add("testVisitor3");
        dto.setVisitorIds(visitors);

        VisitorGroup expectedEntity = new VisitorGroup();
        expectedEntity.setId(dto.getEntityId());
        expectedEntity.setName(dto.getName());
        Set<String> visitorId = new HashSet<>(dto.getVisitorIds());
        expectedEntity.setVisitorIds(visitorId);

        VisitorGroup actualEntity = MAPPER.dtoToEntity(dto);

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
