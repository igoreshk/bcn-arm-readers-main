package com.epam.beacons.cloud.monitor.service.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.epam.beacons.cloud.monitor.service.domain.Coordinate;
import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.feign.AreaRemoteService;
import com.epam.beacons.cloud.monitor.service.service.TrilaterationService;
import com.epam.beacons.cloud.monitor.service.service.VisitorGroupService;
import com.epam.beacons.cloud.monitor.service.service.VisitorHistoryService;
import com.epam.beacons.cloud.monitor.service.service.VisitorService;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Tests for {@link VisitorHistoryController}.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@MockBean(TrilaterationService.class)
public class VisitorHistoryControllerTest {

    private static final String DEVICE_ID = "d93f5c4ad81f";
    private static final DateTimeFormatter ISO_8601 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final String BEGINNING_OF_RANGE = LocalDateTime.now().minusDays(5).format(ISO_8601);
    private static final String DATE_IN_RANGE_FIRST = LocalDateTime.now().minusDays(5).plusSeconds(20).format(ISO_8601);
    private static final String DATE_OUT_OF_RANGE = LocalDateTime.now().minusDays(10).format(ISO_8601);
    private static final String FLAT_BEACON_POSITION_PATH = "/api/v1/monitor/history/";
    private static final Logger LOGGER = LogManager.getLogger(VisitorHistoryControllerTest.class);
    private MockMvc mockMvc;

    @Autowired
    private VisitorGroupService visitorGroupService;
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private VisitorHistoryService visitorHistoryService;
    @Autowired
    private WebApplicationContext webApplicationContext;
    @MockBean
    private AreaRemoteService areaRemoteService;

    private String areaId;
    private List<Coordinate> coordinates;

    @Before
    public void initMockMvc() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Before
    public void setUp() {
        VisitorDto visitorDto = provideVisitorDto();
        visitorService.save(visitorDto);
        areaId = String.format("AreaID%016d", 1);
        coordinates = Arrays.asList(
                new Coordinate(10, 10),
                new Coordinate(10, 15),
                new Coordinate(15, 10),
                new Coordinate(15, 15)
        );
    }

    /**
     * Provide visitor dto.
     *
     * @return visitor dto.
     */
    private VisitorDto provideVisitorDto() {
        VisitorDto visitorDto = new VisitorDto();
        visitorDto.setName("name1");
        visitorDto.setDeviceId(DEVICE_ID);
        visitorDto.setEntityId(String.format("EntityID%016d", 1));
        visitorDto.setType(DeviceType.EMITTER);
        return visitorDto;
    }

    private FlatBeaconPositionDto getFlatBeaconPositionDto() {
        FlatBeaconPositionDto flatBeaconPositionDto = new FlatBeaconPositionDto();
        flatBeaconPositionDto.setDeviceId(DEVICE_ID);
        flatBeaconPositionDto.setEntityId(String.format("EntityID%016d", 1));
        flatBeaconPositionDto.setLevelId(String.format("LevelId%017d", 1));
        flatBeaconPositionDto.setTimestamp(LocalDateTime.of(2020, 1, 1, 0, 0, 37));
        flatBeaconPositionDto.setLatitude(10.01);
        flatBeaconPositionDto.setLongitude(10.02);
        flatBeaconPositionDto.setHeartRate(80);
        flatBeaconPositionDto.setBodyTemperature(36.6);
        flatBeaconPositionDto.setStepCount(2800);
        return flatBeaconPositionDto;
    }

    @Test
    public void getVisitorsHistoryShouldReturnListIfTimestampIsInRange() throws Exception {
        FlatBeaconPositionDto beaconPosition = getFlatBeaconPositionDto();
        beaconPosition.setTimestamp(LocalDateTime.parse(DATE_IN_RANGE_FIRST, ISO_8601));
        visitorHistoryService.save(beaconPosition);

        VisitorDto visitorDto = provideVisitorDto();

        String urlTemplate = String.format("%svisitors/EntityID%016d", FLAT_BEACON_POSITION_PATH, 1);
        LOGGER.info("GET URL {}", urlTemplate);
        mockMvc.perform(get(urlTemplate)
                .param("start", BEGINNING_OF_RANGE))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].entityId").value(beaconPosition.getEntityId()))
                .andExpect(jsonPath("$[0].levelId").value(beaconPosition.getLevelId()))
                .andExpect(jsonPath("$[0].name").value(is(visitorDto.getName())))
                .andExpect(jsonPath("$[0].timestamp").value(beaconPosition.getTimestamp().toString()))
                .andExpect(jsonPath("$[0].heartRate").value(beaconPosition.getHeartRate()))
                .andExpect(jsonPath("$[0].bodyTemperature").value(beaconPosition.getBodyTemperature()))
                .andExpect(jsonPath("$[0].stepCount").value(beaconPosition.getStepCount()))
                .andExpect(jsonPath("$[0].latitude").value(beaconPosition.getLatitude()))
                .andExpect(jsonPath("$[0].longitude").value(beaconPosition.getLongitude()));
    }

    @Test
    public void getVisitorsHistoryShouldReturnEmptyListIfTimestampIsOutOfRange() throws Exception {
        FlatBeaconPositionDto beaconPosition = getFlatBeaconPositionDto();
        beaconPosition.setTimestamp(LocalDateTime.parse(DATE_OUT_OF_RANGE, ISO_8601));
        visitorHistoryService.save(beaconPosition);

        String urlTemplate = String.format("%svisitors/EntityID%016d", FLAT_BEACON_POSITION_PATH, 1);
        LOGGER.info("GET URL {}", urlTemplate);
        mockMvc.perform(get(urlTemplate)
                .param("start", BEGINNING_OF_RANGE))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()", is(0)));
    }

    @Test
    public void getVisitorGroupHistoryTest() throws Exception {
        Collection<VisitorDto> visitorDtos  = visitorService.findAll();
        VisitorDto testVisitorDto = visitorDtos.iterator().next();

        FlatBeaconPositionDto flatBeaconPositionDto = new FlatBeaconPositionDto();
        flatBeaconPositionDto.setEntityId(String.format("EntityID%016d", 2));
        flatBeaconPositionDto.setLevelId(String.format("LevelId%017d", 1));
        flatBeaconPositionDto.setName(testVisitorDto.getName());
        flatBeaconPositionDto.setTimestamp(LocalDateTime.now().minusHours(12).withNano(0));
        flatBeaconPositionDto.setLatitude(123L);
        flatBeaconPositionDto.setLongitude(456L);
        flatBeaconPositionDto.setDeviceId(testVisitorDto.getDeviceId());
        flatBeaconPositionDto.setHeartRate(88);
        flatBeaconPositionDto.setBodyTemperature(36.6);
        flatBeaconPositionDto.setStepCount(5000);
        visitorHistoryService.save(flatBeaconPositionDto);

        VisitorGroupDto visitorGroupDto = new VisitorGroupDto();
        visitorGroupDto.setName("GroupName");
        visitorGroupDto.setVisitorIds(Collections.singleton(String.format("EntityID%016d", 1)));

        flatBeaconPositionDto = new FlatBeaconPositionDto();
        flatBeaconPositionDto.setEntityId(String.format("EntityID%016d", 3));
        flatBeaconPositionDto.setLevelId(String.format("LevelId%017d", 2));
        flatBeaconPositionDto.setName(testVisitorDto.getName());
        flatBeaconPositionDto.setTimestamp(LocalDateTime.now().minusHours(10).withNano(0));
        flatBeaconPositionDto.setLatitude(321L);
        flatBeaconPositionDto.setLongitude(654L);
        flatBeaconPositionDto.setDeviceId(testVisitorDto.getDeviceId());
        flatBeaconPositionDto.setHeartRate(78);
        flatBeaconPositionDto.setBodyTemperature(36.6);
        flatBeaconPositionDto.setStepCount(7000);
        visitorHistoryService.save(flatBeaconPositionDto);

        visitorGroupDto.setVisitorIds(Collections.singleton(String.format("EntityID%016d", 1)));
        visitorGroupDto = visitorGroupService.save(visitorGroupDto);

        String visitorGroupId = visitorGroupDto.getEntityId();
        String levelId = flatBeaconPositionDto.getLevelId();

        String urlTemplate = String
                .format("%s%s/levels/%s", FLAT_BEACON_POSITION_PATH, visitorGroupId, levelId);
        LOGGER.info("GET URL {}", urlTemplate);
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].entityId").value(flatBeaconPositionDto.getEntityId()))
                .andExpect(jsonPath("$[0].levelId").value(flatBeaconPositionDto.getLevelId()))
                .andExpect(jsonPath("$[0].name").value(flatBeaconPositionDto.getName()))
                .andExpect(jsonPath("$[0].timestamp")
                        .value(flatBeaconPositionDto.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME)))
                .andExpect(jsonPath("$[0].heartRate").value(flatBeaconPositionDto.getHeartRate()))
                .andExpect(jsonPath("$[0].bodyTemperature").value(flatBeaconPositionDto.getBodyTemperature()))
                .andExpect(jsonPath("$[0].stepCount").value(flatBeaconPositionDto.getStepCount()))
                .andExpect(jsonPath("$[0].latitude").value(flatBeaconPositionDto.getLatitude()))
                .andExpect(jsonPath("$[0].longitude").value(flatBeaconPositionDto.getLongitude()));

        visitorGroupService.delete(visitorGroupDto);
        mockMvc.perform(get(urlTemplate)).andExpect(status().isNotFound());
    }

    @Test
    public void getSortedVisitorsHistoryTest() throws Exception {
        FlatBeaconPositionDto fbp1 = new FlatBeaconPositionDto();
        fbp1.setDeviceId(DEVICE_ID);
        fbp1.setTimestamp(LocalDateTime.of(1, 1, 1,0,1));
        visitorHistoryService.save(fbp1);
        FlatBeaconPositionDto fbp5 = new FlatBeaconPositionDto();
        fbp5.setDeviceId(DEVICE_ID);
        fbp5.setTimestamp(LocalDateTime.of(1, 1, 1,0,5));
        visitorHistoryService.save(fbp5);
        FlatBeaconPositionDto fbp3 = new FlatBeaconPositionDto();
        fbp3.setDeviceId(DEVICE_ID);
        fbp3.setTimestamp(LocalDateTime.of(1, 1, 1,0,3));
        visitorHistoryService.save(fbp3);

        String urlTemplate = String.format("%ssorted/visitors/EntityID%016d", FLAT_BEACON_POSITION_PATH, 1);
        mockMvc.perform(get(urlTemplate))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.*", hasSize(3)))
                .andExpect(jsonPath("$[0].timestamp").value("0001-01-01T00:05:00"))
                .andExpect(jsonPath("$[1].timestamp").value("0001-01-01T00:03:00"))
                .andExpect(jsonPath("$[2].timestamp").value("0001-01-01T00:01:00"));
    }


    @Test
    public void getVisitorsByAreaShouldReturnCollection() throws Exception {
        FlatBeaconPositionDto beaconPosition = getFlatBeaconPositionDto();
        LocalDateTime timestamp = LocalDateTime.parse(DATE_IN_RANGE_FIRST, ISO_8601);
        beaconPosition.setTimestamp(timestamp);
        visitorHistoryService.save(beaconPosition);

        VisitorDto visitorDto = provideVisitorDto();
        when(areaRemoteService.getCoordinates(areaId)).thenReturn(coordinates);

        String urlTemplate = String.format("%svisitors/areas/%s", FLAT_BEACON_POSITION_PATH, areaId);
        LOGGER.info("GET URL {}", urlTemplate);
        mockMvc.perform(get(urlTemplate)
                        .param("start", BEGINNING_OF_RANGE)
                        .param("end", timestamp.plusMinutes(1).format(ISO_8601)))
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(jsonPath("$").exists())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].entityId").value(visitorDto.getEntityId()))
                .andExpect(jsonPath("$[0].name").value(is(visitorDto.getName())))
                .andExpect(jsonPath("$[0].type").value(visitorDto.getType().toString()))
                .andExpect(jsonPath("$[0].deviceId").value(is(visitorDto.getDeviceId())));
    }

    /**
     * Drops all the data after test.
     */
    @After
    public void drop() {
        visitorHistoryService.deleteAllPositionHistory();
    }
}
