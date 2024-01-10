package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.domain.Level;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.mapper.LevelMapper;
import com.epam.beacons.cloud.service.building.repository.AreaRepository;
import com.epam.beacons.cloud.service.building.repository.BeaconRepository;
import com.epam.beacons.cloud.service.building.repository.LevelRepository;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

/**
 * Implementation for level service.
 */
@Service
public class LevelService extends ServiceCrudSupport<LevelDto, Level, LevelRepository> {

    public static final String IMAGE_WAS_NOT_FOUND = "Image wasn't found";
    public static final String UNSUPPORTED_IMAGE_FORMAT = "Format of the original image is not supported";

    private static final String LEVEL_WAS_NOT_FOUND = "Level wasn't found";
    private static final String VALIDATION_ID_FAILED = "ID is invalid";
    private static final String BUILDING_LEVEL_ALREADY_EXISTS = "Level with such building id and number already exists";
    private static final java.util.regex.Pattern OBJECT_ID_PATTERN = java.util.regex.Pattern.compile("[a-zA-Z0-9]{24}");
    private final BeaconRepository beaconRepository;

    private final AreaRepository areaRepository;
    private final VertexService vertexService;
    private final List<String> validImageFormats;

    public LevelService(
            LevelRepository levelRepository, BeaconRepository beaconRepository,
            AreaRepository areaRepository, VertexService vertexService,
            @Value("${beacons.cloud.building.valid-image-formats}") List<String> validImageFormats
    ) {
        super(LevelMapper.INSTANCE, levelRepository);
        this.beaconRepository = beaconRepository;
        this.areaRepository = areaRepository;
        this.vertexService = vertexService;
        this.validImageFormats = validImageFormats;
    }

    /**
     * Find all levels of the building.
     *
     * @param building level to find levels
     * @return collection of levels
     */
    public Collection<LevelDto> findAll(final BuildingDto building) {
        if (building == null) {
            throw new EntityNotFoundException("Building wasn't provided");
        }
        return getMongoRepository().findAllByBuildingId(building.getEntityId()).stream()
                .map(getMapper()::entityToDto).collect(Collectors.toList());
    }

    @Override
    public LevelDto save(LevelDto levelDto) {
        try {
            return super.save(levelDto);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(BUILDING_LEVEL_ALREADY_EXISTS, ex);
        }
    }

    /**
     * Update level.
     *
     * @param levelDto to update level
     */
    @Override
    public LevelDto update(LevelDto levelDto) {
        try {
            return super.update(levelDto);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(BUILDING_LEVEL_ALREADY_EXISTS, ex);
        }
    }

    @Override
    public void delete(LevelDto levelDto) {
        super.delete(levelDto);
        String levelId = levelDto.getEntityId();
        beaconRepository.deleteByLevelId(levelId);
        areaRepository.deleteByLevelId(levelId);
        vertexService.deleteAll(levelId);
    }

    /**
     * Delete all levels.
     */
    @Override
    public void deleteAll() {
        findAll().forEach(this::delete);
    }

    /**
     * Gets level.
     *
     * @param entityId to find level
     * @return level
     */
    public Level getLevel(String entityId) {
        Optional<Level> levelOptional = getMongoRepository().findById(entityId);
        if (!levelOptional.isPresent()) {
            throw new EntityNotFoundException(LEVEL_WAS_NOT_FOUND);
        }
        Level level = levelOptional.get();
        if (level.getImageAsByteArray() != null && level.getImageAsByteArray().length > 0) {
            return level;
        }
        throw new EntityNotFoundException(IMAGE_WAS_NOT_FOUND);
    }

    /**
     * Saves image for level.
     *
     * @param entityId level's id that uses image
     * @param imageAsByteArray image for level
     */
    public void saveImage(String entityId, byte[] imageAsByteArray) throws IOException {
        if (imageAsByteArray == null || imageAsByteArray.length <= 0) {
            throw new IllegalArgumentException(IMAGE_WAS_NOT_FOUND);
        }
        Optional<Level> levelOptional = getMongoRepository().findById(entityId);
        if (!levelOptional.isPresent()) {
            throw new EntityNotFoundException(LEVEL_WAS_NOT_FOUND);
        }
        Level level = levelOptional.get();
        level.setImageAsByteArray(imageAsByteArray);
        String mimeType = getMimeType(imageAsByteArray);
        level.setMimeType(mimeType);
        getMongoRepository().save(level);
    }

    @Override
    public LevelDto findOne(String entityId) {
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new IllegalArgumentException(VALIDATION_ID_FAILED);
        }
        LevelDto levelDto = super.findOne(entityId);
        if (levelDto == null) {
            throw new EntityNotFoundException(LEVEL_WAS_NOT_FOUND);
        }

        return levelDto;
    }

    private String getMimeType(byte[] imageAsByteArray) throws IOException {
        try (ImageInputStream imageInputStream =
                ImageIO.createImageInputStream(new ByteArrayInputStream(imageAsByteArray))) {
            Iterator<ImageReader> imageReaders = ImageIO.getImageReaders(imageInputStream);
            String formatName;
            if (imageReaders.hasNext()) {
                ImageReader imageReader = imageReaders.next();
                formatName = imageReader.getFormatName().toLowerCase();
            } else {
                throw new IllegalArgumentException(UNSUPPORTED_IMAGE_FORMAT);
            }
            if (!validImageFormats.contains(formatName)) {
                throw new IllegalArgumentException(UNSUPPORTED_IMAGE_FORMAT);
            }
            return ("image/" + formatName);
        }
    }
}
