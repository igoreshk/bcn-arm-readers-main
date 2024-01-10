package com.epam.beacons.cloud.monitor.service.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.epam.beacons.cloud.monitor.service.domain.Coordinate;
import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.exception.EntityNotFoundException;
import com.epam.beacons.cloud.monitor.service.feign.AreaRemoteService;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * Tests for {@link VisitorHistoryService} class.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@MockBean(TrilaterationService.class)
public class VisitorHistoryServiceTest {

    private final String level1 = "level1";

    @Autowired
    private VisitorHistoryService visitorHistoryService;
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private VisitorGroupService visitorGroupService;
    @MockBean
    private AreaRemoteService areaRemoteService;

    private VisitorGroupDto visitorGroupDto;
    private FlatBeaconPositionDto flatBeaconPosition1;
    private FlatBeaconPositionDto flatBeaconPosition2;
    private FlatBeaconPositionDto flatBeaconPosition3;
    private FlatBeaconPositionDto flatBeaconPosition4;
    private FlatBeaconPositionDto flatBeaconPosition5;
    private LocalDateTime startTime;
    private List<Coordinate> coordinates;
    private List<Coordinate> coordinates2;
    private List<Coordinate> coordinates3;

    @Before
    public void setUp() {
        coordinates = Arrays.asList(
                new Coordinate(120, 120),
                new Coordinate(150, 150),
                new Coordinate(120, 150),
                new Coordinate(150, 120)
        );
        coordinates2 = Arrays.asList(
                new Coordinate(200, 200),
                new Coordinate(160, 200),
                new Coordinate(200, 160),
                new Coordinate(160, 160)
        );
        coordinates3 = Arrays.asList(
                new Coordinate(100, 0),
                new Coordinate(300, 300),
                new Coordinate(300, 400),
                new Coordinate(200, 500),
                new Coordinate(0, 300)
        );

        VisitorDto visitorDto = new VisitorDto();
        visitorDto.setName("name1");
        visitorDto.setType(DeviceType.EMITTER);
        visitorDto.setDeviceId("hello");
        visitorDto = visitorService.save(visitorDto);

        VisitorDto visitorDto2 = new VisitorDto();
        visitorDto2.setName("name2");
        visitorDto2.setType(DeviceType.EMITTER);
        visitorDto2.setDeviceId("hello2");
        visitorDto2 = visitorService.save(visitorDto2);

        VisitorDto visitorDto3 = new VisitorDto();
        visitorDto3.setName("name3");
        visitorDto3.setType(DeviceType.EMITTER);
        visitorDto3.setDeviceId("hello3");
        visitorDto3 = visitorService.save(visitorDto3);

        flatBeaconPosition1 = new FlatBeaconPositionDto();
        startTime = LocalDateTime.now().minusDays(14).plusSeconds(1);
        flatBeaconPosition1.setTimestamp(startTime);
        flatBeaconPosition1.setLevelId(level1);
        flatBeaconPosition1.setLatitude(123);
        flatBeaconPosition1.setLongitude(123);
        flatBeaconPosition1.setDeviceId("hello");
        flatBeaconPosition1 = visitorHistoryService.save(flatBeaconPosition1);

        flatBeaconPosition2 = new FlatBeaconPositionDto();
        flatBeaconPosition2.setTimestamp(startTime.minusSeconds(10));
        flatBeaconPosition2.setLevelId(level1);
        flatBeaconPosition2.setLatitude(133);
        flatBeaconPosition2.setLongitude(113);
        flatBeaconPosition2.setDeviceId("hello");
        flatBeaconPosition2 = visitorHistoryService.save(flatBeaconPosition2);

        flatBeaconPosition3 = new FlatBeaconPositionDto();
        flatBeaconPosition3.setTimestamp(startTime.plusSeconds(20));
        flatBeaconPosition3.setLevelId(level1);
        flatBeaconPosition3.setLatitude(134);
        flatBeaconPosition3.setLongitude(143);
        flatBeaconPosition3.setDeviceId("hello");
        flatBeaconPosition3 = visitorHistoryService.save(flatBeaconPosition3);

        flatBeaconPosition4 = new FlatBeaconPositionDto();
        flatBeaconPosition4.setTimestamp(startTime.plusSeconds(30));
        flatBeaconPosition4.setLevelId(level1);
        flatBeaconPosition4.setLatitude(164);
        flatBeaconPosition4.setLongitude(153);
        flatBeaconPosition4.setDeviceId("hello");
        flatBeaconPosition4 = visitorHistoryService.save(flatBeaconPosition4);

        flatBeaconPosition5 = new FlatBeaconPositionDto();
        flatBeaconPosition5.setTimestamp(startTime.plusSeconds(60));
        flatBeaconPosition5.setLevelId(level1);
        flatBeaconPosition5.setLatitude(124);
        flatBeaconPosition5.setLongitude(113);
        flatBeaconPosition5.setDeviceId("hello");
        flatBeaconPosition5 = visitorHistoryService.save(flatBeaconPosition5);

        visitorGroupDto = new VisitorGroupDto();
        visitorGroupDto.setName("visitorGroup");
        visitorGroupDto.setVisitorIds(new HashSet<>(
                Arrays.asList(visitorDto.getEntityId(), visitorDto2.getEntityId(), visitorDto3.getEntityId())));
        visitorGroupDto = visitorGroupService.save(visitorGroupDto);
    }

    /**
     * Clears database.
     */
    @After
    public void tearDown() {
        visitorService.deleteAll();
        visitorHistoryService.deleteAllPositionHistory();
    }

    @Test
    public void getVisitorHistory() {
        String visitor1 = visitorService.findByDeviceId("hello").getEntityId();
        List<FlatBeaconPositionDto> result = Arrays.asList(flatBeaconPosition1, flatBeaconPosition3,
                flatBeaconPosition4, flatBeaconPosition5);
        assertEquals(result, visitorHistoryService.getVisitorHistory(visitor1, startTime, null));
        assertFalse(visitorHistoryService.getVisitorHistory(visitor1, startTime, null)
                .contains(flatBeaconPosition2));
    }

    @Test
    public void getVisitorHistoryByPeriodOfTime() {
        String visitor1 = visitorService.findByDeviceId("hello").getEntityId();
        List<FlatBeaconPositionDto> result = Arrays.asList(flatBeaconPosition1,
                flatBeaconPosition3, flatBeaconPosition4);
        assertEquals(result, visitorHistoryService.getVisitorHistory(visitor1, startTime, startTime.plusSeconds(30)));
    }

    @Test
    public void getVisitorHistoryIncorrectId() {
        assertThrows(IllegalArgumentException.class, () ->
                visitorHistoryService.getVisitorHistory("nonExistentId", startTime, null));
    }

    @Test
    public void getVisitorHistoryNullStartTimeAndEndTime() {
        String visitor1 = visitorService.findByDeviceId("hello").getEntityId();
        List<FlatBeaconPositionDto> result = Arrays.asList(flatBeaconPosition1, flatBeaconPosition3,
                flatBeaconPosition4, flatBeaconPosition5);
        assertEquals(result, visitorHistoryService.getVisitorHistory(visitor1, null, null));
    }

    @Test
    public void getVisitorHistoryByPeriodOfTimeNullStartTime() {
        String visitor1 = visitorService.findByDeviceId("hello").getEntityId();
        List<FlatBeaconPositionDto> result = Arrays.asList(flatBeaconPosition1, flatBeaconPosition3);
        assertEquals(result, visitorHistoryService.getVisitorHistory(visitor1, null, startTime.plusSeconds(20)));
    }

    @Test
    public void getVisitorHistoryStartTimeIsOutOfPeriod() {
        final String visitor1 = "visitor1";

        assertThrows(IllegalArgumentException.class, () ->
                visitorHistoryService.getVisitorHistory(visitor1, startTime.minusDays(1), null));
    }

    @Test
    public void getVisitorHistoryEndTimeIsBeforeStartTime() {
        String visitor1 = visitorService.findByDeviceId("hello").getEntityId();

        assertThrows(IllegalArgumentException.class, () ->
                visitorHistoryService.getVisitorHistory(visitor1, startTime, startTime.minusDays(1)));
    }

    @Test
    public void getVisitorGroupHistoryByExactLocation() {
        List<FlatBeaconPositionDto> expectedVisitorGroupUpdates = Collections.singletonList(flatBeaconPosition5);
        List<FlatBeaconPositionDto> actualVisitorGroupUpdates = (List<FlatBeaconPositionDto>) visitorHistoryService
                .getVisitorGroupHistory(visitorGroupDto.getEntityId(), level1);

        assertEquals(expectedVisitorGroupUpdates.size(), actualVisitorGroupUpdates.size());
        assertEquals(expectedVisitorGroupUpdates, actualVisitorGroupUpdates);
    }

    @Test
    public void getVisitorGroupHistoryByExactLocationNonExistentLevel() {
        assertEquals(
                Collections.emptyList(),
                visitorHistoryService.getVisitorGroupHistory(visitorGroupDto.getEntityId(), "nonExistentLevel")
        );
    }

    @Test
    public void getVisitorGroupHistoryByExactLocationNullLevel() {
        assertEquals(
                Collections.emptyList(),
                visitorHistoryService.getVisitorGroupHistory(visitorGroupDto.getEntityId(), null)
        );
    }

    @Test
    public void getVisitorGroupHistoryByExactLocationNullGroup() {
        Assert.assertThrows(IllegalArgumentException.class,
                () -> visitorHistoryService.getVisitorGroupHistory(null, level1)
        );
    }

    @Test
    public void getVisitorGroupHistoryByExactLocationIllegalGroupId() {
        Assert.assertThrows(IllegalArgumentException.class,
                () -> visitorHistoryService.getVisitorGroupHistory("nonExistentGroup", level1)
        );
    }

    @Test
    public void getVisitorHistoryByAreaAndPeriodOfTimeSuccessTest() {
        List<VisitorDto> result = Collections.singletonList(visitorService.findByDeviceId("hello"));
        String areaId = "area";
        when(areaRemoteService.getCoordinates(areaId)).thenReturn(coordinates);
        assertEquals(result.size(), visitorHistoryService
                .getVisitorsByArea(areaId, null, startTime.plusSeconds(400)).size());
    }

    @Test
    public void getVisitorHistoryByAreaAndPeriodOfTimeNotFound() {
        String areaId2 = "area2";
        when(areaRemoteService.getCoordinates(areaId2)).thenReturn(coordinates2);
        assertEquals(0, visitorHistoryService
                .getVisitorsByArea(areaId2, null, startTime.plusSeconds(100)).size());
    }

    @Test
    public void getVisitorsByAreaAndPeriodOfTimeMultipleFlatBeaconsInAreaReturnOneVisitor() {
        List<VisitorDto> result = Collections.singletonList(
                visitorService.findByDeviceId("hello"));
        String areaId3 = "area3";
        when(areaRemoteService.getCoordinates(areaId3)).thenReturn(coordinates3);
        assertEquals(result.size(), visitorHistoryService
                .getVisitorsByArea(areaId3, null, startTime.plusSeconds(100)).size());
    }
}
