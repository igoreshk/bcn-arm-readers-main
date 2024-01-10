package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.Building;
import com.epam.beacons.cloud.service.building.domain.BuildingDto;
import com.epam.beacons.cloud.service.building.domain.Edge;
import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.Level;
import com.epam.beacons.cloud.service.building.domain.Vertex;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import com.epam.beacons.cloud.service.building.graph.Graph;
import com.epam.beacons.cloud.service.building.mapper.EdgeMapper;
import com.epam.beacons.cloud.service.building.mapper.EntityToDtoMapper;
import com.epam.beacons.cloud.service.building.mapper.LevelMapper;
import com.epam.beacons.cloud.service.building.repository.BuildingRepository;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.repository.LevelRepository;
import com.epam.beacons.cloud.service.building.repository.ReaderRepository;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import org.geotools.referencing.GeodeticCalculator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

/**
 * Building service implementation.
 */
@Service
public class BuildingService extends ServiceCrudSupport<BuildingDto, Building, BuildingRepository> {

    public static final String UNSUPPORTED_IMAGE_FORMAT = "Format of the original image is not supported";
    public static final String IMAGE_IS_EMPTY = "Image is empty";
    public static final String IMAGE_IS_OVERSIZED = "Image is oversized, it should not exceed 1 MB";
    public static final int IMAGE_BYTES_LIMIT = 1 << 20;
    private static final String BUILDING_ALREADY_EXISTS = "Building with such name or address already exists";
    private static final String BUILDING_CAN_NOT_BE_REMOVED = "Impossible to delete building because it has readers";
    private static final String BUILDING_WAS_NOT_FOUND = "Building was not found";
    private static final String VERTEX_WAS_NOT_FOUND = "Vertex was not found";
    private static final String GRAPH_WAS_NOT_FOUND = "Graph with such building id was not found";

    private static final double DISTANCE_BETWEEN_LEVELS = 3.0;

    private final LevelRepository levelRepository;
    private final ReaderRepository readerRepository;
    private final GraphRepository graphRepository;
    private final LevelService levelService;
    private final List<String> validImageFormats;

    public BuildingService(
            BuildingRepository buildingRepository,
            EntityToDtoMapper<BuildingDto, Building> mapper,
            LevelRepository levelRepository,
            ReaderRepository readerRepository,
            GraphRepository graphRepository,
            LevelService levelService,
            @Value("${beacons.cloud.building.valid-image-formats}") List<String> validImageFormats
    ) {
        super(mapper, buildingRepository);
        this.levelRepository = levelRepository;
        this.readerRepository = readerRepository;
        this.graphRepository = graphRepository;
        this.levelService = levelService;
        this.validImageFormats = validImageFormats;
    }

    /**
     * Find all buildings created by user.
     *
     * @param createdBy user id to get all buildings for
     * @return list of created buildings
     */
    public Collection<BuildingDto> findAll(String createdBy) {
        return getMongoRepository().findAllByCreatedBy(createdBy).stream().map(getMapper()::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public BuildingDto save(BuildingDto buildingDto) {
        if (buildingDto.getEntityId() != null) {
            throw new IllegalArgumentException("Entity id shouldn't be specified explicitly");
        }
        try {
            return super.save(buildingDto);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(BUILDING_ALREADY_EXISTS, ex);
        }
    }

    /**
     * Update building.
     *
     * @param buildingDto building dto
     * @return building dto
     */
    @Override
    public BuildingDto update(BuildingDto buildingDto) {
        try {
            return super.update(buildingDto);
        } catch (DuplicateKeyException ex) {
            throw new NonUniqueValueException(BUILDING_ALREADY_EXISTS, ex);
        }
    }

    @Override
    public void delete(BuildingDto buildingDto) {
        if (hasReaders(buildingDto)) {
            throw new IllegalArgumentException(BUILDING_CAN_NOT_BE_REMOVED);
        }
        super.delete(buildingDto);
        levelRepository.findAllByBuildingId(buildingDto.getEntityId())
                .forEach(level -> levelService.delete(LevelMapper.INSTANCE.entityToDto(level)));
        graphRepository.deleteByBuildingId(buildingDto.getEntityId());
    }

    private boolean hasReaders(BuildingDto buildingDto) {
        for (Level level : levelRepository.findAllByBuildingId(buildingDto.getEntityId())) {
            if (!readerRepository.findAllByLevelId(level.getId()).isEmpty()) {
                return true;
            }
        }
        return false;
    }

    @Override
    public void deleteAll() {
        findAll().forEach(this::delete);
    }

    /**
     * Gets building.
     *
     * @param entityId to find
     * @return building
     */
    public Building getBuilding(String entityId) {
        Optional<Building> buildingOptional = getMongoRepository().findById(entityId);
        if (!buildingOptional.isPresent()) {
            throw new EntityNotFoundException(BUILDING_WAS_NOT_FOUND);
        }
        return buildingOptional.get();
    }

    /**
     * Saves image for building.
     *
     * @param entityId building's id that uses image
     * @param imageAsByteArray image for building
     */
    public void saveImage(String entityId, byte[] imageAsByteArray) throws IOException {
        if (imageAsByteArray == null || imageAsByteArray.length <= 0) {
            throw new IllegalArgumentException(IMAGE_IS_EMPTY);
        }
        if (imageAsByteArray.length > IMAGE_BYTES_LIMIT) {
            throw new IllegalArgumentException(IMAGE_IS_OVERSIZED);
        }
        Optional<Building> buildingOptional = getMongoRepository().findById(entityId);
        if (!buildingOptional.isPresent()) {
            throw new EntityNotFoundException(BUILDING_WAS_NOT_FOUND);
        }
        Building building = buildingOptional.get();
        building.setImageAsByteArray(imageAsByteArray);
        String mimeType = getMimeType(imageAsByteArray);
        building.setMimeType(mimeType);
        getMongoRepository().save(building);
    }

    @Override
    public BuildingDto findOne(String entityId) {
        BuildingDto buildingDto = super.findOne(entityId);
        if (buildingDto == null) {
            throw new EntityNotFoundException(BUILDING_WAS_NOT_FOUND);
        }
        return buildingDto;
    }

    private String getMimeType(byte[] imageAsByteArray) throws IOException {

        Iterator<ImageReader> imageReaders;
        try (ImageInputStream imageInputStream =
                    ImageIO.createImageInputStream(new ByteArrayInputStream(imageAsByteArray))) {
            imageReaders = ImageIO.getImageReaders(imageInputStream);
        }

        String formatName;
        if (imageReaders.hasNext()) {
            ImageReader imageReader = imageReaders.next();
            formatName = imageReader.getFormatName();
        } else {
            throw new IllegalArgumentException(UNSUPPORTED_IMAGE_FORMAT);
        }
        if (validImageFormats.contains(formatName.toLowerCase())) {
            return ("image/" + formatName.toLowerCase());
        } else {
            throw new IllegalArgumentException(UNSUPPORTED_IMAGE_FORMAT);
        }
    }

    /**
     * Calculates the shortest path by building id and 2 given vertex ids.
     *
     * @param buildingId building id
     * @param startVertexId start vertex id
     * @param endVertexId destination vertex id
     * @return list of edges from start Vertex to destination Vertex
     */
    public List<EdgeDto> getShortestPath(String buildingId, String startVertexId, String endVertexId) {
        GraphEntity graphEntity = graphRepository.findByBuildingId(buildingId)
                .orElseThrow(() -> new EntityNotFoundException(GRAPH_WAS_NOT_FOUND));
        Vertex startVertex = null;
        Vertex endVertex = null;
        for (Vertex vertex : graphEntity.getVertices()) {
            if (vertex.getId().equals(startVertexId)) {
                startVertex = vertex;
            }
            if (vertex.getId().equals(endVertexId)) {
                endVertex = vertex;
            }
        }
        if (startVertex == null || endVertex == null) {
            throw new EntityNotFoundException(VERTEX_WAS_NOT_FOUND);
        }
        return getGraph(graphEntity).findShortestPath(startVertex, endVertex).stream()
                .map(EdgeMapper.INSTANCE::entityToDto)
                .collect(Collectors.toList());
    }

    private Graph<Vertex, Edge> getGraph(GraphEntity graphEntity) {
        Graph<Vertex, Edge> graph = new Graph<>();
        Map<String, Level> levels = new HashMap<>();
        Map<String, Vertex> vertices = new HashMap<>();
        levelRepository.findAllByBuildingId(graphEntity.getBuildingId())
                .forEach(level -> levels.put(level.getId(), level));
        for (Vertex vertex : graphEntity.getVertices()) {
            vertices.put(vertex.getId(), vertex);
            graph.addVertex(vertex);
        }
        for (Edge edge : graphEntity.getEdges()) {
            Vertex startVertex = vertices.get(edge.getStartVertexId());
            Vertex endVertex = vertices.get(edge.getEndVertexId());
            Level startLevel = levels.get(startVertex.getLevelId());
            Level endLevel = levels.get(endVertex.getLevelId());
            graph.addEdge(edge, startVertex, endVertex, getLength(startVertex, endVertex, startLevel, endLevel));
        }
        return graph;
    }

    private double getLength(Vertex startVertex, Vertex endVertex, Level startLevel, Level endLevel) {
        GeodeticCalculator calculator = new GeodeticCalculator();
        calculator.setStartingGeographicPoint(startVertex.getLongitude(), startVertex.getLatitude());
        calculator.setDestinationGeographicPoint(endVertex.getLongitude(), endVertex.getLatitude());
        double levelDistance = calculator.getOrthodromicDistance();
        if (!Objects.equals(startLevel.getId(), endLevel.getId())) {
            double verticalDistance = DISTANCE_BETWEEN_LEVELS * Math.abs(startLevel.getNumber() - endLevel.getNumber());
            return Math.sqrt(verticalDistance * verticalDistance + levelDistance * levelDistance);
        }
        return levelDistance;
    }
}
