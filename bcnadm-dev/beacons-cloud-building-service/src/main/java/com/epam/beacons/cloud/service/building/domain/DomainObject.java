package com.epam.beacons.cloud.service.building.domain;

import java.util.Objects;
import org.springframework.data.annotation.Id;

public abstract class DomainObject {

    @Id
    private String id;

    /**
     * Returns id.
     *
     * @return value of id
     */
    public final String getId() {
        return id;
    }

    /**
     * Sets id value.
     *
     * @param id - value to set
     */
    public final void setId(String id) {
        this.id = id;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DomainObject domainObject = (DomainObject) o;
        return Objects.equals(id, domainObject.id);
    }

    @Override
    public final int hashCode() {
        return Objects.hash(id);
    }
}
