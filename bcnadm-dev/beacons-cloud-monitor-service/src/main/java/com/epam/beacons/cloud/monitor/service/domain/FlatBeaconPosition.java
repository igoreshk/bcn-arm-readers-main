package com.epam.beacons.cloud.monitor.service.domain;

import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Flat Beacon position mongo entity class.
 */
@Document(collection = "retrospective")
public class FlatBeaconPosition extends DomainObject {

    @Field
    private String levelId;
    @Field
    private LocalDateTime timestamp;
    @Field
    private double latitude;
    @Field
    private double longitude;
    @Field
    private String deviceId;
    @Field
    private int heartRate;
    @Field
    private double bodyTemperature;
    @Field
    private int stepCount;

    /**
     * Getter for levelId.
     *
     * @return java.lang.String
     */
    public String getLevelId() {
        return levelId;
    }

    /**
     * Setter for levelId.
     *
     * @param levelId value
     */
    public void setLevelId(String levelId) {
        this.levelId = levelId;
    }

    /**
     * Getter for timestamp.
     *
     * @return java.time.LocalDateTime
     */
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    /**
     * Setter for timestamp.
     *
     * @param timestamp value
     */
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Getter for latitude.
     *
     * @return latitude value
     */
    public double getLatitude() {
        return latitude;
    }

    /**
     * Setter for latitude.
     *
     * @param latitude value
     */
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    /**
     * Getter for longitude.
     *
     * @return longitude value
     */
    public double getLongitude() {
        return longitude;
    }

    /**
     * Setter for longitude.
     *
     * @param longitude value
     */
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    /**
     * Getter for deviceId.
     *
     * @return deviceId value
     */
    public String getDeviceId() {
        return deviceId;
    }

    /**
     * Setter for device id.
     *
     * @param deviceId value
     */
    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    /**
     * Getter for heartRate.
     *
     * @return heartRate value
     */
    public int getHeartRate() {
        return heartRate;
    }

    /**
     * Setter for heartRate.
     *
     * @param heartRate value
     */
    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    /**
     * Getter for bodyTemperature.
     *
     * @return bodyTemperature value
     */
    public double getBodyTemperature() {
        return bodyTemperature;
    }

    /**
     * Setter for bodyTemperature.
     *
     * @param bodyTemperature value
     */
    public void setBodyTemperature(double bodyTemperature) {
        this.bodyTemperature = bodyTemperature;
    }

    /**
     * Getter for stepCount.
     *
     * @return stepCount value
     */
    public int getStepCount() {
        return stepCount;
    }

    /**
     * Setter for stepCount.
     *
     * @param stepCount value
     */
    public void setStepCount(int stepCount) {
        this.stepCount = stepCount;
    }
}
