package com.epam.beacons.cloud.service.building.domain;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

/**
 * Tests for {@link VertexType}.
 */
public class VertexTypeTest {

    @Test
    public void getDefaultTest() {
        assertEquals(VertexType.NONE, VertexType.getDefault());
    }
}
