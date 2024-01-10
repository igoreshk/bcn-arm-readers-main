package com.epam.beacons.cloud.monitor.service.controller;

import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.service.VisitorHistoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for history of visits.
 */
@RestController
@Validated
@RequestMapping("/api/v1/monitor/history")
@Api(value = "Flat Beacon Position Controller")
public class VisitorHistoryController {

    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final VisitorHistoryService visitorHistoryService;
    private static final String ISO_8601 = "yyyy-MM-dd HH:mm:ss";

    public VisitorHistoryController(VisitorHistoryService visitorHistoryService) {
        this.visitorHistoryService = visitorHistoryService;
    }

    /**
     * Find history of visits by visitorId.
     *
     * @param id visitor id
     * @param startTime time of first visit entry
     * @param endTime time of last visit entry
     * @return list of FlatBeaconPositionDto
     */
    @ApiOperation(value = "Find history of visits by visitorId.")
    @GetMapping("visitors/{visitorId}")
    public List<FlatBeaconPositionDto> getVisitorsHistory(
            @PathVariable("visitorId") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id,
            @RequestParam(value = "start", required = false) @DateTimeFormat(pattern = ISO_8601) LocalDateTime startTime,
            @RequestParam(value = "end", required = false) @DateTimeFormat(pattern = ISO_8601) LocalDateTime endTime
    ) {
        return visitorHistoryService.getVisitorHistory(id, startTime, endTime);
    }

    /**
     * Find sorted history of visits by visitorId.
     *
     * @param id visitor id
     * @param startTime time of first visit entry
     * @param endTime time of last visit entry
     * @return list of FlatBeaconPositionDto
     */
    @ApiOperation(value = "Find sorted history of visits by visitorId.")
    @GetMapping("sorted/visitors/{visitorId}")
    public List<FlatBeaconPositionDto> getSortedVisitorsHistory(
            @PathVariable("visitorId") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id,
            @RequestParam(value = "start", required = false) @DateTimeFormat(pattern = ISO_8601) LocalDateTime startTime,
            @RequestParam(value = "end", required = false) @DateTimeFormat(pattern = ISO_8601) LocalDateTime endTime
    ) {
        return visitorHistoryService.getSortedVisitorHistory(id, startTime, endTime);
    }

    /**
     * Returns collection of updates for specified visitorGroup.
     *
     * @param visitorGroupId visitorGroup entityId
     * @param levelId current level entityId
     * @return collection of VisitorGroupUpdateWithoutLocation
     */
    @GetMapping("/{visitorGroupId}/levels/{levelId}")
    @ApiOperation("Returns collection of updates for specified visitor group.")
    public Collection<FlatBeaconPositionDto> getVisitorGroupHistory(
            @PathVariable("levelId") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId,
            @PathVariable("visitorGroupId")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String visitorGroupId
    ) {
        return visitorHistoryService.getVisitorGroupHistory(visitorGroupId, levelId);
    }

    /**
     * Find history of visits by area.
     *
     * @param areaId area id
     * @param startTime time of first visit entry
     * @param endTime time of last visit entry
     * @return set of VisitorDto
     */
    @ApiOperation(value = "Find history of visitors by area.")
    @GetMapping("visitors/areas/{areaId}")
    public Collection<VisitorDto> getVisitorsByArea(
            @PathVariable("areaId") String areaId,
            @RequestParam(value = "start", required = false) @DateTimeFormat(pattern = ISO_8601) LocalDateTime startTime,
            @RequestParam(value = "end", required = false) @DateTimeFormat(pattern = ISO_8601) LocalDateTime endTime
    ) {
        return visitorHistoryService.getVisitorsByArea(areaId, startTime, endTime);
    }
}
