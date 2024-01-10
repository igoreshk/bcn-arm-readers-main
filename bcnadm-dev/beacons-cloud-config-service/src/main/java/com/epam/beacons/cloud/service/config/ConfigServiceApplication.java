package com.epam.beacons.cloud.service.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.context.annotation.PropertySource;

/**
 * Main configuration class.
 */
@SpringBootApplication
@EnableConfigServer
@PropertySource(value = "file:secrets.yml", ignoreResourceNotFound = true)
public class ConfigServiceApplication {

    /**
     * Main class to run SpringApplication.
     *
     * @param args - default arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(ConfigServiceApplication.class, args);
    }
}
