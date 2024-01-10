package com.epam.beacons.cloud.service.building.domain;

/**
 * Domain entity for edge.
 */
public class Edge extends DomainObject {

    private String startVertexId;
    private String endVertexId;

    /**
     * Returns startVertexId.
     *
     * @return value of startVertexId
     */
    public String getStartVertexId() {
        return startVertexId;
    }

    /**
     * Sets startVertexId value.
     *
     * @param startVertexId - value to set
     */
    public void setStartVertexId(String startVertexId) {
        this.startVertexId = startVertexId;
    }

    /**
     * Returns endVertexId.
     *
     * @return value of endVertexId
     */
    public String getEndVertexId() {
        return endVertexId;
    }

    /**
     * Sets endVertexId value.
     *
     * @param endVertexId - value to set
     */
    public void setEndVertexId(String endVertexId) {
        this.endVertexId = endVertexId;
    }
}
