package com.epam.beacons.cloud.service.uaa;

import com.epam.beacons.cloud.service.uaa.config.oauth2.BeaconsCloudSecurityProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Startup application of user authorization service.
 */
@SpringBootApplication
@EnableEurekaClient
@EnableMongoRepositories
@PropertySource(value = "file:secrets.yml", ignoreResourceNotFound = true)
@EnableConfigurationProperties(BeaconsCloudSecurityProperties.class)
public class UaaServiceApplication {

    /**
     * Main class.
     *
     * @param args params
     */
    public static void main(String[] args) {
        SpringApplication.run(UaaServiceApplication.class, args);
    }
}
