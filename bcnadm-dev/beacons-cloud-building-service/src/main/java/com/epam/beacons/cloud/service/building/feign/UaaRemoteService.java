package com.epam.beacons.cloud.service.building.feign;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Feign client for user service.
 */
@FeignClient(value = "uaa-service", path = "/api/v1/users", contextId = "uaa-service")
public interface UaaRemoteService {

    /**
     * Get current session user.
     *
     * @return user DTO.
     */
    @GetMapping(value = "/currentId", consumes = APPLICATION_JSON_VALUE)
    String getCurrentUserId();
}
