package com.epam.beacons.cloud.monitor.service.service;

import com.epam.beacons.cloud.monitor.service.domain.DeviceType;
import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.domain.RawReaderData;
import com.epam.beacons.cloud.monitor.service.domain.ReaderDto;
import com.epam.beacons.cloud.monitor.service.domain.TrilaterationData;
import com.epam.beacons.cloud.monitor.service.domain.Visitor;
import com.epam.beacons.cloud.monitor.service.feign.ReaderRemoteService;
import com.epam.beacons.cloud.monitor.service.repository.VisitorRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Service;

/**
 * TrilaterationService implementation.
 **/
@Service
public class TrilaterationService {

    private final TrilaterationSolver trilaterationSolver;
    private final VisitorRepository visitorRepository;
    private final VisitorHistoryService visitorHistoryService;
    private final ReaderRemoteService readerRemoteService;

    private final ConsumerFactory<Integer, RawReaderData> readerConsumerFactory;
    private final ConsumerFactory<String, FlatBeaconPositionDto> mobileConsumerFactory;

    private KafkaMessageListenerContainer<Integer, RawReaderData> readerContainer;
    private KafkaMessageListenerContainer<String, FlatBeaconPositionDto> mobileContainer;

    private final Object readerLock = new Object();
    private final Object mobileLock = new Object();
    private final Object mapLock = new Object();
    private final Map<String, List<RawReaderData>> rawDataByDeviceId = new HashMap<>();

    public TrilaterationService(
            TrilaterationSolver trilaterationSolver, ConsumerFactory<Integer, RawReaderData> readerConsumerFactory,
            VisitorRepository visitorRepository, VisitorHistoryService visitorHistoryService,
            ConsumerFactory<String, FlatBeaconPositionDto> mobileConsumerFactory,
            ReaderRemoteService readerRemoteService
    ) {
        this.trilaterationSolver = trilaterationSolver;
        this.readerConsumerFactory = readerConsumerFactory;
        this.mobileConsumerFactory = mobileConsumerFactory;
        this.visitorRepository = visitorRepository;
        this.visitorHistoryService = visitorHistoryService;
        this.readerRemoteService = readerRemoteService;
        updateTopics();
    }


    /** Gets all {@link Visitor} from MongoDB and extracts their {@link Visitor#getDeviceId()}.
     * Based on the type of the {@link Visitor#getType()}, two lists of {@link Visitor#getDeviceId()}
     * are created, which are transmitted as a list of topics to the corresponding listeners. The previous Kafka
     * listeners is deleted and new Kafka listeners are created from the new topics.
     * Data from {@link DeviceType#RECEIVER}, that comes from mobile app received as {@link FlatBeaconPositionDto} and
     * saved to MongoDB.
     * The listeners of topics related to {@link DeviceType#EMITTER} get data from corresponding Kafka producers and
     * incoming {@link RawReaderData} is transformed into {@link FlatBeaconPositionDto} and saved to MongoDB.
     */
    public void updateTopics() {
        Collection<Visitor> visitors = visitorRepository.findAll();
        Collection<String> readerTopics = visitors.stream()
                .filter(deviceType -> deviceType.getType().equals(DeviceType.EMITTER))
                .map(Visitor::getDeviceId)
                .collect(Collectors.toSet());
        Collection<String> mobileTopics = visitors.stream()
                .filter(deviceType -> deviceType.getType().equals(DeviceType.RECEIVER))
                .map(Visitor::getDeviceId)
                .collect(Collectors.toSet());
        if (!readerTopics.isEmpty()) {
            synchronized (readerLock) {
                if (readerContainer != null && readerContainer.isRunning()) {
                    readerContainer.stop();
                }
                readerContainer = createContainer(readerConsumerFactory, this::processReaderData, readerTopics);
            }
        }
        if (!mobileTopics.isEmpty()) {
            synchronized (mobileLock) {
                if (mobileContainer != null && mobileContainer.isRunning()) {
                    mobileContainer.stop();
                }
                mobileContainer = createContainer(mobileConsumerFactory, this::processMobileData, mobileTopics);
            }
        }
    }

    private <K, T> KafkaMessageListenerContainer<K, T> createContainer(
            ConsumerFactory<K, T> factory, Consumer<T> messageConsumer, Collection<String> topicNames
    ) {
        ContainerProperties containerProps = new ContainerProperties(topicNames.toArray(new String[0]));
        containerProps.setMessageListener(
                (MessageListener<?, T>) message -> messageConsumer.accept(message.value())
        );
        KafkaMessageListenerContainer<K, T> result = new KafkaMessageListenerContainer<>(factory, containerProps);
        result.start();
        return result;
    }

    private void processReaderData(RawReaderData rawReaderData) {
        if (rawReaderData != null) {
            synchronized (mapLock) {
                String deviceId = rawReaderData.getDeviceId();
                List<RawReaderData> rawDataList = rawDataByDeviceId.computeIfAbsent(deviceId, s -> new ArrayList<>());
                rawDataList.add(rawReaderData);
                if (rawDataList.size() == 5) {
                    try {
                        visitorHistoryService.save(calculatePosition(rawDataList));
                    } finally {
                        rawDataList.clear();
                    }
                }
            }
        }
    }

    private void processMobileData(FlatBeaconPositionDto flatBeaconPositionDto) {
        if (flatBeaconPositionDto != null) {
            visitorHistoryService.save(flatBeaconPositionDto);
        }
    }

    private FlatBeaconPositionDto calculatePosition(List<RawReaderData> rawDataList) {
        List<TrilaterationData> trilaterationDataList = new ArrayList<>();
        for (RawReaderData data : rawDataList) {
            ReaderDto readerDto = readerRemoteService.findByUuid(data.getReaderUuid());
            TrilaterationData trilaterationData = new TrilaterationData(
                    data.getRssi(), data.getReferencePower(), readerDto.getLatitude(), readerDto.getLongitude()
            );
            trilaterationDataList.add(trilaterationData);
        }
        RawReaderData last = rawDataList.get(rawDataList.size() - 1);
        String levelId = computeLevelId(rawDataList);
        return createFlatBeaconPositionDto(trilaterationDataList, levelId, last);
    }

    private FlatBeaconPositionDto createFlatBeaconPositionDto(
            List<TrilaterationData> trilaterationDataList, String levelId, RawReaderData data
    ) {
        double[] coordinate = trilaterationSolver.trilaterate(trilaterationDataList);

        FlatBeaconPositionDto beaconPositionDto = new FlatBeaconPositionDto();
        beaconPositionDto.setLatitude(coordinate[0]);
        beaconPositionDto.setLongitude(coordinate[1]);
        beaconPositionDto.setLevelId(levelId);
        beaconPositionDto.setDeviceId(data.getDeviceId());
        beaconPositionDto.setTimestamp(data.getTimestamp());
        beaconPositionDto.setHeartRate(data.getHeartRate());
        beaconPositionDto.setBodyTemperature(data.getBodyTemperature());
        beaconPositionDto.setStepCount(data.getStepCount());
        return beaconPositionDto;
    }

    /**
     * Computes level id based on nearest Reader's level id. The level can be computed incorrectly if the visitor is
     * next to the reader, which is located on another level.
     */
    private String computeLevelId(List<RawReaderData> rawDataList) {
        RawReaderData rawReaderDataWithLeastDistance = null;
        double leastDistance = Double.MAX_VALUE;
        for (RawReaderData data : rawDataList) {
            double distance = trilaterationSolver.computeDistance(data.getReferencePower(), data.getRssi());
            if (distance < leastDistance) {
                rawReaderDataWithLeastDistance = data;
                leastDistance = distance;
            }
        }
        ReaderDto readerDto = readerRemoteService.findByUuid(rawReaderDataWithLeastDistance.getReaderUuid());
        return readerDto.getLevelId();
    }
}

