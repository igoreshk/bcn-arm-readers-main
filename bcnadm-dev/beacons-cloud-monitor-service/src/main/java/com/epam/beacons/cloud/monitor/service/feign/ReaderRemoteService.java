package com.epam.beacons.cloud.monitor.service.feign;

import com.epam.beacons.cloud.monitor.service.domain.ReaderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Reader feign client.
 */
@FeignClient(value = "building-service", path = "/api/v1/readers", contextId = "readers-service")
public interface ReaderRemoteService {

    /**
     * Finds a reader by uuid.
     *
     * @param uuid reader uuid
     * @return reader dto.
     */
    @GetMapping(value = "/byUuid/{uuid}", consumes = "application/json")
    ReaderDto findByUuid(@PathVariable("uuid") String uuid);
}
