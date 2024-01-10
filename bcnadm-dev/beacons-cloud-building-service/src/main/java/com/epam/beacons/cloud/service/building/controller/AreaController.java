package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.AreaDto;
import com.epam.beacons.cloud.service.building.domain.AreaSearchDto;
import com.epam.beacons.cloud.service.building.domain.Coordinate;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.service.AreaService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.Collection;
import javax.validation.Valid;
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
 * Area controller.
 */
@RestController
@Validated
@Api("Area Controller")
@RequestMapping("/api/v1/areas")
public class AreaController {

    private static final String LEVEL_WAS_NOT_FOUND = "Level wasn't found";
    private static final String AREA_WAS_NOT_FOUND = "Area wasn't found";
    private static final String AREA_WAS_NOT_PROVIDED = "Area wasn't provided";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final AreaService areaService;
    private final LevelService levelService;

    public AreaController(AreaService areaService, LevelService levelService) {
        this.areaService = areaService;
        this.levelService = levelService;
    }

    /**
     * Get all areas.
     *
     * @return all areas
     */
    @GetMapping
    @ApiOperation("Returns all areas")
    public Collection<AreaDto> findAll() {
        return areaService.findAll();
    }

    /**
     * Get all areas by level id.
     *
     * @param levelId level id.
     * @return areas on this level
     */
    @GetMapping("/byLevelId/{levelId}")
    @ApiOperation("Returns all areas by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public Collection<AreaDto> findByLevel(@PathVariable("levelId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId) {
        final LevelDto levelDto = levelService.findOne(levelId);
        return areaService.findByLevel(levelDto);
    }

    /**
     * Delete all areas from level.
     *
     * @param levelId level id.
     * @return responseEntity with deletion result (true if successful)
     */
    @DeleteMapping("/byLevelId/{levelId}")
    @ApiOperation("Deletes all areas from level")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> deleteAllByLevel(@PathVariable("levelId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId) {
        areaService.deleteAll(levelId);
        return ResponseEntity.ok(true);
    }

    /**
     * Get area by id.
     *
     * @param areaId area id
     * @return area
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns area by id")
    @ApiResponses({
            @ApiResponse(code = 404, message = AREA_WAS_NOT_FOUND)
    })
    public AreaDto findOne(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String areaId) {
        return areaService.findOne(areaId);
    }

    /**
     * Save area.
     *
     * @param area area
     * @return responseEntity with collection of saved areas
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation(code = 201, value = "Creates new area")
    @ApiResponses({
            @ApiResponse(code = 400, message = AREA_WAS_NOT_PROVIDED)
    })
    public AreaDto save(@RequestBody @Valid AreaDto area) {
        return areaService.save(area);
    }

    /**
     * Update area.
     *
     * @param area area
     * @return responseEntity with collection of updated areas
     */
    @PutMapping
    @ApiOperation(code = 201, value = "Updates area")
    @ApiResponses({
            @ApiResponse(code = 400, message = AREA_WAS_NOT_PROVIDED)
    })
    public AreaDto update(@RequestBody @Valid AreaDto area) {
        return areaService.update(area);
    }

    /**
     * Delete area.
     *
     * @param areaId area
     * @return responseEntity with deletion result (true if successful)
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Deletes area by id")
    @ApiResponses({
            @ApiResponse(code = 404, message = AREA_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> delete(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String areaId) {
        final AreaDto areaDto = areaService.findOne(areaId);
        areaService.delete(areaDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Get all areas by name and description on specified level.
     *
     * @param areaSearchDto dto for specified search
     * @param levelId specified level id
     * @return collection of AreaDto
     */
    @PostMapping("/search/level/{levelId}")
    @ApiOperation("Find areas by name and description on specified level")
    public Collection<AreaDto> specifiedSearchOnLevel(
            @RequestBody AreaSearchDto areaSearchDto,
            @PathVariable("levelId")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        return areaService.specifiedSearchOnLevel(areaSearchDto, levelId);
    }

    /**
     * Get all areas by name and description in specified building.
     *
     * @param areaSearchDto dto for specified search
     * @param buildingId specified building id
     * @return collection of AreaDto
     */
    @PostMapping("/search/building/{buildingId}")
    @ApiOperation("Find areas by name and description in specified building")
    public Collection<AreaDto> specifiedSearchInBuilding(
            @RequestBody AreaSearchDto areaSearchDto,
            @PathVariable("buildingId")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String buildingId
    ) {
        return areaService.specifiedSearchInBuilding(areaSearchDto, buildingId);
    }

    /**
     * Get coordinates by area id.
     *
     * @param areaId area id
     * @return list of area coordinates
     */
    @GetMapping("/{entityId}/coordinates")
    @ApiOperation("Returns coordinates by area id")
    @ApiResponses({
            @ApiResponse(code = 404, message = AREA_WAS_NOT_FOUND)
    })
    public Collection<Coordinate> getCoordinates(@PathVariable("entityId")
                           @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String areaId) {
        return areaService.findOne(areaId).getCoordinates();
    }
}
