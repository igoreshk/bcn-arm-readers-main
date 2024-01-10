package com.epam.beacons.cloud.service.building.repository;

import com.epam.beacons.cloud.service.building.domain.Building;
import java.util.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for buildings.
 */
@Repository
public interface BuildingRepository extends MongoRepository<Building, String> {

    /**
     * Returns collection of buildings created by User id.
     *
     * @param createdBy creator id
     * @return collection of buildings
     */
    Collection<Building> findAllByCreatedBy(String createdBy);
}
