package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Beacon;
import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BeaconMapper extends EntityToDtoMapper<BeaconDto, Beacon> {

    EntityToDtoMapper<BeaconDto, Beacon> INSTANCE = Mappers.getMapper(BeaconMapper.class);

    @Mapping(source = "id", target = "entityId")
    BeaconDto entityToDto(Beacon entity);

    @Mapping(source = "entityId", target = "id")
    Beacon dtoToEntity(BeaconDto dto);
}
