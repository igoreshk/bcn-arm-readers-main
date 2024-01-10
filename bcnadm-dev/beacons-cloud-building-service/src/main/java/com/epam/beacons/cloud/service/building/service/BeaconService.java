package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.Beacon;
import com.epam.beacons.cloud.service.building.domain.BeaconDto;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.mapper.BeaconMapper;
import com.epam.beacons.cloud.service.building.repository.BeaconRepository;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

/**
 * Beacon service implementation.
 */
@Service
@Validated
public class BeaconService extends ServiceCrudSupport<BeaconDto, Beacon, BeaconRepository> {

    private static final String BEACON_WAS_NOT_FOUND = "Beacon wasn't found";
    private static final String DUPLICATED_UUID = "Beacon with such uuid already exists";
    private static final String INCORRECT_LEVEL_ID = "Incorrect level id";
    private static final String LEVEL_ID_WAS_NOT_PROVIDED = "Level id wasn't provided";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");

    public BeaconService(BeaconRepository repository) {
        super(BeaconMapper.INSTANCE, repository);
    }

    /**
     * Find all beacons on the level.
     *
     * @param level level to search on
     * @return collection of beacons
     */
    public Collection<BeaconDto> findAll(LevelDto level) {
        return getMongoRepository().findAllByLevelId(level.getEntityId()).stream().map(getMapper()::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BeaconDto save(BeaconDto beacon) {
        try {
            return super.save(beacon);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(DUPLICATED_UUID, ex);
        }
    }

    @Override
    public BeaconDto update(BeaconDto beacon) {
        try {
            return super.update(beacon);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(DUPLICATED_UUID, ex);
        }
    }

    @Override
    public BeaconDto findOne(String entityId) {
        BeaconDto beaconDto = super.findOne(entityId);
        if (beaconDto == null) {
            throw new EntityNotFoundException(BEACON_WAS_NOT_FOUND);
        }
        return beaconDto;
    }

    /**
     * Delete all beacons from level.
     *
     * @param levelId level id to delete
     */
    public void deleteAll(String levelId) {
        if (levelId == null) {
            throw new IllegalArgumentException(LEVEL_ID_WAS_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(levelId).matches()) {
            throw new IllegalArgumentException(INCORRECT_LEVEL_ID);
        }
        getMongoRepository().deleteByLevelId(levelId);
    }
}
