package com.epam.beacons.cloud.service.building.controller;

import com.epam.beacons.cloud.service.building.domain.ExceptionResponseDto;
import com.epam.beacons.cloud.service.building.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.building.exception.NonUniqueValueException;
import feign.FeignException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * This @code{BuildingControllerExceptionHandler} class handles exceptions in Building service.
 */
@RestControllerAdvice
public class BuildingControllerExceptionHandler {

    private static final Logger LOGGER = LogManager.getLogger(BuildingControllerExceptionHandler.class);

    /**
     * Handles IllegalArgumentException when user sends request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto> handleIllegalArgumentException(IllegalArgumentException e) {
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
     * Handles custom EntityNotFoundException when user sends request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto> handleEntityNotFoundException(EntityNotFoundException e) {
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
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.CONFLICT);
    }

    /**
     * Handles exceptions while validation of controller parameters.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ExceptionResponseDto> constraintViolationHandler(ConstraintViolationException e) {
        LOGGER.warn("Validation exception", e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getConstraintViolations().stream().map(ConstraintViolation::getMessage)
                        .reduce((s, s2) -> s + " " + s2).orElse(" "),
                        LocalDateTime.now()), HttpStatus.BAD_REQUEST);
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
                new ExceptionResponseDto(e.getMessage(), stackTrace,
                        LocalDateTime.now()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles MethodArgumentTypeMismatchException when user sends request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ExceptionResponseDto> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException e) {
        LOGGER.error(e.getMessage(), e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }
}
