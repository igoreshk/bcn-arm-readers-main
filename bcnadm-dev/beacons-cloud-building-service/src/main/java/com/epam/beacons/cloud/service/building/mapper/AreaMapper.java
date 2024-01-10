package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Area;
import com.epam.beacons.cloud.service.building.domain.AreaDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AreaMapper extends EntityToDtoMapper<AreaDto, Area> {

    EntityToDtoMapper<AreaDto, Area> INSTANCE = Mappers.getMapper(AreaMapper.class);

    @Mapping(source = "id", target = "entityId")
    AreaDto entityToDto(Area entity);

    @Mapping(source = "entityId", target = "id")
    Area dtoToEntity(AreaDto dto);
}
