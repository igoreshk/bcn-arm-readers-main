package com.epam.beacons.cloud.service.mobile.controller;

import com.epam.beacons.cloud.service.mobile.domain.ExceptionResponseDto;
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
 * This {@code MobileControllerExceptionHandler} class handles exceptions.
 */
@RestControllerAdvice
public class MobileControllerExceptionHandler {

    private static final Logger LOGGER = LogManager.getLogger(MobileControllerExceptionHandler.class);

    /**
     * Handles illegal argument exceptions while user request.
     *
     * @param e - exception thrown.
     * @return response entity with error code
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto> handleIllegalArgumentException(Exception e) {
        LOGGER.error(e.getMessage(), e);
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()),
                HttpStatus.BAD_REQUEST);
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
     * Handles feign exceptions while user request.
     *
     * @param e - exception thrown
     * @return response entity with error code
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponseDto> handleArgumentNotValidException(MethodArgumentNotValidException e) {
        LOGGER.error(e.getMessage(), e);
        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()),
                HttpStatus.BAD_REQUEST);
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
