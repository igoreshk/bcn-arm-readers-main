package com.epam.beacons.cloud.monitor.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Main class for monitor service microservice.
 */
@SpringBootApplication
@EnableEurekaClient
@PropertySource(value = "file:secrets.yml", ignoreResourceNotFound = true)
@EnableFeignClients(basePackages = {"com.epam.beacons.cloud.monitor.service.feign"})
@EnableMongoRepositories(basePackages = {"com.epam.beacons.cloud.monitor.service.repository"})
public class BeaconsCloudMonitorServiceApplication {

    /**
     * Service entry point.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(BeaconsCloudMonitorServiceApplication.class, args);
    }

}
