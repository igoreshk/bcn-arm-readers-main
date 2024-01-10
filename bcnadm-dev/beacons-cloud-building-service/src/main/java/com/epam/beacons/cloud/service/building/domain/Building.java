package com.epam.beacons.cloud.service.building.domain;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Domain entity for building.
 */
@Document(collection = "buildings")
public class Building extends DomainObject {

    @Field
    @Indexed(unique = true)
    private String address;
    @Field
    @Indexed(unique = true)
    private String name;
    @Field
    private double latitude;
    @Field
    private double longitude;
    @Field
    private double width;
    @Field
    private double height;
    @Field
    private String phoneNumber;
    @Field
    private String workingHours;
    @Field
    private byte[] imageAsByteArray;
    @Field
    private String mimeType;
    @Field
    private String createdBy;

    /**
     * Getter for address.
     *
     * @return java.lang.String
     */
    public String getAddress() {
        return address;
    }

    /**
     * Setter for address.
     *
     * @param address value
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * Getter for name.
     *
     * @return java.lang.String
     */
    public String getName() {
        return name;
    }

    /**
     * Setter for name.
     *
     * @param name value
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Getter for latitude.
     *
     * @return double
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
     * @return double
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
     * Getter for width.
     *
     * @return double
     */
    public double getWidth() {
        return width;
    }

    /**
     * Setter for width.
     *
     * @param width value
     */
    public void setWidth(double width) {
        this.width = width;
    }

    /**
     * Getter for height.
     *
     * @return double
     */
    public double getHeight() {
        return height;
    }

    /**
     * Setter for height.
     *
     * @param height value
     */
    public void setHeight(double height) {
        this.height = height;
    }

    /**
     * Returns phoneNumber.
     *
     * @return value of phoneNumber
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     * Sets phoneNumber value.
     *
     * @param phoneNumber - value to set
     */
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    /**
     * Returns workingHours.
     *
     * @return value of workingHours
     */
    public String getWorkingHours() {
        return workingHours;
    }

    /**
     * Sets workingHours value.
     *
     * @param workingHours - value to set
     */
    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }

    /**
     * Gets building image as byte array.
     *
     * @return byte array of building image
     */
    public byte[] getImageAsByteArray() {
        return imageAsByteArray;
    }

    /**
     * Sets building image as byte array.
     *
     * @param imageAsByteArray byte array of image to set
     */
    public void setImageAsByteArray(byte[] imageAsByteArray) {
        this.imageAsByteArray = imageAsByteArray;
    }

    /**
     * Gets mime type of building image.
     *
     * @return mimeType
     */
    public String getMimeType() {
        return mimeType;
    }

    /**
     * Sets mime type for building image.
     *
     * @param mimeType mime type
     */
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    /**
     * Returns beacons-cloud-uaa-service/src/main/java/com/epam/beacons/cloud/service/uaa/domain/User.java id.
     *
     * @return creator id
     */
    public String getCreatedBy() {
        return createdBy;
    }

    /**
     * Sets creator.
     *
     * @param createdBy user id
     */
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
