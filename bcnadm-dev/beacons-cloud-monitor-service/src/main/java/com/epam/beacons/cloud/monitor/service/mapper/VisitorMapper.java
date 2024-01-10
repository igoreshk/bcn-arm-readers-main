package com.epam.beacons.cloud.monitor.service.mapper;

import com.epam.beacons.cloud.monitor.service.domain.Visitor;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface VisitorMapper {

    @Mapping(source = "id", target = "entityId")
    VisitorDto entityToDto(Visitor entity);

    @Mapping(source = "entityId", target = "id")
    Visitor dtoToEntity(VisitorDto dto);
}
