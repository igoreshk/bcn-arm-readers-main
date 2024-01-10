package com.epam.beacons.cloud.service.building.domain;

/**
 * DTO for specified area search by name and description.
 */
public class AreaSearchDto {

    private String name;
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
