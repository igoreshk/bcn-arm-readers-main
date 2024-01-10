package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.DomainObject;
import com.epam.beacons.cloud.service.building.domain.DtoObject;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.mapper.EntityToDtoMapper;
import java.beans.FeatureDescriptor;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.util.StringUtils;

/**
 * Supplementary class for services with CRUD operations.
 *
 * @param <D> DTO class to manage
 */
public abstract class ServiceCrudSupport<D extends DtoObject, E extends DomainObject,
        R extends MongoRepository<E, String>> {

    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");
    private static final String ENTITY_ID_NOT_PROVIDED = "EntityId wasn't provided";
    private static final String OBJECT_DTO_NOT_PROVIDED = "ObjectDTO wasn't provided";
    private static final String MONGO_ENTITY_NOT_FOUND = "Mongo entity wasn't found";
    private static final String INCORRECT_ENTITY_ID = "Entity has incorrect format";
    private static final String OBJECT_DTO_ID_CANT_BE_NULL = "ObjectDTO id can't be null";

    private final EntityToDtoMapper<D, E> mapper;
    private final R mongoRepository;

    protected ServiceCrudSupport(EntityToDtoMapper<D, E> mapper, R mongoRepository) {
        this.mapper = mapper;
        this.mongoRepository = mongoRepository;
    }

    protected R getMongoRepository() {
        return mongoRepository;
    }

    protected EntityToDtoMapper<D, E> getMapper() {
        return mapper;
    }

    /**
     * Find all DTOs of given type.
     *
     * @return collection of DTOs
     */
    public Collection<D> findAll() {
        return mongoRepository.findAll().stream().map(mapper::entityToDto).collect(Collectors.toList());
    }

    /**
     * Find DTO by entity id.
     *
     * @param entityId entity id
     * @return found record
     */
    public D findOne(final String entityId) {
        if (!StringUtils.hasText(entityId)) {
            throw new EntityNotFoundException(ENTITY_ID_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(entityId).matches()) {
            throw new IllegalArgumentException(INCORRECT_ENTITY_ID);
        }
        final E entity = mongoRepository.findById(entityId).orElse(null);
        return entity == null ? null : mapper.entityToDto(entity);
    }

    /**
     * Save entity.
     *
     * @param objectDto entity to save
     * @return saved entity
     */
    public D save(final D objectDto) {
        if (objectDto == null) {
            throw new EntityNotFoundException(OBJECT_DTO_NOT_PROVIDED);
        }
        final E entity = mapper.dtoToEntity(objectDto);
        if (objectDto.getEntityId() != null) {
            E retrievedEntity = mongoRepository.findById(entity.getId()).orElse(null);
            if (retrievedEntity != null) {
                BeanUtils.copyProperties(entity, retrievedEntity, getNullPropertyNames(entity));
                return mapper.entityToDto(mongoRepository.save(retrievedEntity));
            }
        }
        return mapper.entityToDto(mongoRepository.save(entity));
    }

    /**
     * Update entity.
     *
     * @param objectDto entity to update
     * @return updated entity
     */
    public D update(final D objectDto) {
        if (objectDto == null) {
            throw new EntityNotFoundException(OBJECT_DTO_NOT_PROVIDED);
        }
        if (objectDto.getEntityId() == null) {
            throw new IllegalArgumentException(OBJECT_DTO_ID_CANT_BE_NULL);
        }
        if (!OBJECT_ID_PATTERN.matcher(objectDto.getEntityId()).matches()) {
            throw new IllegalArgumentException(INCORRECT_ENTITY_ID);
        }
        E retrievedEntity = mongoRepository.findById(objectDto.getEntityId())
                .orElseThrow(() -> new EntityNotFoundException(MONGO_ENTITY_NOT_FOUND));
        E entity = mapper.dtoToEntity(objectDto);
        BeanUtils.copyProperties(entity, retrievedEntity, getNullPropertyNames(entity));
        return mapper.entityToDto(mongoRepository.save(retrievedEntity));
    }

    /**
     * Delete entity.
     *
     * @param objectDto entity to delete
     */
    public void delete(final D objectDto) {
        if (objectDto == null) {
            throw new EntityNotFoundException(OBJECT_DTO_NOT_PROVIDED);
        }
        final E entity = mongoRepository.findById(objectDto.getEntityId()).orElse(null);
        if (entity == null) {
            throw new EntityNotFoundException(MONGO_ENTITY_NOT_FOUND);
        }
        mongoRepository.delete(entity);
    }

    /**
     * Delete all entities.
     */
    public void deleteAll() {
        mongoRepository.deleteAll();
    }

    private String[] getNullPropertyNames(Object entity) {
        final BeanWrapper wrappedSource = new BeanWrapperImpl(entity);
        return Stream.of(wrappedSource.getPropertyDescriptors()).map(FeatureDescriptor::getName)
                .filter(propertyName -> wrappedSource.getPropertyValue(propertyName) == null).toArray(String[]::new);
    }
}
