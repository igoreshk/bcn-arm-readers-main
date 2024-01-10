package com.epam.beacons.cloud.monitor.service.exception;

/**
 * Custom validation exception used for checks in validations package.
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
