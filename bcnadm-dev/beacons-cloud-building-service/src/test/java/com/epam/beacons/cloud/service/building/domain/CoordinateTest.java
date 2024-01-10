package com.epam.beacons.cloud.service.building.domain;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import org.junit.Test;

/**
 * This @code{CoordinateTest} class tests @code{Coordinate} class.
 */
public class CoordinateTest {

    @Test
    public void equalsCoordinatesShouldBeEqual() {
        Coordinate coordinate1 = new Coordinate();
        coordinate1.setLatitude(0.0000001);
        coordinate1.setLongitude(0.0000001);
        Coordinate coordinate2 = new Coordinate();
        coordinate2.setLatitude(0.0000002);
        coordinate2.setLongitude(0.0000002);

        assertEquals(coordinate1, coordinate2);
    }

    @Test
    public void equalsCoordinatesShouldNotBeEqual() {
        Coordinate coordinate1 = new Coordinate();
        coordinate1.setLatitude(0.000001);
        coordinate1.setLongitude(0.000001);
        Coordinate coordinate2 = new Coordinate();
        coordinate2.setLatitude(0.000002);
        coordinate2.setLongitude(0.000002);

        assertNotEquals(coordinate1, coordinate2);
    }

    @Test
    public void hashCodeCoordinatesHashCodesShouldBeEqual() {
        Coordinate coordinate1 = new Coordinate();
        coordinate1.setLatitude(0.00001);
        coordinate1.setLongitude(0.00001);
        Coordinate coordinate2 = new Coordinate();
        coordinate2.setLatitude(0.00009);
        coordinate2.setLongitude(0.00009);

        assertEquals(coordinate1.hashCode(), coordinate2.hashCode());
    }

    @Test
    public void hashCodeCoordinatesHashCodesShouldNotBeEqual() {
        Coordinate coordinate1 = new Coordinate();
        coordinate1.setLatitude(0.0001);
        coordinate1.setLongitude(0.0001);
        Coordinate coordinate2 = new Coordinate();
        coordinate2.setLatitude(0.0009);
        coordinate2.setLongitude(0.0009);

        assertNotEquals(coordinate1.hashCode(), coordinate2.hashCode());
    }
}
