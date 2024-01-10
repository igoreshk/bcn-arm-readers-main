package com.epam.beacons.cloud.service.building.domain;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Domain entity for number.
 */
@Document(collection = "building-levels")
@CompoundIndex(name = "building_level", def = "{'buildingId' : 1, 'number' : 1}", unique = true)
public class Level extends DomainObject {

    @Field
    private int number;
    @Field
    private String buildingId;
    @Field
    private double southWestLatitude;
    @Field
    private double southWestLongitude;
    @Field
    private double northEastLatitude;
    @Field
    private double northEastLongitude;
    @Field
    private double scaleStartLatitude;
    @Field
    private double scaleStartLongitude;
    @Field
    private double scaleEndLatitude;
    @Field
    private double scaleEndLongitude;
    @Field
    private double scaleDistance;
    @Field
    private byte[] imageAsByteArray;
    @Field
    private String mimeType;

    /**
     * Getter for number.
     *
     * @return java.lang.String
     */
    public int getNumber() {
        return number;
    }

    /**
     * Setter for number.
     *
     * @param number value
     */
    public void setNumber(int number) {
        this.number = number;
    }

    /**
     * Getter for buildingId.
     *
     * @return java.lang.String
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

    /**
     * Gets level image as byte array.
     *
     * @return byte array of level image
     */
    public byte[] getImageAsByteArray() {
        return imageAsByteArray;
    }

    /**
     * Sets lavel image as byte array.
     *
     * @param imageAsByteArray byte array of image to set
     */
    public void setImageAsByteArray(byte[] imageAsByteArray) {
        this.imageAsByteArray = imageAsByteArray;
    }

    /**
     * Gets mime type of level image.
     *
     * @return mimeType
     */
    public String getMimeType() {
        return mimeType;
    }

    /**
     * Sets mime type for level image.
     *
     * @param mimeType mime type
     */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
}
