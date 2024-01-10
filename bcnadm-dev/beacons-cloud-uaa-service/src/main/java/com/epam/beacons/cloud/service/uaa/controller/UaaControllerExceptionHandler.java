package com.epam.beacons.cloud.service.uaa.controller;

import com.epam.beacons.cloud.service.uaa.domain.ExceptionResponseDto;
import com.epam.beacons.cloud.service.uaa.exception.EntityNotFoundException;
import com.epam.beacons.cloud.service.uaa.exception.NonUniqueValueException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * This @code{UaaControllerExceptionHandler} class handles exceptions in UaaService.
 */
@RestControllerAdvice
public class UaaControllerExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(UaaControllerExceptionHandler.class);

    /**
     * Handles IllegalArgumentException.
     *
     * @param e - exception thrown.
     * @return response entity with error code.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto> handleIllegalArgumentException(Exception e) {
        logger.error(e.getMessage(), e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles EntityNotFoundException.
     *
     * @param e - exception thrown.
     * @return response entity with error code.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto> handleEntityNotFoundException(Exception e) {
        logger.error(e.getMessage(), e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles custom NonUniqueValueException, usually if saving entity with non-unique parameters.
     *
     * @param e - exception thrown.
     * @return response entity with error code.
     */
    @ExceptionHandler(NonUniqueValueException.class)
    public ResponseEntity<ExceptionResponseDto> handleNonUniqueValueException(Exception e) {
        logger.error(e.getMessage(), e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles unexpected exceptions.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponseDto> handleUnexpectedException(Exception e) {
        logger.error(e.getMessage(), e);

        List<String> stackTrace = Arrays.stream(e.getStackTrace()).map(StackTraceElement::toString)
                .collect(Collectors.toList());

        return new ResponseEntity<>(new ExceptionResponseDto(e.getMessage(), stackTrace, LocalDateTime.now()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
