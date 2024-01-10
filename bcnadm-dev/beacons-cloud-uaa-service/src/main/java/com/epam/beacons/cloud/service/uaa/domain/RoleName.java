package com.epam.beacons.cloud.service.uaa.domain;

/**
 * Roles enumeration.
 */
public enum RoleName {

    ADMINISTRATOR,
    USER,
    WATCHER;

    public static RoleName getDefault() {
        return USER;
    }
}
