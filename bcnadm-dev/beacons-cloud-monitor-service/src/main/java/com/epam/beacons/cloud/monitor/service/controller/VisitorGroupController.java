package com.epam.beacons.cloud.monitor.service.controller;

import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.service.VisitorGroupService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.Collection;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for visitorGroups.
 */
@RestController
@Validated
@RequestMapping("/api/v1/visitor-groups")
@Api(value = "Visitor Group Controller")
public class VisitorGroupController {

    private static final String VISITOR_GROUP_NOT_FOUND = "Visitor group wasn't found";
    private static final String VISITOR_GROUP_WAS_NOT_PROVIDED = "Visitor group wasn't provided";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final VisitorGroupService visitorGroupService;

    public VisitorGroupController(VisitorGroupService visitorGroupService) {
        this.visitorGroupService = visitorGroupService;
    }

    /**
     * Find all visitorGroups.
     *
     * @return collection of visitorGroupsDto
     */
    @GetMapping
    @ApiOperation("Find all visitor groups")
    public Collection<VisitorGroupDto> getAllVisitorGroups() {
        return visitorGroupService.findAll();
    }

    /**
     * Returns visitorGroups with this entityID.
     *
     * @param entityId - visitorGroup entityId
     * @return visitorGroupDto
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns visitorGroup by visitor group id")
    @ApiResponses({
            @ApiResponse(code = 404, message = VISITOR_GROUP_NOT_FOUND)
    })
    public VisitorGroupDto getVisitorGroup(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        return visitorGroupService.findOne(entityId);
    }

    /**
     * Deletes visitorGroup.
     *
     * @param entityId - visitorGroup entityId
     * @return true if visitorGroup was deleted, false otherwise
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Delete visitor group by visitor group id")
    public ResponseEntity delete(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        VisitorGroupDto visitorGroupDto = visitorGroupService.findOne(entityId);
        visitorGroupService.delete(visitorGroupDto);
        return ResponseEntity.ok().build();
    }

    /**
     * Saves the visitorGroup with a list of visitors IDs.
     *
     * @param visitorGroupDto - current visitorGroup name and array of visitors IDs related to it
     * @return - visitorGroupDTO with generated ID
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation(value = "Create new visitor group", code = 201)
    @ApiResponses({
            @ApiResponse(code = 400, message = VISITOR_GROUP_WAS_NOT_PROVIDED)
    })
    public VisitorGroupDto saveVisitorGroup(@RequestBody VisitorGroupDto visitorGroupDto) {
        return visitorGroupService.save(visitorGroupDto);
    }
}
