package com.epam.beacons.cloud.monitor.service.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.Visitor;
import com.epam.beacons.cloud.monitor.service.repository.VisitorRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TrilaterationServiceTest {

    @Autowired
    private TrilaterationService service;

    @Autowired
    private VisitorRepository repository;

    @Test
    public void testUpdateTopics() {
        repository.insert(setUpVisitor());
        assertDoesNotThrow(() -> service.updateTopics());
    }

    private Visitor setUpVisitor() {
        Visitor visitor = new Visitor();
        visitor.setName("Test-Visitor-Name");
        visitor.setDeviceId("beacon");
        visitor.setType(DeviceType.EMITTER);
        visitor.setId("Test-Visitor");
        return visitor;
    }

}
