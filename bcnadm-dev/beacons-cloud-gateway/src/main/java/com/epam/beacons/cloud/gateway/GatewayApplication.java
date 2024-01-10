package com.epam.beacons.cloud.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.PropertySource;

/**
 * Gateway application.
 */
@EnableZuulProxy
@EnableFeignClients("com.epam.beacons.cloud.gateway.feign")
@PropertySource(value = "file:secrets.yml", ignoreResourceNotFound = true)
@SpringBootApplication
public class GatewayApplication {

    /**
     * Entry point.
     *
     * @param args app args
     */
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
