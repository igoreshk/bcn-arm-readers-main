package com.epam.beacons.cloud.monitor.service.feign;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.epam.beacons.cloud.monitor.service.domain.Coordinate;
import java.util.Collection;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for Area service.
 */
@FeignClient(value = "building-service", path = "/api/v1/areas", contextId = "areas-service")
public interface AreaRemoteService {

    /**
     * Get coordinates by area id.
     *
     * @param areaId area id.
     * @return list of area coordinates.
     */
    @GetMapping(value = "/{areaId}/coordinates", consumes = APPLICATION_JSON_VALUE)
    Collection<Coordinate> getCoordinates(@PathVariable("areaId") String areaId);
}
