package com.epam.beacons.cloud.service.building.domain;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * DTO for edge entity.
 */
public class EdgeDto extends DtoObject {

    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "startVertexId should match regex [a-fA-F\\d]{24}")
    @NotNull
    private String startVertexId;

    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "endVertexId should match regex [a-fA-F\\d]{24}")
    @NotNull
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
