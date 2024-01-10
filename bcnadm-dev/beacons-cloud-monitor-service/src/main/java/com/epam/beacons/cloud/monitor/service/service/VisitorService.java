package com.epam.beacons.cloud.monitor.service.service;

import com.epam.beacons.cloud.monitor.service.domain.Visitor;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.exception.EntityNotFoundException;
import com.epam.beacons.cloud.monitor.service.exception.NonUniqueValueException;
import com.epam.beacons.cloud.monitor.service.mapper.VisitorMapper;
import com.epam.beacons.cloud.monitor.service.repository.VisitorRepository;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import org.mapstruct.factory.Mappers;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * {@link VisitorService} implementation.
 */
@Service
public class VisitorService {

    private static final String VISITOR_ALREADY_EXISTS = "Visitor with device id %s already exists";
    private static final String VISITOR_DOES_NOT_EXIST = "Visitor with such entityId does not exist";
    private static final String DEVICE_ID_IS_NOT_VALID = "Device id should be alphanumeric and not exceed 200 characters";
    private static final Pattern DEVICE_ID_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s]{0,200}$");
    private static final String OBJECT_DTO_NOT_PROVIDED = "ObjectDTO wasn't provided";
    private static final String ENTITY_ID_NOT_PROVIDED = "EntityId wasn't provided";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");
    private static final String OBJECT_DTO_ID_CANT_BE_NULL = "ObjectDTO id can't be null";
    private static final String INCORRECT_ENTITY_ID = "Entity has incorrect format";

    private final TrilaterationService trilaterationService;
    private final VisitorMapper mapper = Mappers.getMapper(VisitorMapper.class);
    private final VisitorRepository mongoRepository;

    public VisitorService(VisitorRepository visitorRepository, TrilaterationService trilaterationService) {
        this.mongoRepository = visitorRepository;
        this.trilaterationService = trilaterationService;
        trilaterationService.updateTopics();
    }

    /**
     * Find all DTOs of given type.
     *
     * @return collection of DTOs
     */
    public Collection<VisitorDto> findAll() {
        return mongoRepository.findAll().stream().map(mapper::entityToDto).collect(Collectors.toList());
    }

    /**
     * Find DTO by entity id.
     *
     * @param entityId entity id
     * @return found record
     */
    public VisitorDto findOne(final String entityId) {
        if (!StringUtils.hasText(entityId)) {
            throw new IllegalArgumentException(ENTITY_ID_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new IllegalArgumentException(INCORRECT_ENTITY_ID);
        }
        return mongoRepository.findById(entityId).map(mapper::entityToDto).orElse(null);
    }

    /**
     * Save new visitors.
     *
     * @param visitorDto - visitor dto
     * @return visitor dto
     */
    public VisitorDto save(VisitorDto visitorDto) {
        validateDeviceIdIsAlphanumericAndLessThan200Characters(visitorDto.getDeviceId());
        try {
            VisitorDto saved = mapper.entityToDto(mongoRepository.save(mapper.dtoToEntity(visitorDto)));
            trilaterationService.updateTopics();
            return saved;
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(String.format(VISITOR_ALREADY_EXISTS, visitorDto.getDeviceId()), ex);
        }
    }

    private void validateDeviceIdIsAlphanumericAndLessThan200Characters(String deviceId) {
        if (!DEVICE_ID_PATTERN.matcher(deviceId).matches()) {
            throw new IllegalArgumentException(DEVICE_ID_IS_NOT_VALID);
        }
    }

    /**
     * Delete visitor.
     *
     * @param visitorDto visitor dto
     */
    public void delete(VisitorDto visitorDto) {
        if (visitorDto == null) {
            throw new IllegalArgumentException(OBJECT_DTO_NOT_PROVIDED);
        }
        mongoRepository.deleteById(visitorDto.getEntityId());
        trilaterationService.updateTopics();
    }

    /**
     * Delete all visitors.
     */
    public void deleteAll() {
        mongoRepository.deleteAll();
        trilaterationService.updateTopics();
    }

    /**
     * Find visitor by device type and device Id.
     *
     * @param deviceId device Id
     * @return visitor dto
     */
    public VisitorDto findByDeviceId(@NotNull String deviceId) {
        Visitor visitor = mongoRepository.findByDeviceId(deviceId);
        if (visitor == null) {
            throw new EntityNotFoundException(VISITOR_DOES_NOT_EXIST);
        }
        return mapper.entityToDto(visitor);
    }

    /**
     * Update visitor.
     *
     * @param visitorDto visitor dto
     * @return visitor dto
     */
    public VisitorDto update(VisitorDto visitorDto) {
        validateDeviceIdIsAlphanumericAndLessThan200Characters(visitorDto.getDeviceId());
        try {
            VisitorDto visitorDtoFromDb = findOne(visitorDto.getEntityId());
            if (visitorDto.getEntityId() == null) {
                throw new IllegalArgumentException(OBJECT_DTO_ID_CANT_BE_NULL);
            }
            if (!OBJECT_ID_PATTERN.matcher(visitorDto.getEntityId()).matches()) {
                throw new IllegalArgumentException(INCORRECT_ENTITY_ID);
            }
            VisitorDto updatedDto = mapper.entityToDto(mongoRepository.save(mapper.dtoToEntity(visitorDto)));
            if (!visitorDtoFromDb.getDeviceId().equals(visitorDto.getDeviceId())) {
                trilaterationService.updateTopics();
            }
            return updatedDto;
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(String.format(VISITOR_ALREADY_EXISTS, visitorDto.getDeviceId()), ex);
        }
    }
}
