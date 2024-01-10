package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Vertex;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface VertexMapper extends EntityToDtoMapper<VertexDto, Vertex> {

    EntityToDtoMapper<VertexDto, Vertex> INSTANCE = Mappers.getMapper(VertexMapper.class);

    @Override
    @Mapping(source = "id", target = "entityId")
    VertexDto entityToDto(Vertex entity);

    @Override
    @Mapping(source = "entityId", target = "id")
    Vertex dtoToEntity(VertexDto dto);
}
