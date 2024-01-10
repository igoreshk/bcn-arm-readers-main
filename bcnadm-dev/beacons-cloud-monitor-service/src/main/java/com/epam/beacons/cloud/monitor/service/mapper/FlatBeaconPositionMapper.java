package com.epam.beacons.cloud.monitor.service.mapper;

import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPosition;
import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(builder = @Builder(disableBuilder = true))
public interface FlatBeaconPositionMapper {

    @Mapping(source = "id", target = "entityId")
    FlatBeaconPositionDto entityToDto(FlatBeaconPosition entity);

    @Mapping(source = "entityId", target = "id")
    FlatBeaconPosition dtoToEntity(FlatBeaconPositionDto dto);
}
