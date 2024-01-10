package com.epam.beacons.cloud.monitor.service.service;

import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.exception.EntityNotFoundException;
import com.epam.beacons.cloud.monitor.service.mapper.VisitorGroupMapper;
import com.epam.beacons.cloud.monitor.service.repository.VisitorGroupRepository;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Implementation of VisitorGroupService.
 */
@Service("visitorGroupServiceImpl")
@Deprecated
public class VisitorGroupService {

    private static final String VISITOR_GROUP_NOT_FOUND = "Visitor group wasn't found";
    private static final String OBJECT_DTO_NOT_PROVIDED = "ObjectDTO wasn't provided";
    private static final String ENTITY_ID_NOT_PROVIDED = "EntityId wasn't provided";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");
    private static final String INCORRECT_ENTITY_ID = "Entity has incorrect format";

    private final VisitorGroupMapper mapper = Mappers.getMapper(VisitorGroupMapper.class);
    private final VisitorGroupRepository mongoRepository;

    public VisitorGroupService(VisitorGroupRepository visitorGroupRepository) {
        this.mongoRepository = visitorGroupRepository;
    }

    /**
     * Removes specific visitor from visitorGroup.
     *
     * @param entityId visitor ID to remove
     */
    public void removeVisitorFromGroup(@NotNull String entityId) {
        for (VisitorGroupDto visitorGroupDto : findAll()) {
            if (visitorGroupDto.getVisitorIds() != null && visitorGroupDto.getVisitorIds().remove(entityId)) {
                save(visitorGroupDto);
            }
        }
    }

    /**
     * Find DTO by entity id.
     *
     * @param entityId entity id
     * @return found record
     */
    public VisitorGroupDto findOne(@NotNull String entityId) {
        if (!StringUtils.hasText(entityId)) {
            throw new IllegalArgumentException(ENTITY_ID_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new IllegalArgumentException(INCORRECT_ENTITY_ID);
        }
        VisitorGroupDto visitorGroupDto =  mongoRepository.findById(entityId).map(mapper::entityToDto).orElse(null);
        if (visitorGroupDto == null) {
            throw new EntityNotFoundException(VISITOR_GROUP_NOT_FOUND);
        }
        return visitorGroupDto;
    }

    /**
     * Find all DTOs of given type.
     *
     * @return collection of DTOs
     */
    public Collection<VisitorGroupDto> findAll() {
        return mongoRepository.findAll().stream().map(mapper::entityToDto).collect(Collectors.toList());
    }

    /**
     * Save entity.
     *
     * @param objectDto entity to save
     * @return saved entity
     */
    public VisitorGroupDto save(VisitorGroupDto objectDto) {
        if (objectDto == null) {
            throw new IllegalArgumentException(OBJECT_DTO_NOT_PROVIDED);
        }
        return mapper.entityToDto(mongoRepository.save(mapper.dtoToEntity(objectDto)));
    }

    /**
     * Delete entity.
     *
     * @param objectDto entity to delete
     */
    public void delete(VisitorGroupDto objectDto) {
        if (objectDto == null) {
            throw new IllegalArgumentException(OBJECT_DTO_NOT_PROVIDED);
        }
        mongoRepository.deleteById(objectDto.getEntityId());
    }

    /**
     * Deletes all data.
     */
    public void deleteAll() {
        mongoRepository.deleteAll();
    }

}
