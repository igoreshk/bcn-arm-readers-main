package com.epam.beacons.cloud.service.building.mapper;

import com.epam.beacons.cloud.service.building.domain.DomainObject;
import com.epam.beacons.cloud.service.building.domain.DtoObject;

/**
 * General interface for mapping DTO to database entity and back.
 *
 * @param <D> dto instance
 * @param <E> entity instance
 */
public interface EntityToDtoMapper<D extends DtoObject, E extends DomainObject> {

    /**
     * Converts entity to dto object.
     *
     * @param entity - source instance
     * @return dto target instance
     */
    D entityToDto(E entity);

    /**
     * Converts dto to entity object.
     *
     * @param dto source instance
     * @return entity target instance
     */
    E dtoToEntity(D dto);
}
