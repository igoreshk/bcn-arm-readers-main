package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.Reader;
import com.epam.beacons.cloud.service.building.domain.ReaderDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.mapper.ReaderMapper;
import com.epam.beacons.cloud.service.building.repository.ReaderRepository;
import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

/**
 * Reader service implementation.
 */
@Service
@Validated
public class ReaderService extends ServiceCrudSupport<ReaderDto, Reader, ReaderRepository> {

    private static final String UUID_IS_NOT_UNIQUE = "Uuid is not unique";
    private static final String READER_WAS_NOT_FOUND = "Reader wasn't found";
    private static final String INCORRECT_LEVEL_ID = "Incorrect level id";
    private static final String LEVEL_ID_WAS_NOT_PROVIDED = "Level id wasn't provided";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");

    public ReaderService(ReaderRepository repository) {
        super(ReaderMapper.INSTANCE, repository);
    }

    /**
     * Find reader by uuid.
     *
     * @param uuid reader uuid
     * @return reader dto
     */
    public ReaderDto findByUuid(@NotNull String uuid) {
        ReaderDto readerDto = getMapper().entityToDto(getMongoRepository().findByUuid(uuid));
        if (readerDto == null) {
            throw new EntityNotFoundException(READER_WAS_NOT_FOUND);
        }
        return readerDto;
    }

    /**
     * Find all readers on the level.
     *
     * @param level level to search on
     * @return collection of readers
     */
    public Collection<ReaderDto> findAll(LevelDto level) {
        return getMongoRepository().findAllByLevelId(level.getEntityId()).stream().map(getMapper()::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Saves reader, could throw DuplicationKeyException but because of unexpected behavior
     * we throw custom {@link NonUniqueValueException}.
     *
     * @param readerDto to save
     * @return saved reader
     * @throws NonUniqueValueException if saving reader with non-unique uuid
     * */
    @Override
    public ReaderDto save(ReaderDto readerDto) {
        try {
            return super.save(readerDto);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(UUID_IS_NOT_UNIQUE, ex);
        }
    }

    /**
     * Updates reader, could throw DuplicationKeyException but because of unexpected behavior
     * we throw custom {@link NonUniqueValueException}.
     *
     * @param readerDto to update
     * @return updated reader
     * @throws NonUniqueValueException if updated reader has non-unique uuid
     * */
    @Override
    public ReaderDto update(ReaderDto readerDto) {
        try {
            return super.update(readerDto);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(UUID_IS_NOT_UNIQUE, ex);
        }
    }

    @Override
    public ReaderDto findOne(String entityId) {
        ReaderDto readerDto = super.findOne(entityId);
        if (readerDto == null) {
            throw new EntityNotFoundException(READER_WAS_NOT_FOUND);
        }
        return readerDto;
    }

    /**
     * Delete all readers from level.
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
