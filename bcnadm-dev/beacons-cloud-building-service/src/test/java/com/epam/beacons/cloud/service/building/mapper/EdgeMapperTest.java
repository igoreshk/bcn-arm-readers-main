package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Edge;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.mapper.EdgeMapper;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class EdgeMapperTest {

    private final EdgeMapper mapper = Mappers.getMapper(EdgeMapper.class);

    @Test
    public void testEdgeMapperShouldMapEntityToDto() {
        Edge edge = new Edge();
        edge.setId("testId");
        edge.setStartVertexId("testStartVertex");
        edge.setEndVertexId("testEndVertex");

        EdgeDto expectedEdgeDto = new EdgeDto();
        expectedEdgeDto.setEntityId(edge.getId());
        expectedEdgeDto.setStartVertexId(edge.getStartVertexId());
        expectedEdgeDto.setEndVertexId(edge.getEndVertexId());

        assertThat(expectedEdgeDto, samePropertyValuesAs(mapper.entityToDto(edge)));
    }

    @Test
    public void testEdgeMapperShouldMapDtoToEntity() {
        EdgeDto edgeDto = new EdgeDto();
        edgeDto.setEntityId("testEntityId");
        edgeDto.setStartVertexId("testStartVertex");
        edgeDto.setEndVertexId("testEndVertex");

        Edge expectedEdge = new Edge();
        expectedEdge.setId(edgeDto.getEntityId());
        expectedEdge.setStartVertexId(edgeDto.getStartVertexId());
        expectedEdge.setEndVertexId(edgeDto.getEndVertexId());

        Edge actualEdge = mapper.dtoToEntity(edgeDto);

        assertThat(expectedEdge, samePropertyValuesAs(actualEdge));
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
