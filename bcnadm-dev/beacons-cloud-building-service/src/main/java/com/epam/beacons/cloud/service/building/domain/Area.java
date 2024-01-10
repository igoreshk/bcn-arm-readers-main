package com.epam.beacons.cloud.service.building.domain;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Area entity.
 */
@Document(collection = "areas")
public class Area extends DomainObject {

    @Field
    private String description;
    @Field
    private String name;
    @Field
    private String levelId;
    @Field
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
    public void setCoordinates(List coordinates) {
        this.coordinates = coordinates;
    }
}
