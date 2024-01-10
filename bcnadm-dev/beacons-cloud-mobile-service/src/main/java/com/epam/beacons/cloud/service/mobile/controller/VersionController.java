package com.epam.beacons.cloud.service.mobile.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for returning building information.
 */
@RestController
public class VersionController {

    private static final String VERSION_FILE = "build.json";

    /**
     * Handles request getting building information.
     *
     * @return file VERSION_FILE.
     */
    @GetMapping("/version")
    public Resource getInfo() {
        return new ClassPathResource(VERSION_FILE);
    }
}
