package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.service.BeaconService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.Collection;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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
 * Beacon controller.
 */
@RestController
@Validated
@Api(value = "Beacon Controller")
@RequestMapping("/api/v1/beacons")
public class BeaconController {

    private static final String BEACON_WAS_NOT_FOUND = "Beacon wasn't found";
    private static final String LEVEL_WAS_NOT_FOUND = "Level wasn't found";
    private static final String BEACON_WAS_NOT_PROVIDED = "Beacon wasn't provided";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final BeaconService beaconService;
    private final LevelService levelService;

    public BeaconController(BeaconService beaconService, LevelService levelService) {
        this.beaconService = beaconService;
        this.levelService = levelService;
    }

    /**
     * Get beacon by id.
     *
     * @param beaconId beacon id
     * @return beacons response
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns beacon by beacon id")
    @ApiResponses({
            @ApiResponse(code = 404, message = BEACON_WAS_NOT_FOUND)
    })
    public BeaconDto findOne(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String beaconId) {
        return beaconService.findOne(beaconId);
    }

    /**
     * Find all beacons.
     *
     * @return collection of beacons.
     */
    @GetMapping
    @ApiOperation("Returns all beacons")
    public Collection<BeaconDto> findAll() {
        return beaconService.findAll();
    }

    /**
     * Find all beacons from level.
     *
     * @param levelId level id
     * @return collection of beacons in a specified level.
     */
    @GetMapping("/byLevel/{levelId}")
    @ApiOperation("Returns all beacons by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public Collection<BeaconDto> findAllByLevel(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        final LevelDto levelDto = levelService.findOne(levelId);
        return beaconService.findAll(levelDto);
    }

    /**
     * Delete beacon.
     *
     * @param beaconId beacon id
     * @return responseEntity with deletion result (true if successful)
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Deletes beacon by beacon id")
    @ApiResponses({
            @ApiResponse(code = 400, message = BEACON_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> delete(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String beaconId) {
        final BeaconDto beaconDto = beaconService.findOne(beaconId);
        beaconService.delete(beaconDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Delete all beacons from level.
     *
     * @param levelId level id
     * @return responseEntity with deletion result (true if successful)
     */
    @DeleteMapping("/byLevel/{levelId}")
    @ApiOperation("Deletes all beacons by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> deleteAllByLevel(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        beaconService.deleteAll(levelId);
        return ResponseEntity.ok(true);
    }

    /**
     * Save beacon.
     *
     * @param beacon beacon
     * @return responseEntity
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation(value = "Creates new beacon", code = 201)
    @ApiResponses({
            @ApiResponse(code = 400, message = BEACON_WAS_NOT_PROVIDED)
    })
    public BeaconDto save(@RequestBody @Valid BeaconDto beacon) {
        return beaconService.save(beacon);
    }

    /**
     * Update beacon.
     *
     * @param beaconDto beacon
     * @return responseEntity
     */
    @PutMapping
    @ApiOperation(value = "Updates beacon", code = 201)
    @ApiResponses({
            @ApiResponse(code = 400, message = BEACON_WAS_NOT_PROVIDED)
    })
    public BeaconDto update(@RequestBody @Valid BeaconDto beaconDto) {
        return beaconService.update(beaconDto);
    }
}
