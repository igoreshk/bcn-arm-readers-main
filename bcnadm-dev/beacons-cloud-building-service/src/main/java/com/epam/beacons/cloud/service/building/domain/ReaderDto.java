package com.epam.beacons.cloud.service.building.domain;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * DTO for beacon entity.
 */
public class ReaderDto extends DtoObject {

    @NotNull
    private String uuid;
    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "levelId should match regex [a-fA-F\\d]{24}")
    private String levelId;
    private double latitude;
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
