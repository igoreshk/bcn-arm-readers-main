package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Level;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface LevelMapper extends EntityToDtoMapper<LevelDto, Level> {

    EntityToDtoMapper<LevelDto, Level> INSTANCE = Mappers.getMapper(LevelMapper.class);

    @Override
    @Mapping(source = "id", target = "entityId")
    LevelDto entityToDto(Level entity);

    @Override
    @Mapping(source = "entityId", target = "id")
    Level dtoToEntity(LevelDto dto);
}
