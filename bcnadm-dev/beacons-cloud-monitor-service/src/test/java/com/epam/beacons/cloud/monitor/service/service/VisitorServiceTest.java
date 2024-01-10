package com.epam.beacons.cloud.monitor.service.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertThrows;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.exception.EntityNotFoundException;
import com.epam.beacons.cloud.monitor.service.exception.NonUniqueValueException;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link VisitorService} class.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@TestPropertySource(properties = {"spring.data.mongodb.auto-index-creation=true"})
@MockBean(TrilaterationService.class)
public class VisitorServiceTest {

    @Autowired
    private VisitorService visitorService;

    /**
     * Clears database.
     */
    @After
    public void tearDown() {
        visitorService.deleteAll();
    }

    @Test
    public void findByTypeAndDeviceId() {
        VisitorDto visitorDto1 = new VisitorDto();
        visitorDto1.setName("visitor1");
        visitorDto1.setType(DeviceType.EMITTER);
        String mac1 = "mac1";
        visitorDto1.setDeviceId(mac1);
        visitorDto1 = visitorService.save(visitorDto1);

        VisitorDto visitorDto2 = new VisitorDto();
        visitorDto2.setName("visitor2");
        visitorDto2.setType(DeviceType.EMITTER);
        String mac2 = "mac2";
        visitorDto2.setDeviceId(mac2);
        visitorDto2 = visitorService.save(visitorDto2);

        VisitorDto visitorDto3 = new VisitorDto();
        visitorDto3.setName("visitor3");
        visitorDto3.setType(DeviceType.RECEIVER);
        String mac3 = "mac3";
        visitorDto3.setDeviceId(mac3);
        visitorDto3 = visitorService.save(visitorDto3);

        assertEquals(visitorDto1, visitorService.findByDeviceId(mac1));
        assertEquals(visitorDto2, visitorService.findByDeviceId(mac2));
        assertEquals(visitorDto3, visitorService.findByDeviceId(mac3));
        assertNotEquals(visitorDto1, visitorService.findByDeviceId(mac2));
        assertNotEquals(visitorDto2, visitorService.findByDeviceId(mac1));
    }

    @Test
    public void findByTypeAndDeviceIdNullDeviceId() {
        assertThrows(EntityNotFoundException.class,
                () -> visitorService.findByDeviceId(null));
    }

    @Test
    public void findByTypeAndDeviceIdNonExistentDeviceId() {
        assertThrows(EntityNotFoundException.class,
                () -> visitorService.findByDeviceId("nonExistentDeviceId"));
    }

    @Test
    public void saveThrowNonUniqueValueExceptionIfTwoVisitorsHaveSameTypeAndDeviceIdTest() {
        VisitorDto visitor = new VisitorDto();
        visitor.setType(DeviceType.EMITTER);
        visitor.setDeviceId("1234");
        visitor.setName("Mike");
        visitorService.save(visitor);

        VisitorDto visitorDuplicate = new VisitorDto();
        visitorDuplicate.setType(DeviceType.EMITTER);
        visitorDuplicate.setDeviceId("1234");
        visitorDuplicate.setName("Ron");

        assertThrows(NonUniqueValueException.class, () -> visitorService.save(visitorDuplicate));
    }

    @Test
    public void saveThrowNonUniqueValueExceptionIfTwoVisitorsHaveSameNameTest() {
        VisitorDto visitor = new VisitorDto();
        visitor.setType(DeviceType.RECEIVER);
        visitor.setDeviceId("201");
        visitor.setName("John");
        visitorService.save(visitor);

        VisitorDto visitorDuplicate = new VisitorDto();
        visitorDuplicate.setType(DeviceType.RECEIVER);
        visitorDuplicate.setDeviceId("101");
        visitorDuplicate.setName("John");

        assertThrows(NonUniqueValueException.class, () -> visitorService.save(visitorDuplicate));
    }

    @Test
    public void saveShouldThrowIllegalArgumentExceptionWhenDeviceIdIsNotAlphanumeric() {
        VisitorDto visitor = new VisitorDto();
        visitor.setType(DeviceType.RECEIVER);
        visitor.setDeviceId("c7:c6:c5:c4:c2:c1:c0");
        visitor.setName("John");

        assertThrows(IllegalArgumentException.class, () -> visitorService.save(visitor));
    }

    @Test
    public void updateShouldThrowIllegalArgumentExceptionWhenDeviceIdIsOver200Characters() {
        VisitorDto visitor = new VisitorDto();
        visitor.setType(DeviceType.RECEIVER);
        String over200CharactersString = Stream.generate(() -> "a").limit(201).collect(Collectors.joining());
        visitor.setDeviceId(over200CharactersString);
        visitor.setName("John");

        assertThrows(IllegalArgumentException.class, () -> visitorService.update(visitor));
    }

    @Test
    public void updateNonExistingTest() {
        VisitorDto visitor = new VisitorDto();
        visitor.setType(DeviceType.RECEIVER);
        visitor.setDeviceId("deviceId");
        visitor.setEntityId("nonExistentEntityId");
        visitor.setName("John");

        assertThrows(IllegalArgumentException.class, () -> visitorService.update(visitor));
    }

    @Test
    public void deleteAllTest() {
        VisitorDto visitorDto1 = new VisitorDto();
        visitorDto1.setDeviceId("deviceId1");
        visitorDto1.setType(DeviceType.RECEIVER);
        visitorDto1.setName("name1");
        visitorService.save(visitorDto1);
        VisitorDto visitorDto2 = new VisitorDto();
        visitorDto2.setDeviceId("deviceId2");
        visitorDto2.setType(DeviceType.EMITTER);
        visitorDto2.setName("name2");
        visitorService.save(visitorDto2);
        assertEquals(2, visitorService.findAll().size());
        visitorService.deleteAll();
        assertEquals(0, visitorService.findAll().size());
    }
}
