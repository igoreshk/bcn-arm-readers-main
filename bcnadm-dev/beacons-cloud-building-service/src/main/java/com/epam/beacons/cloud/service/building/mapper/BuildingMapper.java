package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Building;
import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BuildingMapper extends EntityToDtoMapper<BuildingDto, Building> {

    @Override
    @Mapping(source = "id", target = "entityId")
    BuildingDto entityToDto(Building entity);

    @Override
    @Mapping(source = "entityId", target = "id")
    Building dtoToEntity(BuildingDto dto);
}
