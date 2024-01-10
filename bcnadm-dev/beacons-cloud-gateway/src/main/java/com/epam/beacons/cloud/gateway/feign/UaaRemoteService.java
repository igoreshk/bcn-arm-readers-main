package com.epam.beacons.cloud.gateway.feign;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for user service.
 */
@FeignClient(value = "uaa-service", path = "/api/v1/users", contextId = "uaa-service")
public interface UaaRemoteService {

    /**
     * Get user by login.
     *
     * @param login login
     * @return user
     */
    @GetMapping(value = "/inactive/{login}", consumes = APPLICATION_JSON_VALUE)
    boolean isInactive(@PathVariable(value = "login") String login);
}
