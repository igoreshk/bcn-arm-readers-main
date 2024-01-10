package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.Level;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.service.LevelService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST controller for levels.
 */
@RestController
@Validated
@Api(value = "Level Controller")
@RequestMapping("/api/v1/levels")
public class LevelController {

    private static final String LEVEL_WAS_NOT_FOUND = "Level wasn't found";
    private static final String IMAGE_WAS_NOT_FOUND = "Image wasn't found";
    private static final String LEVEL_WAS_NOT_PROVIDED = "Level wasn't provided";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final LevelService levelService;

    public LevelController(LevelService levelService) {
        this.levelService = levelService;
    }

    /**
     * Find all levels.
     *
     * @return collection of levels.
     */
    @GetMapping
    @ApiOperation("Returns all levels")
    public Collection<LevelDto> findAll() {
        return levelService.findAll();
    }

    /**
     * Delete level from building.
     *
     * @param levelId level id
     * @return responseEntity with deletion result (true if successful)
     */
    @DeleteMapping("/{levelId}")
    @ApiOperation("Deletes level by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> delete(@PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId) {
        final LevelDto level = levelService.findOne(levelId);
        levelService.delete(level);
        return ResponseEntity.ok(true);
    }

    /**
     * Find level image.
     *
     * @param id level id
     * @return response entity
     */
    @GetMapping("/{levelId}/image")
    @ApiOperation("Returns image by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = IMAGE_WAS_NOT_FOUND)
    })
    public ResponseEntity<byte[]> getImage(@PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id) {
        Level level = levelService.getLevel(id);
        byte[] imageAsByteArray = level.getImageAsByteArray();
        String mimeType = level.getMimeType();
        return ResponseEntity.status(HttpStatus.OK).contentLength(imageAsByteArray.length)
                .contentType(MediaType.parseMediaType(mimeType)).body(imageAsByteArray);
    }

    /**
     * Upload level image.
     *
     * @param id level id
     * @param image image for level
     * @return response entity
     */
    @PostMapping("/{levelId}/image")
    @ApiOperation("Uploads image by level id")
    public ResponseEntity<Void> uploadImage(@PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id,
            @RequestParam(value = "image") MultipartFile image) throws IOException {
        byte[] imageAsByteArray = image.getBytes();
        levelService.saveImage(id, imageAsByteArray);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(location).build();
    }

    /**
     * Find one level by its id.
     *
     * @param entityId entity id
     * @return level.
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns level by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public LevelDto findOne(@PathVariable("entityId") @Pattern(regexp = "[a-fA-F\\d]{24}")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String entityId) {
        return levelService.findOne(entityId);
    }

    /**
     * Save level.
     *
     * @param level level
     * @return responseEntity with saved level
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation(value = "Creates new level", code = 201)
    @ApiResponses({
            @ApiResponse(code = 400, message = LEVEL_WAS_NOT_PROVIDED)
    })
    public LevelDto save(@RequestBody @Valid LevelDto level) {
        return levelService.save(level);
    }

    /**
     * Update level.
     *
     * @param levelDto level
     * @return responseEntity with updated level
     */
    @PutMapping
    @ApiOperation(value = "Updates level", code = 201)
    @ApiResponses({
            @ApiResponse(code = 400, message = LEVEL_WAS_NOT_PROVIDED)
    })
    public LevelDto update(@RequestBody @Valid LevelDto levelDto) {
        return levelService.update(levelDto);
    }
}
