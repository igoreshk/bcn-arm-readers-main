package com.epam.beacons.cloud.service.building.mapper;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.beans.SamePropertyValuesAs.samePropertyValuesAs;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.service.building.domain.Reader;
import com.epam.beacons.cloud.service.building.domain.ReaderDto;
import org.junit.Test;
import org.mapstruct.factory.Mappers;

public class ReaderMapperTest {

    private final ReaderMapper mapper = Mappers.getMapper(ReaderMapper.class);

    @Test
    public void testReaderMapperShouldMapEntityToDto() {
        Reader reader = new Reader();
        reader.setId("testId");
        reader.setUuid("testUuid");
        reader.setLatitude(1.23);
        reader.setLongitude(12.3);
        reader.setLevelId("testLevelId");

        ReaderDto expectedReaderDto = new ReaderDto();
        expectedReaderDto.setEntityId(reader.getId());
        expectedReaderDto.setUuid(reader.getUuid());
        expectedReaderDto.setLatitude(reader.getLatitude());
        expectedReaderDto.setLongitude(reader.getLongitude());
        expectedReaderDto.setLevelId(reader.getLevelId());

        assertThat(expectedReaderDto, samePropertyValuesAs(mapper.entityToDto(reader)));
    }

    @Test
    public void testReaderMapperShouldMapDtoToEntity() {
        ReaderDto readerDto = new ReaderDto();
        readerDto.setEntityId("testId");
        readerDto.setUuid("testUuid");
        readerDto.setLatitude(1.23);
        readerDto.setLongitude(12.3);
        readerDto.setLevelId("testLevelId");

        Reader expectedReader = new Reader();
        expectedReader.setId(readerDto.getEntityId());
        expectedReader.setUuid(readerDto.getUuid());
        expectedReader.setLatitude(readerDto.getLatitude());
        expectedReader.setLongitude(readerDto.getLongitude());
        expectedReader.setLevelId(readerDto.getLevelId());

        assertThat(expectedReader, samePropertyValuesAs(mapper.dtoToEntity(readerDto)));
    }

    @Test
    public void testEntityToDtoShouldReturnNullWhenSupplyNull() {
        assertNull(mapper.entityToDto(null));
    }

    @Test
    public void testDtoToEntityShouldReturnNullWhenSupplyNull() {
        assertNull(mapper.dtoToEntity(null));
    }
}
