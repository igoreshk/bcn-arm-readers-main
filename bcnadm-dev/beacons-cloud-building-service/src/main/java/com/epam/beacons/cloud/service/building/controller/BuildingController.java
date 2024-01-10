package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.Building;
import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import com.epam.beacons.cloud.service.building.service.BuildingService;
import com.epam.beacons.cloud.service.building.service.LevelService;
import io.swagger.annotations.ApiParam;
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
 * REST controller for buildings.
 */
@RestController
@Validated
@RequestMapping("/api/v1/buildings")
public class BuildingController {

    private static final String PARAMETER_SHOULD_MATCH_REGEX = "should match regex [a-fA-F\\d]{24}";

    private final BuildingService buildingService;
    private final UaaRemoteService uaaRemoteService;
    private final LevelService levelService;

    public BuildingController(
            BuildingService buildingService, UaaRemoteService uaaRemoteService, LevelService levelService
    ) {
        this.buildingService = buildingService;
        this.uaaRemoteService = uaaRemoteService;
        this.levelService = levelService;
    }

    /**
     * Find all buildings.
     *
     * @return response entity
     */
    @GetMapping
    public Collection<BuildingDto> findAll() {
        return buildingService.findAll();
    }

    /**
     * Find all buildings by user.
     *
     * @param userId User who buildings are available for
     * @return Collection of buildings
     */
    @GetMapping("/by-user/{user-id}")
    public Collection<BuildingDto> findAll(
            @PathVariable("user-id") @Pattern(regexp = "[a-fA-F\\d]{24}") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String userId
    ) {
        return buildingService.findAll(userId);
    }

    /**
     * Find building by id.
     *
     * @param id building id
     * @return response entity
     */
    @GetMapping("/{entityId}")
    public BuildingDto findOne(
            @PathVariable("entityId") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id
    ) {
        return buildingService.findOne(id);
    }

    /**
     * Find building image.
     *
     * @param id building id
     * @return response entity
     */
    @GetMapping("/{buildingId}/image")
    public ResponseEntity<byte[]> getImage(
            @PathVariable("buildingId") @Pattern(regexp = "[a-fA-F\\d]{24}") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id
    ) {
        Building building = buildingService.getBuilding(id);
        byte[] imageAsByteArray = building.getImageAsByteArray();
        String mimeType = building.getMimeType();
        return ResponseEntity.status(HttpStatus.OK).contentLength(imageAsByteArray.length)
                .contentType(MediaType.parseMediaType(mimeType)).body(imageAsByteArray);
    }

    /**
     * Upload building image.
     *
     * @param id building id
     * @param image image for building
     * @return response entity
     */
    @PostMapping("/{buildingId}/image")
    public ResponseEntity<Void> uploadImage(
            @PathVariable("buildingId") @Pattern(regexp = "[a-fA-F\\d]{24}") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id,
            @RequestParam(value = "image") MultipartFile image
    ) throws IOException {
        byte[] imageAsByteArray = image.getBytes();
        buildingService.saveImage(id, imageAsByteArray);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        return ResponseEntity.status(HttpStatus.CREATED).location(location).build();
    }

    /**
     * Delete building.
     *
     * @param id building id
     * @return response entity
     */
    @DeleteMapping("/{entityId}")
    public ResponseEntity<Boolean> delete(
            @PathVariable("entityId") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String id
    ) {
        final BuildingDto building = buildingService.findOne(id);
        buildingService.delete(building);
        return ResponseEntity.ok(true);
    }

    /**
     * Save building.
     *
     * @param building building to update
     * @return saved building.
     */
    @PutMapping
    public BuildingDto update(@Valid @RequestBody BuildingDto building) {
        return buildingService.update(building);
    }

    /**
     * Create new building.
     *
     * @param building building to save
     * @return saved building
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BuildingDto save(@Valid @RequestBody BuildingDto building) {
        building.setCreatedBy(uaaRemoteService.getCurrentUserId());
        return buildingService.save(building);
    }

    /**
     * Get levels from building.
     *
     * @param buildingId building id
     * @return levels response
     */
    @GetMapping("/{buildingId}/levels")
    public Collection<LevelDto> findAllLevels(
            @PathVariable("buildingId") @Pattern(regexp = "[a-fA-F\\d]{24}") @ApiParam(value = PARAMETER_SHOULD_MATCH_REGEX, required = true) String buildingId
    ) {
        final BuildingDto building = buildingService.findOne(buildingId);
        return levelService.findAll(building);
    }


}
