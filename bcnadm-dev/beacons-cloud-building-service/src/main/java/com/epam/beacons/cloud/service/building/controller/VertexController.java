package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.service.EdgeService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.epam.beacons.cloud.service.building.service.VertexService;
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
 * REST controller for vertex.
 */
@RestController
@Validated
@Api("Vertex Controller")
@RequestMapping("/api/v1/vertices")
public class VertexController {

    private static final String VERTEX_WAS_NOT_PROVIDED = "VertexDto wasn't provided";
    private static final String INVALID_ENTITY_ID = "EntityId is invalid";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";
    private static final String PROVIDED_COORDINATES_ARE_NOT_A_NUMBER = "Provided coordinates are not a number";

    private final VertexService vertexService;
    private final EdgeService edgeService;
    private final LevelService levelService;

    public VertexController(VertexService vertexService, EdgeService edgeService, LevelService levelService) {
        this.vertexService = vertexService;
        this.edgeService = edgeService;
        this.levelService = levelService;
    }

    /**
     * Find all vertices.
     *
     * @return all vertices.
     */
    @GetMapping
    @ApiOperation("Returns all vertices")
    public Collection<VertexDto> findAll() {
        return vertexService.findAll();
    }

    /**
     * Find single vertex by its id.
     *
     * @param vertexId id of vertex.
     * @return found vertexDto.
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns vertex by vertex id")
    @ApiResponses({
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID)
    })
    public VertexDto findOne(@PathVariable("entityId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String vertexId) {
        return vertexService.findOne(vertexId);
    }

    /**
     * Save single vertex.
     *
     * @param objectDto entity to save
     * @return saved Dto.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation("Saves vertex dto")
    @ApiResponses({
            @ApiResponse(code = 404, message = VERTEX_WAS_NOT_PROVIDED)
    })
    public VertexDto save(@RequestBody @Valid VertexDto objectDto) {
        return vertexService.save(objectDto);
    }

    /**
     * Update single vertex.
     *
     * @param objectDto entity to update
     * @return updated Dto.
     */
    @PutMapping
    @ApiOperation("Updates vertex dto")
    @ApiResponses({
            @ApiResponse(code = 404, message = VERTEX_WAS_NOT_PROVIDED)
    })
    public VertexDto update(@RequestBody @Valid VertexDto objectDto) {
        return vertexService.update(objectDto);
    }

    /**
     * Delete vertex by its id.
     *
     * @param vertexId vertex to delete.
     * @return result of deleting.
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Deletes vertex by vertex id")
    @ApiResponses({
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID)
    })
    public ResponseEntity<Boolean> delete(@PathVariable("entityId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String vertexId) {
        final VertexDto vertexDto = vertexService.findOne(vertexId);
        vertexService.delete(vertexDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Returns collection of start and end vertex of edge. If start vertex == end vertex it returns collection with one
     * element.
     *
     * @param edgeId edge that has vertices.
     * @return collection of start and end vertex.
     */
    @GetMapping("/byEdge/{edgeId}")
    @ApiOperation("Returns vertexes by edge id")
    @ApiResponses({
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID)
    })
    public Collection<VertexDto> findAllByEdge(
            @PathVariable("edgeId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String edgeId
    ) {
        final EdgeDto edgeDto = edgeService.findOne(edgeId);
        return vertexService.findAllByEdge(edgeDto);
    }

    /**
     * Finds all vertices on the given level.
     *
     * @param levelId level to search vertices on.
     * @return collection of vertices on the level.
     */
    @GetMapping("/byLevel/{levelId}")
    @ApiOperation("Returns vertexes by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID)
    })
    public Collection<VertexDto> findAllByLevelId(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        final LevelDto levelDto = levelService.findOne(levelId);
        return vertexService.findAll(levelDto);
    }

    /**
     * Deletes all vertices from given level.
     *
     * @param levelId level to clear.
     * @return result of clearing.
     */
    @DeleteMapping("/byLevel/{levelId}")
    @ApiOperation("Deletes vertexes from given level")
    @ApiResponses({
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID)
    })
    public ResponseEntity<Boolean> deleteAllByLevelId(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        vertexService.deleteAll(levelId);
        return ResponseEntity.ok(true);
    }

    /**
     * Returns collection of vertexDto found inside provided area.
     *
     * @param areaId provided area id
     * @return collection of vertexDto
     */
    @GetMapping("/byArea/{areaId}")
    @ApiOperation("Returns collection of vertices inside area")
    @ApiResponses(
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID)
    )
    public Collection<VertexDto> findAllInsideArea(
            @PathVariable("areaId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String areaId
    ) {
        return vertexService.findAllInsideArea(areaId);
    }

    /**
     * Returns nearest VertexDto to specified location on specified level.
     *
     * @param latitude specified location latitude
     * @param longitude specified location longitude
     * @param levelId specified level id
     * @return nearest vertexDto
     */
    @GetMapping("/nearestVertex/{latitude}/{longitude}/{levelId}")
    @ApiOperation("Returns nearest VertexDto to specified location on specified level")
    @ApiResponses({
            @ApiResponse(code = 404, message = INVALID_ENTITY_ID),
            @ApiResponse(code = 400, message = PROVIDED_COORDINATES_ARE_NOT_A_NUMBER)
    })
    public VertexDto findNearestVertex(
            @PathVariable("latitude") @ApiParam(value = "Specified latitude", required = true) double latitude,
            @PathVariable("longitude") @ApiParam(value = "Specified longitude", required = true) double longitude,
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        return vertexService.findNearestVertex(latitude, longitude, levelId);
    }
}
