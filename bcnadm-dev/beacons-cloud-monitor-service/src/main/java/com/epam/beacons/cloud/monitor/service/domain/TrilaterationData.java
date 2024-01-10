package com.epam.beacons.cloud.monitor.service.domain;

/**
 * Contains information required for calculations.
 **/
public class TrilaterationData {

    private final int rssi;
    private final int referencePower;
    private final double latitude;
    private final double longitude;

    public TrilaterationData(int rssi, int referencePower, double latitude, double longitude) {
        this.rssi = rssi;
        this.referencePower = referencePower;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public int getRssi() {
        return rssi;
    }

    public int getReferencePower() {
        return referencePower;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }
}
