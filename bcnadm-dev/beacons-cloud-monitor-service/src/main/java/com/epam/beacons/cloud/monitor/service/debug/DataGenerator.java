package com.epam.beacons.cloud.monitor.service.debug;

import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.service.VisitorGroupService;
import com.epam.beacons.cloud.monitor.service.service.VisitorHistoryService;
import com.epam.beacons.cloud.monitor.service.service.VisitorService;
import java.awt.geom.Point2D;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.geotools.referencing.GeodeticCalculator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(value = "beacons.cloud.debug-mode.enabled", havingValue = "true")
public class DataGenerator {

    private static final Random rand = new Random();

    private final ExecutorService executorService;
    private final VisitorHistoryService visitorHistoryService;
    private final GenerationProperties generationProperties;
    private final VisitorGroupService visitorGroupService;
    private final VisitorService visitorService;

    public DataGenerator(
            GenerationProperties generationProperties, VisitorHistoryService visitorHistoryService,
            VisitorGroupService visitorGroupService, VisitorService visitorService
    ) {
        this.executorService = Executors.newSingleThreadExecutor();
        this.generationProperties = generationProperties;
        this.visitorHistoryService = visitorHistoryService;
        this.visitorGroupService = visitorGroupService;
        this.visitorService = visitorService;
    }

    /**
     * Listens for context updates.
     *
     * @param event event
     */
    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        start();
    }

    /**
     * Start data generation.
     */
    private void start() {
        executorService.execute(() -> {
            try {
                generatePosition();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
    }

    /**
     * Generates position and other data, then saves to the database.
     */
    private void generatePosition() throws InterruptedException {
        GeodeticCalculator geodeticCalculator = new GeodeticCalculator();
        geodeticCalculator
                .setStartingGeographicPoint(generationProperties.getLongitude(), generationProperties.getLatitude());
        Point2D coordinates = geodeticCalculator.getStartingGeographicPoint();
        String visitorId = visitorGroupService.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Visitor groups not found")).getVisitorIds().stream()
                .findFirst().orElseThrow(() -> new RuntimeException("Visitors in the visitor group not found"));
        int stepCounter = 0;
        while (true) {
            FlatBeaconPositionDto flatBeaconPositionDto = new FlatBeaconPositionDto();
            flatBeaconPositionDto.setTimestamp(LocalDateTime.now());
            flatBeaconPositionDto.setLevelId(generationProperties.getLevelId());
            flatBeaconPositionDto.setDeviceId(visitorService.findOne(visitorId).getDeviceId());
            flatBeaconPositionDto.setLatitude(coordinates.getY());
            flatBeaconPositionDto.setLongitude(coordinates.getX());
            flatBeaconPositionDto.setHeartRate(60 + (rand.nextInt(40) + 1));
            flatBeaconPositionDto.setBodyTemperature(36.6);
            flatBeaconPositionDto.setStepCount(stepCounter);
            stepCounter = stepCounter + 2;
            visitorHistoryService.save(flatBeaconPositionDto);
            geodeticCalculator.setDirection(rand.nextDouble() * 360, 1);
            coordinates = geodeticCalculator.getDestinationGeographicPoint();
            Thread.sleep(generationProperties.getPeriod());
        }
    }
}
