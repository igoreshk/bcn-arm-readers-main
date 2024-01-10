package com.epam.beacons.cloud.service.building.repository;

import com.epam.beacons.cloud.service.building.domain.Beacon;
import java.util.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Beacon entity repository.
 */
@Repository
public interface BeaconRepository extends MongoRepository<Beacon, String> {

    /**
     * Retrieves all beacons of level.
     *
     * @param levelId parent entity
     * @return all associated beacons
     */
    Collection<Beacon> findAllByLevelId(String levelId);

    /**
     * Delete all beacons by level id.
     */
    void deleteByLevelId(String levelId);
}
