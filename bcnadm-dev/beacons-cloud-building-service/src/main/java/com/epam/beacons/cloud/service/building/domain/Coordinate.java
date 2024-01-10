package com.epam.beacons.cloud.service.building.domain;

import java.io.Serializable;
import java.util.Objects;
import org.apache.commons.math3.util.Precision;

/**
 * This class @code{Coordinate} represents two-dimensional coordinate.
 */
public class Coordinate implements Serializable {

    public static final double EPSILON = 1.0E-7D;
    private static final int ROUNDING_SCALE = 4;

    private double latitude;
    private double longitude;

    public Coordinate() {
    }

    public Coordinate(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Coordinate that = (Coordinate) o;
        return Precision.equals(that.latitude, latitude, EPSILON) && Precision.equals(
                that.longitude, longitude, EPSILON);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Precision.round(latitude, ROUNDING_SCALE, 1),
                Precision.round(longitude, ROUNDING_SCALE, 1)
        );
    }
}
