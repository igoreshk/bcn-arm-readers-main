package com.epam.beacons.cloud.monitor.service.repository;

import com.epam.beacons.cloud.monitor.service.domain.Visitor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Visitor Mongo repository.
 */
@Repository
public interface VisitorRepository extends MongoRepository<Visitor, String> {

    /**
     * Find visitor by device type and device id.
     *
     * @param deviceId device Id
     * @return visitor domain object
     */
    Visitor findByDeviceId(String deviceId);
}
