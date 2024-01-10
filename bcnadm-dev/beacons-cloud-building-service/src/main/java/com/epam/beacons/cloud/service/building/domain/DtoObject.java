package com.epam.beacons.cloud.service.building.domain;

import java.util.Objects;

/**
 * Abstract DTO class contains entityId.
 */
public abstract class DtoObject {

    private String entityId;

    /**
     * Returns entityId.
     *
     * @return value of entityId
     */
    public String getEntityId() {
        return entityId;
    }

    /**
     * Sets entityId value.
     *
     * @param entityId - value to set
     */
    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    /**
     * Checks that current object equal to some object.
     *
     * @param o object to check
     * @return true if equals, false if not
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DtoObject dtoObject = (DtoObject) o;
        return Objects.equals(entityId, dtoObject.entityId);
    }

    /**
     * Returns hash code.
     *
     * @return hash code
     */
    @Override
    public int hashCode() {
        return Objects.hash(entityId);
    }
}
