package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.Area;
import com.epam.beacons.cloud.service.building.domain.DomainObject;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.LevelDto;
import com.epam.beacons.cloud.service.building.domain.Vertex;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.mapper.VertexMapper;
import com.epam.beacons.cloud.service.building.repository.AreaRepository;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.repository.LevelRepository;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.bson.types.ObjectId;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.referencing.GeodeticCalculator;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Implementation for vertex service.
 */
@Service
public class VertexService {

    private static final String LEVEL_WAS_NOT_PROVIDED = "LevelDto wasn't provided";
    private static final String EDGE_WAS_NOT_PROVIDED = "EdgeDto wasn't provided";
    private static final String VERTEX_DTO_NOT_PROVIDED = "VertexDto wasn't provided";
    private static final String VERTEX_WAS_NOT_FOUND = "VertexDto wasn't found";
    private static final String INCORRECT_LEVEL_ID = "Incorrect level id";
    private static final String LEVEL_ID_WAS_NOT_PROVIDED = "Level id wasn't provided";
    private static final String INCORRECT_VERTEX_ID = "Incorrect vertex id";
    private static final String GRAPH_WAS_NOT_FOUND = "Graph was not found";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");

    private final AreaRepository areaRepository;
    private final LevelRepository levelRepository;
    private final GraphRepository graphRepository;
    private final MongoTemplate mongoTemplate;

    public VertexService(
            AreaRepository areaRepository, LevelRepository levelRepository, GraphRepository graphRepository,
            MongoTemplate mongoTemplate
    ) {
        this.areaRepository = areaRepository;
        this.levelRepository = levelRepository;
        this.graphRepository = graphRepository;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Find all vertices.
     *
     * @return collection of VertexDto
     */
    public Collection<VertexDto> findAll() {
        return graphRepository.findAllWithVertices().stream()
                .flatMap(graph -> graph.getVertices().stream())
                .map(VertexMapper.INSTANCE::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find all vertices on provided level.
     *
     * @param level level to search vertices.
     * @return collection of vertices
     */
    public Collection<VertexDto> findAll(LevelDto level) {
        if (level == null) {
            throw new EntityNotFoundException(LEVEL_WAS_NOT_PROVIDED);
        }
        return findAllByLevelId(level.getEntityId()).stream()
                .map(VertexMapper.INSTANCE::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find VertexDto by vertex id.
     *
     * @param vertexId vertex id
     * @return found VertexDto
     */
    public VertexDto findOne(String vertexId) {
        if (!StringUtils.hasText(vertexId)) {
            throw new EntityNotFoundException(VERTEX_DTO_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(vertexId).matches()) {
            throw new IllegalArgumentException(INCORRECT_VERTEX_ID);
        }
        GraphEntity graph = graphRepository.findOneByVertexIdWithVertices(vertexId)
                .orElseThrow(() -> new EntityNotFoundException(GRAPH_WAS_NOT_FOUND));
        return graph.getVertices().stream()
                .filter(vertex -> vertex.getId().equals(vertexId))
                .map(VertexMapper.INSTANCE::entityToDto)
                .findFirst().orElseThrow(() -> new EntityNotFoundException(VERTEX_WAS_NOT_FOUND));
    }

    /**
     * Save VertexDto.
     *
     * @param vertexDto VertexDto to save
     * @return saved VertexDto
     */
    public VertexDto save(final VertexDto vertexDto) {
        if (vertexDto == null) {
            throw new EntityNotFoundException(VERTEX_DTO_NOT_PROVIDED);
        }
        vertexDto.setEntityId(ObjectId.get().toHexString());
        String buildingId = levelRepository.findById(vertexDto.getLevelId())
                .orElseThrow(() -> new IllegalArgumentException("Level not found"))
                .getBuildingId();
        GraphEntity graph = mongoTemplate.findAndModify(
                new Query().addCriteria(Criteria.where("buildingId").is(buildingId)),
                new Update().push("vertices", VertexMapper.INSTANCE.dtoToEntity(vertexDto)),
                new FindAndModifyOptions().returnNew(true),
                GraphEntity.class
        );
        if (graph == null) {
            throw new EntityNotFoundException(GRAPH_WAS_NOT_FOUND);
        }
        return graph.getVertices().stream()
                .filter(vertex -> vertex.getId().equals(vertexDto.getEntityId()))
                .map(VertexMapper.INSTANCE::entityToDto)
                .findFirst().orElseThrow(() -> new EntityNotFoundException(VERTEX_WAS_NOT_FOUND));
    }

    /**
     * Update VertexDto.
     *
     * @param vertexDto VertexDto to update
     * @return updated VertexDto
     */
    public VertexDto update(final VertexDto vertexDto) {
        if (vertexDto == null) {
            throw new EntityNotFoundException(VERTEX_DTO_NOT_PROVIDED);
        }
        GraphEntity graph = mongoTemplate.findAndModify(
                new Query(Criteria.where("vertices.id").is(vertexDto.getEntityId())),
                new Update()
                        .set("vertices.$", VertexMapper.INSTANCE.dtoToEntity(vertexDto))
                        .filterArray(Criteria.where("id").is(vertexDto.getEntityId())),
                new FindAndModifyOptions().returnNew(true),
                GraphEntity.class
        );
        if (graph == null) {
            throw new EntityNotFoundException(VERTEX_WAS_NOT_FOUND);
        }
        return graph.getVertices().stream()
                .filter(vertex -> vertex.getId().equals(vertexDto.getEntityId()))
                .map(VertexMapper.INSTANCE::entityToDto)
                .findFirst().orElseThrow(() -> new EntityNotFoundException(VERTEX_WAS_NOT_FOUND));
    }

    /**
     * Delete VertexDto.
     *
     * @param vertexDto VertexDto to delete
     */
    public void delete(final VertexDto vertexDto) {
        if (vertexDto == null) {
            throw new EntityNotFoundException(VERTEX_DTO_NOT_PROVIDED);
        }
        mongoTemplate.updateFirst(
                new Query(),
                new Update().pull("vertices", Query.query(Criteria.where("id").is(vertexDto.getEntityId())))
                        .pull("edges", Query.query(new Criteria().orOperator(
                                Criteria.where("startVertexId").is(vertexDto.getEntityId()),
                                Criteria.where("endVertexId").is(vertexDto.getEntityId())))),
                "graphs"
        );
    }

    /**
     * Delete all Vertices.
     */
    public void deleteAll() {
        mongoTemplate.updateMulti(
                new Query(),
                new Update().set("vertices", Collections.EMPTY_LIST).set("edges", Collections.EMPTY_LIST),
                "graphs");
    }

    /**
     * Delete all vertices from level.
     *
     * @param levelId level id to delete
     */
    public void deleteAll(String levelId) {
        if (levelId == null) {
            throw new IllegalArgumentException(LEVEL_ID_WAS_NOT_PROVIDED);
        }
        if (!OBJECT_ID_PATTERN.matcher(levelId).matches()) {
            throw new IllegalArgumentException(INCORRECT_LEVEL_ID);
        }
        Collection<String> vertexIds = findAllByLevelId(levelId).stream()
                .map(DomainObject::getId)
                .collect(Collectors.toList());
        deleteEdges(vertexIds);
        Query query = new Query();
        query.addCriteria(Criteria.where("levelId").is(levelId));
        mongoTemplate.updateMulti(new Query(), new Update().pull("vertices", query), "graphs");
    }

    /**
     * Returns collection of start and end vertex of edge.
     *
     * @param edgeDto edge that has vertices.
     * @return collection of start and end vertex. If start vertex == end vertex it returns collection with one
     *         element.
     */
    public Collection<VertexDto> findAllByEdge(EdgeDto edgeDto) {
        if (edgeDto == null) {
            throw new EntityNotFoundException(EDGE_WAS_NOT_PROVIDED);
        }
        Collection<VertexDto> result = new ArrayList<>();
        GraphEntity graph = graphRepository.findOneByStartVertexIdWithVertices(edgeDto.getStartVertexId())
                .orElseThrow(() -> new EntityNotFoundException(GRAPH_WAS_NOT_FOUND));
        result.add(graph.getVertices().stream()
                .filter(vertex -> vertex.getId().equals(edgeDto.getStartVertexId()))
                .map(VertexMapper.INSTANCE::entityToDto)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(VERTEX_WAS_NOT_FOUND)));
        if (!edgeDto.getStartVertexId().equals(edgeDto.getEndVertexId())) {
            result.add(graph.getVertices().stream()
                    .filter(vertex -> vertex.getId().equals(edgeDto.getEndVertexId()))
                    .map(VertexMapper.INSTANCE::entityToDto)
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException(VERTEX_WAS_NOT_FOUND)));
        }
        return result;
    }

    private void deleteEdges(Collection<String> vertexIds) {
        Query query = new Query();
        query.addCriteria(new Criteria().orOperator(Criteria.where("startVertexId").in(vertexIds),
                Criteria.where("endVertexId").in(vertexIds)));
        mongoTemplate.updateMulti(new Query(), new Update().pull("edges", query), GraphEntity.class);
    }

    /**
     * Returns collection of vertexDto found inside provided area.
     *
     * @param areaId provided area id
     * @return collection of vertexDto
     */
    public Collection<VertexDto> findAllInsideArea(String areaId) {
        Area area = areaRepository.findById(areaId).orElseThrow(() -> new EntityNotFoundException("Area wasn't found"));
        GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
        List<Coordinate> coordinates = area.getCoordinates().stream()
                .map(coordinate -> new Coordinate(coordinate.getLatitude(), coordinate.getLongitude()))
                .collect(Collectors.toList());
        coordinates.add(coordinates.get(0));
        Polygon polygon = geometryFactory.createPolygon(coordinates.toArray(new Coordinate[0]));
        Collection<Vertex> vertices = findAllByLevelId(area.getLevelId());
        Collection<VertexDto> verticesInsideArea = new ArrayList<>(Collections.emptyList());
        for (Vertex vertex : vertices) {
            Coordinate coordinate = new Coordinate(vertex.getLatitude(), vertex.getLongitude());
            Point point = geometryFactory.createPoint(coordinate);
            if (polygon.contains(point)) {
                verticesInsideArea.add(VertexMapper.INSTANCE.entityToDto(vertex));
            }
        }
        return verticesInsideArea;
    }

    /**
     * Returns nearest VertexDto to specified location on specified level.
     *
     * @param latitude specified location latitude
     * @param longitude specified location longitude
     * @param levelId specified level id
     * @return nearest vertexDto
     */
    public VertexDto findNearestVertex(double latitude, double longitude, String levelId) {
        Collection<Vertex> vertices = findAllByLevelId(levelId);
        GeodeticCalculator calculator = new GeodeticCalculator();
        calculator.setStartingGeographicPoint(latitude, longitude);
        return vertices.stream()
                .min(Comparator.comparingDouble(vertex -> getDistance(vertex, calculator)))
                .map(VertexMapper.INSTANCE::entityToDto)
                .orElse(null);
    }

    private double getDistance(Vertex vertex, GeodeticCalculator calculator) {
        calculator.setDestinationGeographicPoint(vertex.getLatitude(), vertex.getLongitude());
        return calculator.getOrthodromicDistance();
    }

    private Collection<Vertex> findAllByLevelId(String levelId) {
        GraphEntity graph = graphRepository.findOneByLevelIdWithVertices(levelId)
                .orElse(null);
        if (graph == null) {
            return Collections.emptyList();
        }
        return graph.getVertices().stream()
                .filter(vertex -> vertex.getLevelId().equals(levelId))
                .collect(Collectors.toList());
    }
}
