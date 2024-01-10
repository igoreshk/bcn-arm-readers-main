package com.epam.beacons.cloud.service.building.repository;

import com.epam.beacons.cloud.service.building.domain.GraphEntity;
import java.util.Collection;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Mongo repository for graphs.
 */
@Repository
public interface GraphRepository extends MongoRepository<GraphEntity, String> {

    /**
     * Finds GraphEntity which contains Vertex with given level id with vertices field.
     *
     * @param levelId level id
     * @return Optional GraphEntity
     */
    @Query(value = "{ 'vertices.levelId' : ?0 }", fields = "{ 'vertices' : 1 }")
    Optional<GraphEntity> findOneByLevelIdWithVertices(String levelId);

    /**
     * Finds GraphEntity which contains Vertex with given vertex id with vertices field.
     *
     * @param vertexId vertex id
     * @return Optional GraphEntity
     */
    @Query(value = "{ 'vertices.id' : ?0 }", fields = "{ 'vertices' : 1 }")
    Optional<GraphEntity> findOneByVertexIdWithVertices(String vertexId);

    /**
     * Finds GraphEntity which contains Edge with given start vertex id with vertices field.
     *
     * @param startVertexId start vertex id
     * @return Optional GraphEntity
     */
    @Query(value = "{ 'edges.startVertexId' : ?0 }", fields = "{ 'vertices' : 1 }")
    Optional<GraphEntity> findOneByStartVertexIdWithVertices(String startVertexId);

    /**
     * Finds GraphEntity which contains Edge with given edge id with edges field.
     *
     * @param edgeId edge id
     * @return Optional GraphEntity
     */
    @Query(value = "{ 'edges.id' : ?0 }", fields = "{ 'edges' : 1 }")
    Optional<GraphEntity> findOneByEdgeIdWithEdges(String edgeId);

    /**
     * Finds GraphEntity which contains Vertex with given vertex id with edges field.
     *
     * @param vertexId vertex id
     * @return Optional GraphEntity
     */
    @Query(value = "{ 'vertices.id' : ?0 }", fields = "{ 'edges' : 1 }")
    Optional<GraphEntity> findOneByVertexIdWithEdges(String vertexId);

    /**
     * Deletes GraphEntity by buildingId.
     *
     * @param buildingId building id
     */
    void deleteByBuildingId(String buildingId);

    /**
     * Finds GraphEntity by buildingId.
     *
     * @param buildingId building id
     * @return Optional GraphEntity
     */
    Optional<GraphEntity> findByBuildingId(String buildingId);

    /**
     * Finds all GraphEntity with edges field.
     *
     * @return collection of GraphEntities
     */
    @Query(value = "{}", fields = "{ 'edges' : 1 }")
    Collection<GraphEntity> findAllWithEdges();

    /**
     * Finds all GraphEntity with vertices field.
     *
     * @return collection of GraphEntities
     */
    @Query(value = "{}", fields = "{ 'vertices' : 1 }")
    Collection<GraphEntity> findAllWithVertices();
}

