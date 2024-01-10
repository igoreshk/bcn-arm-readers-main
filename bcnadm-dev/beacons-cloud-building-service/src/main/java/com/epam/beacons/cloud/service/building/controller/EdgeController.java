package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.DtoObject;
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
import java.util.Set;
import java.util.stream.Collectors;
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
 * REST controller for edges.
 */
@RestController
@Validated
@Api("Edge Controller")
@RequestMapping("/api/v1/edges")
public class EdgeController {

    private static final String EDGE_WAS_NOT_FOUND = "Edge wasn't found";
    private static final String VERTEX_WAS_NOT_FOUND = "Vertex wasn't found";
    private static final String LEVEL_WAS_NOT_FOUND = "Level wasn't found";
    private static final String EDGE_WAS_NOT_PROVIDED = "Edge wasn't provided";
    private static final String VERTICES_ARE_EQUAL = "Vertices are equal. You are trying to find a POINT.";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final EdgeService edgeService;
    private final VertexService vertexService;
    private final LevelService levelService;

    public EdgeController(EdgeService edgeService, VertexService vertexService, LevelService levelService) {
        this.edgeService = edgeService;
        this.vertexService = vertexService;
        this.levelService = levelService;
    }

    /**
     * Get all edges.
     *
     * @return all edges.
     */
    @GetMapping
    @ApiOperation("Returns all edges")
    public Collection<EdgeDto> findAll() {
        return edgeService.findAll();
    }

    /**
     * Find one edge by its id.
     *
     * @param edgeId id of edge.
     * @return EdgeDto of found edge.
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns edge by edge id")
    @ApiResponses({
            @ApiResponse(code = 404, message = EDGE_WAS_NOT_FOUND)
    })
    public EdgeDto findOne(@PathVariable("entityId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String edgeId) {
        return edgeService.findOne(edgeId);
    }

    /**
     * Save single edge.
     *
     * @param edgeDto edgeDto to save.
     * @return saved Dto.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation("Saves edge dto")
    @ApiResponses({
            @ApiResponse(code = 404, message = EDGE_WAS_NOT_PROVIDED)
    })
    public EdgeDto save(@RequestBody @Valid EdgeDto edgeDto) {
        return edgeService.save(edgeDto);
    }

    /**
     * Updates single edge.
     *
     * @param edgeDto edgeDto to update.
     * @return updated Dto.
     */
    @PutMapping
    @ApiOperation("Updates edge dto")
    @ApiResponses({
            @ApiResponse(code = 404, message = EDGE_WAS_NOT_PROVIDED)
    })
    public EdgeDto update(@RequestBody @Valid EdgeDto edgeDto) {
        return edgeService.update(edgeDto);
    }

    /**
     * Delete edge by its id.
     *
     * @param edgeId edge to delete.
     * @return result of deleting.
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Deletes edge by edge id")
    @ApiResponses({
            @ApiResponse(code = 404, message = EDGE_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> delete(@PathVariable("entityId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String edgeId) {
        final EdgeDto edgeDto = edgeService.findOne(edgeId);
        edgeService.delete(edgeDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Find edges by vertex id (left or right).
     *
     * @param vertexId left or right vertex.
     * @return collection of adjacent edges.
     */
    @GetMapping("/byVertex/{vertexId}")
    @ApiOperation("Returns edges by vertex id (left or right)")
    @ApiResponses({
            @ApiResponse(code = 404, message = VERTEX_WAS_NOT_FOUND)
    })
    public Collection<EdgeDto> findAllByVertex(
            @PathVariable("vertexId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String vertexId
    ) {
        final VertexDto vertexDto = vertexService.findOne(vertexId);
        return edgeService.findAll(vertexDto);
    }

    /**
     * Find all edges on level.
     *
     * @param levelId is level;
     * @return collection of adjacent edges.
     */
    @GetMapping("/byLevel/{levelId}")
    @ApiOperation("Returns edges by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public Collection<EdgeDto> findAllByLevelId(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        final LevelDto levelDto = levelService.findOne(levelId);
        Set<String> setOfEdgeId = vertexService.findAll(levelDto).stream()
                .flatMap(vertexDto -> edgeService.findAll(vertexDto).stream())
                .map(DtoObject::getEntityId)
                .collect(Collectors.toSet());
        return setOfEdgeId.stream().map(edgeService::findOne).collect(Collectors.toList());
    }


    /**
     * Find edge by vertices.
     *
     * @param leftVertexId  id.
     * @param rightVertexId id.
     * @return edgeDto.
     */
    @GetMapping("/byVertices/{leftVertexId}/{rightVertexId}")
    @ApiOperation("Returns edge by left and right vertex ids")
    @ApiResponses({
            @ApiResponse(code = 400, message = VERTICES_ARE_EQUAL),
            @ApiResponse(code = 404, message = VERTEX_WAS_NOT_FOUND)
    })
    public EdgeDto findEdgeByVerticesId(
            @PathVariable("leftVertexId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String leftVertexId,
            @PathVariable("rightVertexId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String rightVertexId
    ) {
        if (leftVertexId.equals(rightVertexId)) {
            throw new IllegalArgumentException(VERTICES_ARE_EQUAL);
        }
        final VertexDto leftVertexDto = vertexService.findOne(leftVertexId);
        final VertexDto rightVertexDto = vertexService.findOne(rightVertexId);
        return edgeService.findByVertices(leftVertexDto, rightVertexDto);
    }
}
