package com.epam.beacons.cloud.service.building.domain;

import javax.validation.constraints.NotNull;

/**
 * DTO for building entity.
 */
public class BuildingDto extends DtoObject {

    @NotNull(message = "address can't be undefined")
    private String address;
    private double latitude;
    private double longitude;
    private double width;
    private double height;
    @NotNull(message = "name can't be undefined")
    private String name;
    private String phoneNumber;
    private String workingHours;
    private String createdBy;

    /**
     * Returns address.
     *
     * @return value of address
     */
    public String getAddress() {
        return address;
    }

    /**
     * Sets address value.
     *
     * @param address - value to set
     */
    public void setAddress(String address) {
        this.address = address;
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
     * Returns name.
     *
     * @return value of name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name value.
     *
     * @param name - value to set
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
     * Returns user id.
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
