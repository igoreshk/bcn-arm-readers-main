package com.epam.beacons.cloud.monitor.service.controller;

import com.epam.beacons.cloud.monitor.service.domain.ExceptionResponseDto;
import com.epam.beacons.cloud.monitor.service.exception.EntityNotFoundException;
import com.epam.beacons.cloud.monitor.service.exception.NonUniqueValueException;
import feign.FeignException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * This @code{MonitorControllerExceptionHandler} class handles exceptions in Monitor service.
 */
@RestControllerAdvice
public class MonitorControllerExceptionHandler {
    private static final Logger LOGGER = LogManager.getLogger(MonitorControllerExceptionHandler.class);

    /**
     * Handles illegal argument exceptions when user sends request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto> handleIllegalArgumentException(Exception e) {
        LOGGER.error(e.getMessage(), e);
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles MethodArgumentNotValidException when user sends request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponseDto> handleMethodArgumentNotValidExceptionException(
            MethodArgumentNotValidException e) {
        LOGGER.error(e.getMessage(), e);
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles our custom EntityNotFoundException, usually if entity not found.
     *
     * @param e - exception thrown.
     * @return response entity with error code.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto> handleEntityNotFoundException(Exception e) {
        LOGGER.error(e.getMessage(), e);
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles custom NonUniqueValueException, usually if saving entity with non-unique parameters.
     *
     * @param e - exception thrown.
     * @return response entity with error code.
     */
    @ExceptionHandler(NonUniqueValueException.class)
    public ResponseEntity<ExceptionResponseDto> handleNonUniqueValueException(Exception e) {
        LOGGER.error(e.getMessage(), e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles feign exceptions while user request.
     *
     * @param e - exception thrown
     * @return response entity with error code
     */
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ExceptionResponseDto> handleFeignStatusException(FeignException e) {
        LOGGER.error(e.getMessage(), e);
        List<String> stackTrace = Arrays.stream(e.getStackTrace())
                .map(Objects::toString)
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), stackTrace, LocalDateTime.now()),
                HttpStatus.valueOf(e.status()));
    }

    /**
     * Handles all unexpected exceptions when user sends request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponseDto> handleAllUnexpectedExceptions(Exception e) {
        LOGGER.error(e.getMessage(), e);
        List<String> stackTrace = Arrays.stream(e.getStackTrace())
                .map(Objects::toString)
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), stackTrace, LocalDateTime.now()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
