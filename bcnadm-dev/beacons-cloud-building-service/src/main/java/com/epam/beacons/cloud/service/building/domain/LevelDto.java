package com.epam.beacons.cloud.service.building.domain;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * DTO for Level entity.
 */
public class LevelDto extends DtoObject {

    private int number;
    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "buildingId should match regex [a-fA-F\\d]{24}")
    @NotNull(message = "BuildingId must not be null")
    private String buildingId;
    private double southWestLatitude;
    private double southWestLongitude;
    private double northEastLatitude;
    private double northEastLongitude;
    private double scaleStartLatitude;
    private double scaleStartLongitude;
    private double scaleEndLatitude;
    private double scaleEndLongitude;
    private double scaleDistance;

    /**
     * Returns number.
     *
     * @return value of number
     */
    public int getNumber() {
        return number;
    }

    /**
     * Sets number value.
     *
     * @param number - value to set
     */
    public void setNumber(int number) {
        this.number = number;
    }

    /**
     * Getter for buildingId.
     *
     * @return buildingId value
     */
    public String getBuildingId() {
        return buildingId;
    }

    /**
     * Setter for buildingId.
     *
     * @param buildingId value
     */
    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }

    /**
     * Getter for southWestLatitude.
     *
     * @return double
     */
    public double getSouthWestLatitude() {
        return southWestLatitude;
    }

    /**
     * Setter for southWestLatitude.
     *
     * @param southWestLatitude value
     */
    public void setSouthWestLatitude(double southWestLatitude) {
        this.southWestLatitude = southWestLatitude;
    }

    /**
     * Getter for southWestLongitude.
     *
     * @return double
     */
    public double getSouthWestLongitude() {
        return southWestLongitude;
    }

    /**
     * Setter for southWestLongitude.
     *
     * @param southWestLongitude value
     */
    public void setSouthWestLongitude(double southWestLongitude) {
        this.southWestLongitude = southWestLongitude;
    }

    /**
     * Getter for northEastLatitude.
     *
     * @return double
     */
    public double getNorthEastLatitude() {
        return northEastLatitude;
    }

    /**
     * Setter for northEastLatitude.
     *
     * @param northEastLatitude value
     */
    public void setNorthEastLatitude(double northEastLatitude) {
        this.northEastLatitude = northEastLatitude;
    }

    /**
     * Getter for northEastLongitude.
     *
     * @return double
     */
    public double getNorthEastLongitude() {
        return northEastLongitude;
    }

    /**
     * Setter for northEastLongitude.
     *
     * @param northEastLongitude value
     */
    public void setNorthEastLongitude(double northEastLongitude) {
        this.northEastLongitude = northEastLongitude;
    }

    /**
     * Getter for scaleStartLatitude.
     *
     * @return double
     */
    public double getScaleStartLatitude() {
        return scaleStartLatitude;
    }

    /**
     * Setter for scaleStartLatitude.
     *
     * @param scaleStartLatitude value
     */
    public void setScaleStartLatitude(double scaleStartLatitude) {
        this.scaleStartLatitude = scaleStartLatitude;
    }

    /**
     * Getter for scaleStartLongitude.
     *
     * @return double
     */
    public double getScaleStartLongitude() {
        return scaleStartLongitude;
    }

    /**
     * Setter for scaleStartLongitude.
     *
     * @param scaleStartLongitude value
     */
    public void setScaleStartLongitude(double scaleStartLongitude) {
        this.scaleStartLongitude = scaleStartLongitude;
    }

    /**
     * Getter for scaleEndLatitude.
     *
     * @return double
     */
    public double getScaleEndLatitude() {
        return scaleEndLatitude;
    }

    /**
     * Setter for scaleEndLatitude.
     *
     * @param scaleEndLatitude value
     */
    public void setScaleEndLatitude(double scaleEndLatitude) {
        this.scaleEndLatitude = scaleEndLatitude;
    }

    /**
     * Getter for scaleEndLongitude.
     *
     * @return double
     */
    public double getScaleEndLongitude() {
        return scaleEndLongitude;
    }

    /**
     * Setter for scaleEndLongitude.
     *
     * @param scaleEndLongitude value
     */
    public void setScaleEndLongitude(double scaleEndLongitude) {
        this.scaleEndLongitude = scaleEndLongitude;
    }

    /**
     * Getter for scaleDistance.
     *
     * @return double
     */
    public double getScaleDistance() {
        return scaleDistance;
    }

    /**
     * Setter for scaleDistance.
     *
     * @param scaleDistance value
     */
    public void setScaleDistance(double scaleDistance) {
        this.scaleDistance = scaleDistance;
    }
}
