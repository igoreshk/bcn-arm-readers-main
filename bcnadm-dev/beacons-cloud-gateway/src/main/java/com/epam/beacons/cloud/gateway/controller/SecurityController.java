package com.epam.beacons.cloud.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Security rest controller.
 */
@RestController
@RequestMapping("/api/v1")
public class SecurityController {

    /**
     * Checks user authentication.
     *
     * @return ResponseEntity
     */
    @GetMapping("/ping")
    public ResponseEntity<String> checkAuthorization() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
