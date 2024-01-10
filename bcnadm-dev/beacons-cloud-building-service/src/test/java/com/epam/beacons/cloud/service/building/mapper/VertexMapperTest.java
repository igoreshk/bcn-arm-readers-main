package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Vertex;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.domain.VertexType;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class VertexMapperTest {

    private final VertexMapper mapper = Mappers.getMapper(VertexMapper.class);

    @Test
    public void testVertexMapperShouldMapEntityToDto() {
        Vertex entity = new Vertex();
        entity.setId("testId");
        entity.setLatitude(1.0);
        entity.setLongitude(1.0);
        entity.setLevelId("testLevelId");
        entity.setType(VertexType.ENTRY_EXIT);

        VertexDto expectedDto = new VertexDto();
        expectedDto.setEntityId(entity.getId());
        expectedDto.setLatitude(entity.getLatitude());
        expectedDto.setLongitude(entity.getLongitude());
        expectedDto.setLevelId(entity.getLevelId());
        expectedDto.setType(VertexType.ENTRY_EXIT);

        assertThat(expectedDto, samePropertyValuesAs(mapper.entityToDto(entity)));
    }

    @Test
    public void testVertexMapperShouldMapDtoToEntity() {
        VertexDto dto = new VertexDto();
        dto.setEntityId("testId");
        dto.setLatitude(1.0);
        dto.setLongitude(1.0);
        dto.setLevelId("testLevelId");
        dto.setType(VertexType.ENTRY_EXIT);

        Vertex expectedEntity = new Vertex();
        expectedEntity.setId(dto.getEntityId());
        expectedEntity.setLatitude(dto.getLatitude());
        expectedEntity.setLongitude(dto.getLongitude());
        expectedEntity.setLevelId(dto.getLevelId());
        expectedEntity.setType(VertexType.ENTRY_EXIT);

        Vertex actualEntity = mapper.dtoToEntity(dto);

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
