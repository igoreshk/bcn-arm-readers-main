package com.epam.beacons.cloud.monitor.service.domain;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.validation.constraints.Pattern;

/**
 * DTO for Flat Beacon position.
 */
public class FlatBeaconPositionDto extends DtoObject implements Serializable {

    private LocalDateTime timestamp;
    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "levelId should match regex [a-fA-F\\d]{24}")

    private String levelId;
    private String name;
    private double latitude;
    private double longitude;

    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "deviceId should match regex [a-fA-F\\d]{24}")
    private String deviceId;

    private int heartRate;
    private double bodyTemperature;
    private int stepCount;

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getLevelId() {
        return levelId;
    }

    public void setLevelId(String levelId) {
        this.levelId = levelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public int getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    public double getBodyTemperature() {
        return bodyTemperature;
    }

    public void setBodyTemperature(double bodyTemperature) {
        this.bodyTemperature = bodyTemperature;
    }

    public int getStepCount() {
        return stepCount;
    }

    public void setStepCount(int stepCount) {
        this.stepCount = stepCount;
    }
}
