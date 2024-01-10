package com.epam.beacons.cloud.service.building.domain;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * DTO for vertex entity.
 */
public class VertexDto extends DtoObject {

    private double latitude;
    private double longitude;
    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "levelId should match regex [a-fA-F\\d]{24}")
    @NotNull
    private String levelId;
    private VertexType type = VertexType.getDefault();

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getLevelId() {
        return levelId;
    }

    public void setLevelId(String levelId) {
        this.levelId = levelId;
    }

    public VertexType getType() {
        return type;
    }

    public void setType(VertexType type) {
        this.type = type;
    }
}
