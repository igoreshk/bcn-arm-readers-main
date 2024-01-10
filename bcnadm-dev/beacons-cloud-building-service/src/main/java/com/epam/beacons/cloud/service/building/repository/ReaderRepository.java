package com.epam.beacons.cloud.service.building.repository;

import com.epam.beacons.cloud.service.building.domain.Reader;
import java.util.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Beacon entity repository.
 */
@Repository
public interface ReaderRepository extends MongoRepository<Reader, String> {

    /**
     * Retrieves all beacons of level.
     *
     * @param levelId parent entity
     * @return all associated beacons
     */
    Collection<Reader> findAllByLevelId(String levelId);

    /**
     * Find beacon by uuid.
     *
     * @param uuid uuid
     * @return beacon dto
     */
    Reader findByUuid(String uuid);

    /**
     * Delete all readers by level id.
     */
    void deleteByLevelId(String levelId);
}
