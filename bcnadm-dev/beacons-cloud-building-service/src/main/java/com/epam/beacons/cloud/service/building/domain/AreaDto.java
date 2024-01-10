package com.epam.beacons.cloud.service.building.domain;

import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * DTO for area entity.
 */
public class AreaDto extends DtoObject {

    private String description;
    private String name;
    @Pattern(regexp = "[a-fA-F\\d]{24}", message = "levelId should match regex [a-fA-F\\d]{24}")
    @NotNull
    private String levelId;
    private List<Coordinate> coordinates;

    /**
     * Returns description.
     *
     * @return value of description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets description value.
     *
     * @param description - value to set
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Returns levelId.
     *
     * @return value of levelId
     */
    public String getLevelId() {
        return levelId;
    }

    /**
     * Sets levelId value.
     *
     * @param levelId - value to set
     */
    public void setLevelId(String levelId) {
        this.levelId = levelId;
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
     * Returns coordinates.
     *
     * @return value of coordinates
     */
    public List<Coordinate> getCoordinates() {
        return coordinates;
    }

    /**
     * Sets coordinates value.
     *
     * @param coordinates - value to set
     */
    public void setCoordinates(List<Coordinate> coordinates) {
        this.coordinates = coordinates;
    }
}
