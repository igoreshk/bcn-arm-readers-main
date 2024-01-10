package com.epam.beacons.cloud.monitor.service.domain;

import io.swagger.annotations.ApiModelProperty;
import java.time.LocalDateTime;

/**
 * Contains raw readers data received from Kafka.
 **/
public class RawReaderData {

    @ApiModelProperty(notes = "deviceId should match [a-zA-Z\\s]{0,200}")
    private String deviceId;
    private String readerUuid;
    private int rssi;
    private int referencePower;
    private LocalDateTime timestamp;
    private int heartRate;
    private double bodyTemperature;
    private int stepCount;

    /**
     * Returns wrist band device ID. Coincides with Kafka topic.
     */
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getReaderUuid() {
        return readerUuid;
    }

    public void setReaderUuid(String readerUuid) {
        this.readerUuid = readerUuid;
    }

    /**
     * Returns received signal strength indicator.
     */
    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
    }

    /**
     * Returns txPower reference.
     */
    public int getReferencePower() {
        return referencePower;
    }

    public void setReferencePower(int referencePower) {
        this.referencePower = referencePower;
    }

    /**
     * Returns signal timestamp.
     */
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Returns heart rate of the user.
     * Range of values: 0 - 255 (bpm).
     */
    public int getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    /**
     * Returns temperature of the user body.
     * Range of values: 320 - 420 (C * 10).
     */
    public double getBodyTemperature() {
        return bodyTemperature;
    }

    public void setBodyTemperature(double bodyTemperature) {
        this.bodyTemperature = bodyTemperature;
    }

    /**
     * Returns current step count since 00:00.
     * Range of values: 0 - 65535 (steps).
     */
    public int getStepCount() {
        return stepCount;
    }

    public void setStepCount(int stepCount) {
        this.stepCount = stepCount;
    }

}
