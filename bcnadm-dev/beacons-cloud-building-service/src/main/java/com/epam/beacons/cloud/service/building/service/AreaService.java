package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.Area;
import com.epam.beacons.cloud.service.building.domain.AreaDto;
import com.epam.beacons.cloud.service.building.domain.AreaSearchDto;
import com.epam.beacons.cloud.service.building.domain.DomainObject;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.mapper.AreaMapper;
import com.epam.beacons.cloud.service.building.repository.AreaRepository;
import com.epam.beacons.cloud.service.building.repository.LevelRepository;
import java.util.Collection;
import java.util.Collections;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 * Implementation of AreaService.
 */
@Service
public class AreaService extends ServiceCrudSupport<AreaDto, Area, AreaRepository> {

    private static final String AREA_WAS_NOT_FOUND = "AreaDto wasn't found";
    private static final String INCORRECT_LEVEL_ID = "Incorrect level id";
    private static final String LEVEL_ID_WAS_NOT_PROVIDED = "Level id wasn't provided";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");

    private final LevelRepository levelRepository;
    private final MongoTemplate mongoTemplate;

    public AreaService(AreaRepository repository, LevelRepository levelRepository, MongoTemplate mongoTemplate) {
        super(AreaMapper.INSTANCE, repository);
        this.levelRepository = levelRepository;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Find all areas on provided level.
     *
     * @param level level to find areas
     * @return collection of areas
     */
    public Collection<AreaDto> findByLevel(LevelDto level) {
        return getMongoRepository().findAllByLevelId(level.getEntityId()).stream().map(getMapper()::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AreaDto save(AreaDto areaDto) {
        if (areaDto == null) {
            throw new EntityNotFoundException(AREA_WAS_NOT_FOUND);
        }
        return super.save(areaDto);
    }

    @Override
    public AreaDto findOne(String entityId) {
        AreaDto areaDto = super.findOne(entityId);
        if (areaDto == null) {
            throw new EntityNotFoundException(AREA_WAS_NOT_FOUND);
        }

        return areaDto;
    }

    /**
     * Delete all areas from level.
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

    /**
     * Find all areas by name and description on specified level.
     *
     * @param areaSearchDto dto for specified search
     * @param levelId specified level id
     * @return collection of AreaDto
     */
    public Collection<AreaDto> specifiedSearchOnLevel(AreaSearchDto areaSearchDto, String levelId) {
        validateParams(areaSearchDto, levelId);
        return findAreas(areaSearchDto, Collections.singletonList(levelId));
    }

    /**
     * Find all areas by name and description in specified building.
     *
     * @param areaSearchDto dto for specified search
     * @param buildingId specified building id
     * @return collection of AreaDto
     */
    public Collection<AreaDto> specifiedSearchInBuilding(AreaSearchDto areaSearchDto, String buildingId) {
        validateParams(areaSearchDto, buildingId);
        Collection<String> levelIds = levelRepository.findAllByBuildingId(buildingId).stream()
                .map(DomainObject::getId)
                .collect(Collectors.toList());
        return findAreas(areaSearchDto, levelIds);
    }

    private void validateParams(AreaSearchDto areaSearchDto, String entityId) {
        if (areaSearchDto.getName() == null && areaSearchDto.getDescription() == null) {
            throw new IllegalArgumentException("At least one field should not be null");
        }
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new IllegalArgumentException("Incorrect entity id");
        }
    }

    private Collection<AreaDto> findAreas(AreaSearchDto areaSearchDto, Collection<String> levelIds) {
        Query query = new Query();
        if (areaSearchDto.getName() != null) {
            query.addCriteria(Criteria.where("name").regex("(?i).*" + areaSearchDto.getName() + ".*"));
        }
        if (areaSearchDto.getDescription() != null) {
            query.addCriteria(Criteria.where("description").regex("(?i).*" + areaSearchDto.getDescription() + ".*"));
        }
        query.addCriteria(Criteria.where("levelId").in(levelIds));
        return mongoTemplate.find(query, Area.class).stream()
                .map(getMapper()::entityToDto)
                .collect(Collectors.toList());
    }
}
