package com.epam.beacons.cloud.monitor.service.mapper;

import com.epam.beacons.cloud.monitor.service.domain.VisitorGroup;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(builder = @Builder(disableBuilder = true))
public interface VisitorGroupMapper {

    @Mapping(source = "id", target = "entityId")
    VisitorGroupDto entityToDto(VisitorGroup entity);

    @Mapping(source = "entityId", target = "id")
    VisitorGroup dtoToEntity(VisitorGroupDto dto);
}
