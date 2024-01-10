package com.epam.beacons.cloud.monitor.service.domain;

import java.util.Collections;
import java.util.Set;

/**
 * DTO for watcher.
 */
public class VisitorGroupDto extends DtoObject {

    private String name;
    private Set<String> visitorIds = Collections.emptySet();

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

