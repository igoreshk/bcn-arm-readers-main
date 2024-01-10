package com.epam.beacons.cloud.service.building.repository;

import com.epam.beacons.cloud.service.building.domain.Area;
import java.util.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for areas.
 */
@Repository
public interface AreaRepository extends MongoRepository<Area, String> {

    /**
     * Retrieves all areas by level id.
     *
     * @param levelId level id
     * @return collection of areas
     */
    Collection<Area> findAllByLevelId(String levelId);

    /**
     * Delete all areas by level id.
     */
    void deleteByLevelId(String levelId);
}
