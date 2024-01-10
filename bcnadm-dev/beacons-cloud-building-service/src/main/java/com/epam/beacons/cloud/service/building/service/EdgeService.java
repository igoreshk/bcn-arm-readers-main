package com.epam.beacons.cloud.service.building.service;

import com.epam.beacons.cloud.service.building.domain.EdgeDto;
import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import com.epam.beacons.cloud.service.building.domain.Vertex;
import com.epam.beacons.cloud.service.building.domain.VertexDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.mapper.EdgeMapper;
import com.epam.beacons.cloud.service.building.repository.GraphRepository;
import com.epam.beacons.cloud.service.building.repository.LevelRepository;
import java.util.Collection;
import java.util.Collections;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Implementation for edge service.
 */
@Service
public class EdgeService {

    private static final String VERTEX_DTO_NULL = "Vertex DTO was not provided";
    private static final String EDGE_WAS_NOT_FOUND = "Edge wasn't found";
    private static final String VERTEX_ID_IS_NULL = "Vertex ID is null";
    private static final String EDGE_DTO_NOT_PROVIDED = "EdgeDTO wasn't provided";
    private static final String VERTEX_WAS_NOT_FOUND = "Vertex was not found";
    private static final String GRAPH_WAS_NOT_FOUND = "Graph was not found";
    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile("[a-zA-Z0-9]{24}");

    private final LevelRepository levelRepository;
    private final GraphRepository graphRepository;
    private final MongoTemplate mongoTemplate;

    public EdgeService(LevelRepository levelRepository, GraphRepository graphRepository, MongoTemplate mongoTemplate) {
        this.levelRepository = levelRepository;
        this.graphRepository = graphRepository;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Find all edges.
     *
     * @return collection of EdgeDto
     */
    public Collection<EdgeDto> findAll() {
        return graphRepository.findAllWithEdges().stream()
                .flatMap(graph -> graph.getEdges().stream())
                .map(EdgeMapper.INSTANCE::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find edges by vertex id (left or right).
     *
     * @param vertex left or right vertex.
     * @return collection of adjacent edges.
     */
    public Collection<EdgeDto> findAll(VertexDto vertex) {
        if (vertex == null) {
            throw new EntityNotFoundException(VERTEX_DTO_NULL);
        }
        if (vertex.getEntityId() == null || !StringUtils.hasText(vertex.getEntityId())) {
            throw new EntityNotFoundException(VERTEX_ID_IS_NULL);
        }
        if (!OBJECT_ID_PATTERN.matcher(vertex.getEntityId()).matches()) {
            throw new IllegalArgumentException(VERTEX_ID_IS_NULL);
        }
        GraphEntity graph = graphRepository.findOneByVertexIdWithEdges(vertex.getEntityId())
                .orElseThrow(() -> new EntityNotFoundException(GRAPH_WAS_NOT_FOUND));
        return graph.getEdges().stream()
                .filter(edge -> edge.getEndVertexId().equals(vertex.getEntityId())
                        || edge.getStartVertexId().equals(vertex.getEntityId()))
                .map(EdgeMapper.INSTANCE::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Find EdgeDto by edge id.
     *
     * @param edgeId edge id
     * @return found EdgeDto
     */
    public EdgeDto findOne(final String edgeId) {
        GraphEntity graph = graphRepository.findOneByEdgeIdWithEdges(edgeId)
                .orElseThrow(() -> new EntityNotFoundException(GRAPH_WAS_NOT_FOUND));
        return graph.getEdges().stream()
                .filter(edge -> edge.getId().equals(edgeId))
                .map(EdgeMapper.INSTANCE::entityToDto)
                .findFirst().orElseThrow(() -> new EntityNotFoundException(EDGE_WAS_NOT_FOUND));
    }

    /**
     * Save EdgeDto.
     *
     * @param edgeDto EdgeDto to save
     * @return saved EdgeDto
     */
    public EdgeDto save(final EdgeDto edgeDto) {
        if (edgeDto == null) {
            throw new EntityNotFoundException(EDGE_DTO_NOT_PROVIDED);
        }
        String levelId =  graphRepository.findAllWithVertices().stream()
                .flatMap(graph -> graph.getVertices().stream())
                .filter(vertex -> vertex.getId().equals(edgeDto.getStartVertexId())
                        || vertex.getId().equals(edgeDto.getEndVertexId()))
                .map(Vertex::getLevelId)
                .findFirst().orElseThrow(() -> new EntityNotFoundException(VERTEX_WAS_NOT_FOUND));
        String buildingId = levelRepository.findById(levelId)
                .orElseThrow(() -> new IllegalArgumentException("Level not found"))
                .getBuildingId();
        edgeDto.setEntityId(ObjectId.get().toHexString());
        Query query = new Query().addCriteria(Criteria.where("buildingId").is(buildingId));
        mongoTemplate.updateFirst(query,
                new Update().push("edges", EdgeMapper.INSTANCE.dtoToEntity(edgeDto)), "graphs");
        return findOne(edgeDto.getEntityId());
    }

    /**
     * Update EdgeDto.
     *
     * @param edgeDto EdgeDto to update
     * @return updated EdgeDto
     */
    public EdgeDto update(final EdgeDto edgeDto) {
        if (edgeDto == null) {
            throw new EntityNotFoundException(EDGE_DTO_NOT_PROVIDED);
        }
        GraphEntity graph = mongoTemplate.findAndModify(
                new Query(Criteria.where("edges.id").is(edgeDto.getEntityId())),
                new Update()
                        .set("edges.$", EdgeMapper.INSTANCE.dtoToEntity(edgeDto))
                        .filterArray(Criteria.where("id").is(edgeDto.getEntityId())),
                new FindAndModifyOptions().returnNew(true),
                GraphEntity.class
        );
        if (graph == null) {
            throw new EntityNotFoundException(EDGE_WAS_NOT_FOUND);
        }
        return graph.getEdges().stream()
                .filter(edge -> edge.getId().equals(edgeDto.getEntityId()))
                .map(EdgeMapper.INSTANCE::entityToDto)
                .findFirst().orElseThrow(() -> new EntityNotFoundException(EDGE_WAS_NOT_FOUND));
    }

    /**
     * Delete EdgeDto.
     *
     * @param edgeDto EdgeDto to delete
     */
    public void delete(final EdgeDto edgeDto) {
        if (edgeDto == null) {
            throw new EntityNotFoundException(EDGE_DTO_NOT_PROVIDED);
        }
        mongoTemplate.updateMulti(
                new Query(),
                new Update().pull("edges", Query.query(Criteria.where("id").is(edgeDto.getEntityId()))),
                "graphs"
        );
    }

    /**
     * Delete all Edges.
     */
    public void deleteAll() {
        mongoTemplate.updateMulti(new Query(),
                new Update().set("edges", Collections.EMPTY_LIST), "graphs");
    }

    /**
     * Find edge by vertices.
     *
     * @param leftVertexDto  vertexDto
     * @param rightVertexDto vertexDto
     * @return edge
     */
    public EdgeDto findByVertices(VertexDto leftVertexDto, VertexDto rightVertexDto) {
        if (leftVertexDto == null || rightVertexDto == null) {
            throw new EntityNotFoundException(VERTEX_DTO_NULL);
        }
        if (leftVertexDto.getEntityId() == null || !StringUtils.hasText(leftVertexDto.getEntityId())
                || rightVertexDto.getEntityId() == null || !StringUtils.hasText(rightVertexDto.getEntityId())) {
            throw new EntityNotFoundException(VERTEX_ID_IS_NULL);
        }
        if (!OBJECT_ID_PATTERN.matcher(leftVertexDto.getEntityId()).matches()
                || !OBJECT_ID_PATTERN.matcher(rightVertexDto.getEntityId()).matches()) {
            throw new IllegalArgumentException(VERTEX_ID_IS_NULL);
        }
        GraphEntity graph = graphRepository.findOneByVertexIdWithEdges(leftVertexDto.getEntityId())
                .orElse(null);
        if (graph == null) {
            return null;
        }
        return graph.getEdges().stream()
                .filter(edge -> edge.getStartVertexId().equals(leftVertexDto.getEntityId())
                        && edge.getEndVertexId().equals(rightVertexDto.getEntityId())
                        || edge.getStartVertexId().equals(rightVertexDto.getEntityId())
                        && edge.getEndVertexId().equals(leftVertexDto.getEntityId()))
                .map(EdgeMapper.INSTANCE::entityToDto).findFirst()
                .orElse(null);
    }
}
