package com.epam.beacons.cloud.service.building.exception;

/**
 * Custom validation exception.
 */
public class EntityNotFoundException extends RuntimeException {
    
    /**
     * Creates exception with message.
     *
     * @param message of exception
     */
    public EntityNotFoundException(String message) {
        super(message);
    }
}
