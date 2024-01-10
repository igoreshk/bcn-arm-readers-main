package com.epam.beacons.cloud.service.building.service;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.epam.beacons.cloud.service.building.domain.ReaderDto;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.feign.UaaRemoteService;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link ReaderService}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.cloud.config.discovery.enabled=false", "spring.cloud.config.enabled=false",
        "eureka.client.enabled=false", "spring.cloud.vault.enabled=false"})

public class ReaderServiceTest {

    @MockBean
    private UaaRemoteService uaaRemoteService;
    @Autowired
    private ReaderService readerService;

    @After
    public void drop() {
        readerService.deleteAll();
    }

    @Test
    public void saveReaderWithNonUniqueUuidLeadsToException() {
        ReaderDto readerDto = new ReaderDto();
        readerDto.setUuid("1");
        readerService.save(readerDto);

        ReaderDto readerDtoDuplicate = new ReaderDto();
        readerDtoDuplicate.setUuid("1");

        assertThrows(NonUniqueValueException.class, () -> readerService.save(readerDtoDuplicate));
    }
    
    @Test
    public void deleteAllTest() {
        ReaderDto readerDto1 = new ReaderDto();
        readerDto1.setUuid("uuid1");
        readerDto1.setLevelId(String.format("EntityID%016d", 1));
        readerService.save(readerDto1);
        ReaderDto readerDto2 = new ReaderDto();
        readerDto2.setUuid("uuid2");
        readerDto2.setLevelId(String.format("EntityID%016d", 1));
        readerService.save(readerDto2);
        ReaderDto readerDto3 = new ReaderDto();
        readerDto3.setUuid("uuid3");
        readerDto3.setLevelId(String.format("EntityID%016d", 2));
        readerService.save(readerDto3);

        Assert.assertEquals(3, readerService.findAll().size());
        readerService.deleteAll();
        Assert.assertEquals(0, readerService.findAll().size());
    }

    @Test
    public void deleteAllByLevelTest() {
        String levelId1 = String.format("EntityID%016d", 1);
        ReaderDto readerDto1 = new ReaderDto();
        readerDto1.setUuid("uuid1");
        readerDto1.setLevelId(levelId1);
        readerService.save(readerDto1);
        ReaderDto readerDto2 = new ReaderDto();
        readerDto2.setUuid("uuid2");
        readerDto2.setLevelId(levelId1);
        readerService.save(readerDto2);
        String levelId2 = String.format("EntityID%016d", 2);
        ReaderDto readerDto3 = new ReaderDto();
        readerDto3.setUuid("uuid3");
        readerDto3.setLevelId(levelId2);
        readerDto3 = readerService.save(readerDto3);

        Assert.assertEquals(3, readerService.findAll().size());
        readerService.deleteAll(levelId1);
        Assert.assertEquals(1, readerService.findAll().size());
        Assert.assertEquals(readerDto3, readerService.findOne(readerDto3.getEntityId()));
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsNull() {
        Exception ex = Assert.assertThrows(IllegalArgumentException.class, () -> readerService.deleteAll(null));
        assertEquals("Level id wasn't provided", ex.getMessage());
    }

    @Test
    public void deleteAllOnLevelShouldThrowExceptionWhenLevelIdIsIncorrect() {
        Exception ex = Assert.assertThrows(IllegalArgumentException.class,
                () -> readerService.deleteAll("InvalidId"));
        assertEquals("Incorrect level id", ex.getMessage());
    }
}
