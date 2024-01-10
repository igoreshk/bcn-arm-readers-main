package com.epam.beacons.cloud.monitor.service.service;

import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPosition;
import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorDto;
import com.epam.beacons.cloud.monitor.service.domain.VisitorGroupDto;
import com.epam.beacons.cloud.monitor.service.feign.AreaRemoteService;
import com.epam.beacons.cloud.monitor.service.mapper.FlatBeaconPositionMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class VisitorHistoryService {

    private static final String START_TIME_MUST_BE_INSIDE_HISTORY_PERIOD = "Start time parameter must be inside history period";
    private static final String END_TIME_PARAMETER_MUST_BE_INSIDE_HISTORY_PERIOD = "End time parameter must be inside history period";
    private static final String LATEST_POSITIONS = "latest_positions";
    private static final String POSITION_HISTORY = "position_history";
    private static final String ALL_POSITIONS = "retrospective";
    private static final String CRITERIA_DEVICE_ID = "deviceId";
    private static final String CRITERIA_TIMESTAMP = "timestamp";
    private static final String CRITERIA_LATITUDE = "latitude";
    private static final String CRITERIA_LONGITUDE = "longitude";
    private static final String CRITERIA_LEVEL_ID = "levelId";
    private final long period;

    private final MongoTemplate mongoTemplate;
    private final VisitorService visitorService;
    private final VisitorGroupService visitorGroupService;
    private final AreaRemoteService areaRemoteService;
    private final FlatBeaconPositionMapper mapper = Mappers.getMapper(FlatBeaconPositionMapper.class);

    public VisitorHistoryService(
            MongoTemplate mongoTemplate, @Lazy VisitorService visitorService, VisitorGroupService visitorGroupService,
            AreaRemoteService areaRemoteService, @Value("${history.period:14}") long period
    ) {
        this.mongoTemplate = mongoTemplate;
        this.visitorService = visitorService;
        this.visitorGroupService = visitorGroupService;
        this.areaRemoteService = areaRemoteService;
        this.period = period;
    }

    public FlatBeaconPositionDto save(FlatBeaconPositionDto flatBeaconPositionDto) {
        Query query = new Query();
        query.addCriteria(Criteria.where(CRITERIA_DEVICE_ID).is(flatBeaconPositionDto.getDeviceId()));
        mongoTemplate.remove(query, FlatBeaconPosition.class, LATEST_POSITIONS);

        Query queryPosition = new Query();
        LocalDateTime start = LocalDateTime.now().minusDays(period);
        queryPosition.addCriteria(Criteria.where(CRITERIA_TIMESTAMP).lt(start));
        mongoTemplate.remove(queryPosition, FlatBeaconPosition.class, POSITION_HISTORY);

        FlatBeaconPosition position = mapper.dtoToEntity(flatBeaconPositionDto);
        mongoTemplate.save(position, LATEST_POSITIONS);
        mongoTemplate.save(position, POSITION_HISTORY);
        FlatBeaconPosition saved = mongoTemplate.save(position, ALL_POSITIONS);
        return mapper.entityToDto(saved);
    }

    /**
     * Find history of visits by visitorId.
     *
     * @param visitorId visitor id
     * @param start time of first visit entry
     * @param end time of last visit entry
     * @return list of FlatBeaconPositionDto
     */
    public List<FlatBeaconPositionDto> getVisitorHistory(String visitorId, LocalDateTime start, LocalDateTime end) {
        LocalDateTime rangeStart = LocalDateTime.now().minusDays(period);
        if (start == null) {
            start = rangeStart;
        }
        if (start.isBefore(rangeStart)) {
            throw new IllegalArgumentException(START_TIME_MUST_BE_INSIDE_HISTORY_PERIOD);
        }
        return findPositions(visitorId, start, end, POSITION_HISTORY, null);
    }

    /**
     * Find history of visits by visitorId sorted by time.
     *
     * @param visitorId visitor id
     * @param start time of first visit entry
     * @param end time of last visit entry
     * @return list of FlatBeaconPositionDto
     */
    public List<FlatBeaconPositionDto> getSortedVisitorHistory(
            String visitorId, LocalDateTime start, LocalDateTime end
    ) {
        return findPositions(visitorId, start, end, ALL_POSITIONS, Direction.DESC);
    }

    private List<FlatBeaconPositionDto> findPositions(
            String visitorId, LocalDateTime start, LocalDateTime end, String collection, Sort.Direction direction
    ) {
        Query query = new Query();
        addTimeFilter(query, start, end);
        VisitorDto visitorDto = visitorService.findOne(visitorId);
        query.addCriteria(Criteria.where(CRITERIA_DEVICE_ID).is(visitorDto.getDeviceId()));
        if (direction != null) {
            query.with(Sort.by(direction, CRITERIA_TIMESTAMP));
        }
        List<FlatBeaconPosition> flatBeaconPositions = mongoTemplate.find(query, FlatBeaconPosition.class, collection);
        List<FlatBeaconPositionDto> flatBeaconPositionDtos = new ArrayList<>();
        for (FlatBeaconPosition flatBeaconPosition : flatBeaconPositions) {
            FlatBeaconPositionDto flatBeaconPositionDto = mapper.entityToDto(flatBeaconPosition);
            flatBeaconPositionDto.setName(visitorDto.getName());
            flatBeaconPositionDtos.add(flatBeaconPositionDto);
        }
        return flatBeaconPositionDtos;
    }

    /**
     * Returns all updates for specified visitorGroup for exact location.
     *
     * @param visitorGroupId visitorGroup ID
     * @param levelId level ID
     * @return collection of updates
     */
    public Collection<FlatBeaconPositionDto> getVisitorGroupHistory(
            @NotNull String visitorGroupId, @NotNull String levelId
    ) {
        VisitorGroupDto visitorGroupDto = visitorGroupService.findOne(visitorGroupId);

        List<FlatBeaconPositionDto> result = new ArrayList<>();
        for (String visitorId : visitorGroupDto.getVisitorIds()) {
            VisitorDto visitorDto = visitorService.findOne(visitorId);
            Query query = new Query();
            query.addCriteria(
                    Criteria.where(CRITERIA_DEVICE_ID).is(visitorDto.getDeviceId())
                            .and(CRITERIA_LEVEL_ID).is(levelId)
            );
            FlatBeaconPosition position = mongoTemplate.findOne(query, FlatBeaconPosition.class, LATEST_POSITIONS);
            if (position != null) {
                FlatBeaconPositionDto flatBeaconPositionDto = mapper.entityToDto(position);
                flatBeaconPositionDto.setName(visitorDto.getName());
                result.add(flatBeaconPositionDto);
            }
        }
        return result;
    }

    public void deleteAllPositionHistory() {
        mongoTemplate.remove(new Query(), FlatBeaconPosition.class, POSITION_HISTORY);
        mongoTemplate.remove(new Query(), FlatBeaconPosition.class, LATEST_POSITIONS);
        mongoTemplate.remove(new Query(), FlatBeaconPosition.class, ALL_POSITIONS);
    }

    /**
     * Returns all visitors for specified area filtered by date and time.
     *
     * @param areaId area id
     * @param start time of first visit entry
     * @param end time of last visit entry
     * @return list of VisitorDto
     */
    public Collection<VisitorDto> getVisitorsByArea(String areaId, LocalDateTime start, LocalDateTime end) {
        Query query = new Query();
        addTimeFilter(query, start, end);
        addCoordinateFilter(query, getPolygon(areaId));
        List<FlatBeaconPosition> positions = new ArrayList<>(mongoTemplate.find(query, FlatBeaconPosition.class));
        return findDevicesInsideArea(positions, areaId).stream()
                .map(visitorService::findByDeviceId)
                .collect(Collectors.toSet());
    }

    private Collection<String> findDevicesInsideArea(List<FlatBeaconPosition> positions, String areaId) {
        Polygon polygon = getPolygon(areaId);
        Collection<String> deviceIdSet = new HashSet<>();
        for (FlatBeaconPosition position : positions) {
            Coordinate coordinate = new Coordinate(position.getLongitude(), position.getLatitude());
            Point point = JTSFactoryFinder.getGeometryFactory().createPoint(coordinate);
            if (polygon.contains(point)) {
                deviceIdSet.add(position.getDeviceId());
            }
        }
        return deviceIdSet;
    }

    private Polygon getPolygon(String areaId) {
        List<Coordinate> coordinates = areaRemoteService.getCoordinates(areaId).stream()
                .map(coordinate -> new Coordinate(coordinate.getLongitude(), coordinate.getLatitude()))
                .collect(Collectors.toList());
        coordinates.add(coordinates.get(0));
        return JTSFactoryFinder.getGeometryFactory().createPolygon(coordinates.toArray(new Coordinate[0]));
    }

    private void addCoordinateFilter(Query query, Polygon polygon) {
        Envelope envelop = polygon.getEnvelopeInternal();
        query.addCriteria(Criteria.where(CRITERIA_LATITUDE)
                .gte(envelop.getMinY()).lte(envelop.getMaxY())
                .and(CRITERIA_LONGITUDE).gte(envelop.getMinX()).lte(envelop.getMaxX()));
    }

    private void addTimeFilter(Query query, LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null) {
            if (!end.isAfter(start)) {
                throw new IllegalArgumentException(END_TIME_PARAMETER_MUST_BE_INSIDE_HISTORY_PERIOD);
            } else {
                query.addCriteria(Criteria.where(CRITERIA_TIMESTAMP).gte(start).lte(end));
            }
        } else if (start != null) {
            query.addCriteria(Criteria.where(CRITERIA_TIMESTAMP).gte(start));
        } else if (end != null) {
            query.addCriteria(Criteria.where(CRITERIA_TIMESTAMP).lte(end));
        }
    }
}
