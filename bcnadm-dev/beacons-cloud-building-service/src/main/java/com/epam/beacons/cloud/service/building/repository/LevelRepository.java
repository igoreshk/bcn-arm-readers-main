package com.epam.beacons.cloud.service.building.repository;

import com.epam.beacons.cloud.service.building.domain.Level;
import java.util.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for levels.
 */
@Repository
public interface LevelRepository extends MongoRepository<Level, String> {

    /**
     * Finds all levels by building id.
     *
     * @param buildingId @code{String} - building id.
     * @return collection of levels.
     */
    Collection<Level> findAllByBuildingId(String buildingId);
}
