package com.epam.beacons.cloud.service.building.domain;

/**
 * Types of vertex for creating routes in a building.
 */
public enum VertexType {
    NONE,
    ENTRY_ONLY,
    ENTRY_EXIT,
    EXIT_ONLY;

    public static VertexType getDefault() {
        return NONE;
    }
}
