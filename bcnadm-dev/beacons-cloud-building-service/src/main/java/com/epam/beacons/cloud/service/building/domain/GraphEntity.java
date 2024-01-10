package com.epam.beacons.cloud.service.building.domain;

import java.util.Collection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Domain entity for graph.
 */
@Document(collection = "graphs")
public class GraphEntity extends DomainObject {

    @Field
    @Indexed(unique = true)
    private String buildingId;
    @Field
    private Collection<Edge> edges;
    @Field
    private Collection<Vertex> vertices;

    /**
     * Returns buildingId.
     *
     * @return value of buildingId
     */
    public String getBuildingId() {
        return buildingId;
    }

    /**
     * Sets buildingId.
     *
     * @param buildingId value to set
     */
    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }

    /**
     * Returns edges.
     *
     * @return collection of edges
     */
    public Collection<Edge> getEdges() {
        return edges;
    }

    /**
     * Sets edges.
     *
     * @param edges collection to set
     */
    public void setEdges(Collection<Edge> edges) {
        this.edges = edges;
    }

    /**
     * Returns vertices.
     *
     * @return collection of vertices
     */
    public Collection<Vertex> getVertices() {
        return vertices;
    }

    /**
     * Sets vertices.
     *
     * @param vertices collection to set
     */
    public void setVertices(Collection<Vertex> vertices) {
        this.vertices = vertices;
    }
}
