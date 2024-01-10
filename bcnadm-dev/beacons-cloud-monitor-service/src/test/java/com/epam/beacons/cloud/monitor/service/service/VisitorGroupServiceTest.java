package com.epam.beacons.cloud.monitor.service.service;

import static org.junit.Assert.assertEquals;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import java.util.Arrays;
import java.util.HashSet;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link VisitorGroupService} class.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@MockBean(TrilaterationService.class)
public class VisitorGroupServiceTest {

    @Autowired
    private VisitorGroupService visitorGroupService;
    @Autowired
    private VisitorService visitorService;

    private VisitorGroupDto visitorGroupDto;
    private VisitorDto visitorDto1;
    private VisitorDto visitorDto2;
    private VisitorDto visitorDto3;
    private final String level1 = "level1";

    @Before
    public void setUp() {
        final String mac1 = "mac1";
        final String mac2 = "mac2";
        final String mac3 = "mac3";
        final String visitor1 = "visitor1";
        final String visitor2 = "visitor2";
        final String visitor3 = "visitor3";

        visitorDto1 = new VisitorDto();
        visitorDto1.setName(visitor1);
        visitorDto1.setType(DeviceType.EMITTER);
        visitorDto1.setDeviceId(mac1);
        visitorDto1 = visitorService.save(visitorDto1);

        visitorDto2 = new VisitorDto();
        visitorDto2.setName(visitor2);
        visitorDto2.setType(DeviceType.EMITTER);
        visitorDto2.setDeviceId(mac2);
        visitorDto2 = visitorService.save(visitorDto2);

        visitorDto3 = new VisitorDto();
        visitorDto3.setName(visitor3);
        visitorDto3.setType(DeviceType.EMITTER);
        visitorDto3.setDeviceId(mac3);
        visitorDto3 = visitorService.save(visitorDto3);

        visitorGroupDto = new VisitorGroupDto();
        visitorGroupDto.setName("visitorGroup");
        visitorGroupDto.setVisitorIds(new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId(),
                visitorDto3.getEntityId())));
        visitorGroupDto = visitorGroupService.save(visitorGroupDto);
    }

    /**
     * Clears database.
     */
    @After
    public void tearDown() {
        visitorService.deleteAll();
        visitorGroupService.deleteAll();
    }

    @Test
    public void removeVisitorFromGroup() {
        assertEquals(new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId(),
                visitorDto3.getEntityId())), visitorGroupDto.getVisitorIds());
        visitorGroupService.removeVisitorFromGroup(visitorDto1.getEntityId());
        assertEquals(new HashSet<>(Arrays.asList(visitorDto2.getEntityId(), visitorDto3.getEntityId())),
                visitorGroupService.findOne(visitorGroupDto.getEntityId()).getVisitorIds());
    }

    @Test
    public void removeVisitorFromGroupNullVisitor() {
        assertEquals(new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId(),
                visitorDto3.getEntityId())), visitorGroupDto.getVisitorIds());
        visitorGroupService.removeVisitorFromGroup(null);
        assertEquals(new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId(),
                visitorDto3.getEntityId())),
                visitorGroupService.findOne(visitorGroupDto.getEntityId()).getVisitorIds());
    }

    @Test
    public void removeVisitorFromGroupNonExistentVisitor() {
        assertEquals(new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId(),
                visitorDto3.getEntityId())), visitorGroupDto.getVisitorIds());
        visitorGroupService.removeVisitorFromGroup("nonExistentVisitor");
        assertEquals(new HashSet<>(Arrays.asList(visitorDto1.getEntityId(), visitorDto2.getEntityId(),
                visitorDto3.getEntityId())),
                visitorGroupService.findOne(visitorGroupDto.getEntityId()).getVisitorIds());
    }
}
