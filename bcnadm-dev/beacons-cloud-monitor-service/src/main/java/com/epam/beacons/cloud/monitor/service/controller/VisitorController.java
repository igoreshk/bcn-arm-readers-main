package com.epam.beacons.cloud.monitor.service.controller;

import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.service.VisitorGroupService;
import com.epam.beacons.cloud.monitor.service.service.VisitorService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.Collection;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Visitors rest controller.
 */
@RestController
@RequestMapping("/api/v1/visitors")
@Api(value = "Visitor Controller")
public class VisitorController {

    private static final String VISITOR_NOT_FOUND = "Visitor wasn't found";
    private static final String VISITOR_WAS_NOT_PROVIDED = "Visitor wasn't provided";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final VisitorService visitorService;
    private final VisitorGroupService visitorGroupService;

    public VisitorController(VisitorService visitorService, VisitorGroupService visitorGroupService) {
        this.visitorService = visitorService;
        this.visitorGroupService = visitorGroupService;
    }

    @GetMapping
    @ApiOperation("Returns all visitors")
    public Collection<VisitorDto> findAll() {
        return visitorService.findAll();
    }

    @GetMapping("/{entityId}")
    @ApiOperation("Returns visitor by visitor id")
    @ApiResponses({
            @ApiResponse(code = 404, message = VISITOR_NOT_FOUND)
    })
    public VisitorDto findOne(@PathVariable("entityId") @NotNull
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        return visitorService.findOne(entityId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation(value = "Create new visitor", code = 201)
    @ApiResponses({
            @ApiResponse(code = 400, message = VISITOR_WAS_NOT_PROVIDED)
    })
    public VisitorDto save(@RequestBody @Valid @NotNull VisitorDto visitorDto) {
        return visitorService.save(visitorDto);
    }

    @PutMapping
    @ApiOperation("Update visitor")
    @ApiResponses({
            @ApiResponse(code = 400, message = VISITOR_WAS_NOT_PROVIDED)
    })
    public VisitorDto update(@RequestBody @Valid @NotNull VisitorDto visitorDto) {
        return visitorService.update(visitorDto);
    }

    @DeleteMapping("/{entityId}")
    @ApiOperation("Delete visitor by visitor id")
    public ResponseEntity<Boolean> delete(@PathVariable("entityId") @NotNull
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        VisitorDto visitorDto = visitorService.findOne(entityId);
        visitorGroupService.removeVisitorFromGroup(entityId);
        visitorService.delete(visitorDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Returns visitor by device type and id.
     *
     * @param deviceId visitor flat beacon device Id
     * @return visitor dto
     */
    @GetMapping("/{type}/{deviceId}")
    @ApiOperation("Return visitor by device type and Id")
    @ApiResponses({
            @ApiResponse(code = 404, message = VISITOR_NOT_FOUND)
    })
    public VisitorDto findByDeviceId(@PathVariable("deviceId") @NotNull @ApiParam(value = "should match regex [a-zA-Z0-9\\s]{0,200}$", required = true)
                                                 String deviceId) {
        return visitorService.findByDeviceId(deviceId);
    }
}
