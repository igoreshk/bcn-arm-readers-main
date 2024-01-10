package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.ReaderDto;
import com.epam.beacons.cloud.service.building.service.LevelService;
import com.epam.beacons.cloud.service.building.service.ReaderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.Collection;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
 * Reader controller.
 */
@RestController
@Validated
@Api("Reader Controller")
@RequestMapping("/api/v1/readers")
public class ReaderController {

    private static final String READER_WAS_NOT_FOUND = "Reader wasn't found";
    private static final String LEVEL_WAS_NOT_FOUND = "Level wasn't found";
    private static final String READER_WAS_NOT_PROVIDED = "Reader wasn't provided";
    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final LevelService levelService;
    private final ReaderService readerService;

    public ReaderController(ReaderService readerService, LevelService levelService) {
        this.readerService = readerService;
        this.levelService = levelService;
    }

    /**
     * Get reader by id.
     *
     * @param readerId reader id
     * @return reader response
     */
    @GetMapping("/{entityId}")
    @ApiOperation("Returns reader by id")
    @ApiResponses({
            @ApiResponse(code = 404, message = READER_WAS_NOT_FOUND)
    })
    public ReaderDto findOne(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String readerId) {
        return readerService.findOne(readerId);
    }

    /**
     * Get reader by uuid.
     *
     * @param uuid reader uuid
     * @return reader dto
     */
    @GetMapping("/byUuid/{uuid}")
    @ApiOperation("Returns reader by uuid")
    @ApiResponses({
            @ApiResponse(code = 404, message = READER_WAS_NOT_FOUND)
    })
    public ReaderDto findByUuid(@PathVariable("uuid") @NotNull String uuid) {
        return readerService.findByUuid(uuid);
    }

    /**
     * Find all readers.
     *
     * @return collection of readers.
     */
    @GetMapping
    @ApiOperation("Returns all readers")
    public Collection<ReaderDto> findAll() {
        return readerService.findAll();
    }

    /**
     * Delete reader.
     *
     * @param readerId reader id
     * @return responseEntity with deletion result (true if successful)
     */
    @DeleteMapping("/{entityId}")
    @ApiOperation("Deletes reader by id")
    @ApiResponses({
            @ApiResponse(code = 404, message = READER_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> delete(@PathVariable("entityId")
                @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String readerId) {
        final ReaderDto readerDto = readerService.findOne(readerId);
        readerService.delete(readerDto);
        return ResponseEntity.ok(true);
    }

    /**
     * Get readers from level.
     *
     * @param levelId level id
     * @return readers response
     */
    @GetMapping("byLevel/{levelId}")
    @ApiOperation("Returns all readers by level id")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public Collection<ReaderDto> findAllByLevelId(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        final LevelDto levelDto = levelService.findOne(levelId);
        return readerService.findAll(levelDto);
    }

    /**
     * Delete all readers from level.
     *
     * @param levelId reader id.
     * @return ResponseEntity with deletion result (true if successful).
     */
    @DeleteMapping("byLevel/{levelId}")
    @ApiOperation("Deletes all readers from level")
    @ApiResponses({
            @ApiResponse(code = 404, message = LEVEL_WAS_NOT_FOUND)
    })
    public ResponseEntity<Boolean> deleteAllByLevelId(
            @PathVariable("levelId") @Pattern(regexp = "[a-fA-F\\d]{24}")
            @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String levelId
    ) {
        readerService.deleteAll(levelId);
        return ResponseEntity.ok(true);
    }

    /**
     * Save reader.
     *
     * @param reader reader
     * @return responseEntity with collection of saved levels
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiOperation(code = 201, value = "Creates new reader")
    @ApiResponses({
            @ApiResponse(code = 400, message = READER_WAS_NOT_PROVIDED)
    })
    public ReaderDto save(@RequestBody @Valid ReaderDto reader) {
        return readerService.save(reader);
    }

    /**
     * Update reader.
     *
     * @param readerDto reader
     * @return responseEntity with collection of updated levels
     */
    @PutMapping
    @ApiOperation(code = 201, value = "Updates reader")
    @ApiResponses({
            @ApiResponse(code = 400, message = READER_WAS_NOT_PROVIDED)
    })
    public ReaderDto update(@RequestBody @Valid ReaderDto readerDto) {
        return readerService.update(readerDto);
    }
}
