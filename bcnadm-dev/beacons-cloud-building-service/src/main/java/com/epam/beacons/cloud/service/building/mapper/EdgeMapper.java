package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Edge;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface EdgeMapper extends EntityToDtoMapper<EdgeDto, Edge> {

    EntityToDtoMapper<EdgeDto, Edge> INSTANCE = Mappers.getMapper(EdgeMapper.class);

    @Override
    @Mapping(source = "id", target = "entityId")
    EdgeDto entityToDto(Edge entity);

    @Override
    @Mapping(source = "entityId", target = "id")
    Edge dtoToEntity(EdgeDto dto);
}
