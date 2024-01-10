package com.epam.beacons.cloud.monitor.service.domain;

import java.util.Set;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * domain entity for watcher.
 */
@Document(collection = "visitor_groups")
public class VisitorGroup extends DomainObject {

    @Field
    @Indexed(unique = true)
    private String name;
    @Field
    private Set<String> visitorIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getVisitorIds() {
        return visitorIds;
    }

    public void setVisitorIds(Set<String> visitorIds) {
        this.visitorIds = visitorIds;
    }
}
