package com.epam.beacons.cloud.service.building.domain;

/**
 * Domain entity for vertex.
 */
public class Vertex extends DomainObject {

    private double latitude;
    private double longitude;
    private String levelId;
    private VertexType type;

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
