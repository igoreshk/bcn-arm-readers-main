package com.epam.beacons.cloud.service.uaa.repository;

import com.epam.beacons.cloud.service.uaa.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for user entity.
 */
@Repository
public interface UserMongoRepository extends MongoRepository<User, String> {

    /**
     * Returns user with given login.
     *
     * @param login login
     * @return user with given login
     */
    User findByLogin(String login);

    /**
     * Checks if specified email exists in db.
     *
     * @param email user email
     * @return true, if exists, otherwise - false
     */
    boolean existsByEmail(String email);

    /**
     * Checks if specified login exists in db.
     *
     * @param login user login
     * @return true, if exists, otherwise - false
     */
    boolean existsByLogin(String login);
}
