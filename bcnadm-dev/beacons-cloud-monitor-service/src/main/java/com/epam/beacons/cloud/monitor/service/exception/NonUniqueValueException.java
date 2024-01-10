package com.epam.beacons.cloud.monitor.service.exception;

/**
 * Custom runtime exception used to work with ControllerExceptionHandler and throw it
 * instead of DuplicationKeyException to avoid unexpected behavior.
 * */
public class NonUniqueValueException extends RuntimeException {

    /**
     * Creates exception with message and cause.
     *
     * @param message of exception
     * @param cause   of exception
     */
    public NonUniqueValueException(String message, Throwable cause) {
        super(message, cause);
    }

}
