package com.epam.beacons.cloud.service.mobile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.PropertySource;

@EnableEurekaClient
@SpringBootApplication
@PropertySource(value = "file:secrets.yml", ignoreResourceNotFound = true)
public class MobileServiceApplication {

    /**
     * Service entry point.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(MobileServiceApplication.class, args);
    }

}
