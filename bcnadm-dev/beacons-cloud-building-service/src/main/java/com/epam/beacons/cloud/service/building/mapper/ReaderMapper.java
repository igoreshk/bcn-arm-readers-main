package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.Reader;
import com.epam.beacons.cloud.service.building.domain.ReaderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReaderMapper extends EntityToDtoMapper<ReaderDto, Reader> {

    EntityToDtoMapper<ReaderDto, Reader> INSTANCE = Mappers.getMapper(ReaderMapper.class);

    @Mapping(source = "id", target = "entityId")
    ReaderDto entityToDto(Reader entity);

    @Mapping(source = "entityId", target = "id")
    Reader dtoToEntity(ReaderDto dto);
}
