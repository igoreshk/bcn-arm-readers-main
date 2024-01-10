package com.epam.beacons.cloud.gateway.controller;

import com.epam.beacons.cloud.gateway.domain.ExceptionResponseDto;
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
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * This @code{ControllerExceptionHandler} class handles exceptions.
 */
@ControllerAdvice
public class GatewayControllerExceptionHandler {

    private static final Logger LOGGER = LogManager.getLogger(GatewayControllerExceptionHandler.class);

    /**
     * Handles our custom ApplicationRuntimeException.
     *
     * @param e - exception thrown
     * @return response entity with error code
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponseDto> handleApplicationRuntimeException(Exception e) {
        LOGGER.error(e.getMessage(), e);

        return new ResponseEntity<>(
                new ExceptionResponseDto(e.getMessage(), LocalDateTime.now()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
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
}
