package com.epam.beacons.cloud.service.building.domain;

import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Reader entity.
 */
@Document(collection = "readers")
public class Reader extends DomainObject {

    @Field
    @Indexed(unique = true, direction = IndexDirection.ASCENDING)
    private String uuid;
    @Field
    private String levelId;
    @Field
    private double latitude;
    @Field
    private double longitude;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getLevelId() {
        return levelId;
    }

    public void setLevelId(String levelId) {
        this.levelId = levelId;
    }

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
}
