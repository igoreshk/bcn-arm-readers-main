package com.epam.beacons.cloud.monitor.service.debug;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Generator service properties.
 */
@Configuration
@ConfigurationProperties("beacons.cloud.debug-mode.generator.properties")
public class GenerationProperties {
    private Double latitude;
    private Double longitude;
    private Integer period;
    private String levelId;

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getPeriod() {
        return period;
    }

    public void setPeriod(Integer period) {
        this.period = period;
    }

    public String getLevelId() {
        return levelId;
    }

    public void setLevelId(String levelId) {
        this.levelId = levelId;
    }
}
