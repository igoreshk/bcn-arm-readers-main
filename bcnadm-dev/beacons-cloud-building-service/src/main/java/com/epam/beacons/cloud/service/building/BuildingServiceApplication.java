package com.epam.beacons.cloud.service.building;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Main class for building service microservice.
 */
@SpringBootApplication
@EnableEurekaClient
@PropertySource(value = "file:secrets.yml", ignoreResourceNotFound = true)
@EnableFeignClients(basePackages = {"com.epam.beacons.cloud.service.building.feign"})
@EnableMongoRepositories(basePackages = {"com.epam.beacons.cloud.service.building"})
public class BuildingServiceApplication {

    /**
     * Service entry point.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(BuildingServiceApplication.class, args);
    }
}
