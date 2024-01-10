package com.epam.beacons.cloud.monitor.service.repository;

import com.epam.beacons.cloud.monitor.service.domain.VisitorGroup;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for VisitorGroup entity.
 */
@Repository
public interface VisitorGroupRepository extends MongoRepository<VisitorGroup, String> {

}
