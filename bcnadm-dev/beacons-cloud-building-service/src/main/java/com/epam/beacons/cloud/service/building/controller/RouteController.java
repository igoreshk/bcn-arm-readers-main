package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.service.BuildingService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.util.List;
import javax.validation.constraints.Pattern;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for calculating routes.
 */
@RestController
@Api(value = "Route Controller")
@RequestMapping("/api/v1/route")
public class RouteController {

    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final BuildingService buildingService;

    public RouteController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    /**
     * Calculates the shortest path by building id and 2 given vertex ids.
     *
     * @param buildingId building id
     * @param startVertexId start vertex id
     * @param endVertexId destination vertex id
     * @return list of edges from start Vertex to destination Vertex
     */
    @GetMapping("/{buildingId}/{startVertexId}/{endVertexId}")
    @ApiOperation("Returns list of edges from startVertex to destinationVertex")
    public List<EdgeDto> calculateRoute(
            @PathVariable("buildingId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String buildingId,
            @PathVariable("startVertexId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String startVertexId,
            @PathVariable("endVertexId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String endVertexId
    ) {
        return buildingService.getShortestPath(buildingId, startVertexId, endVertexId);
    }
}
