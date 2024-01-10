package com.epam.beacons.cloud.monitor.service.config;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import com.epam.beacons.cloud.monitor.service.domain.RawReaderData;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import org.junit.AfterClass;
import org.junit.Test;

public class RawReaderDataDeserializerTest {

    private static final RawReaderDataDeserializer deserializer = new RawReaderDataDeserializer();

    @Test
    public void testDeserializationCase1() {
        RawReaderData rawReaderData = deserializer
                .deserialize("some_topic", "station_id 100000000 10 10 20 30".getBytes());

        assertEquals("some_topic", rawReaderData.getDeviceId());
        assertEquals("station_id", rawReaderData.getReaderUuid());
        assertEquals(
                LocalDateTime.ofEpochSecond(100000000L, 0, OffsetDateTime.now().getOffset()),
                rawReaderData.getTimestamp()
        );
        assertEquals(20, rawReaderData.getRssi());
        assertEquals(30, rawReaderData.getReferencePower());
    }

    @Test
    public void testDeserializationCase2() {
        RawReaderData rawReaderData = deserializer
                .deserialize("some_topic", "blescan-007.petersburg.epam.com 1603718242 8 1 -77 -83".getBytes());

        assertEquals("some_topic", rawReaderData.getDeviceId());
        assertEquals("blescan-007.petersburg.epam.com", rawReaderData.getReaderUuid());
        assertEquals(
                LocalDateTime.ofEpochSecond(1603718242L, 0, OffsetDateTime.now().getOffset()),
                rawReaderData.getTimestamp()
        );
        assertEquals(-77, rawReaderData.getRssi());
        assertEquals(-83, rawReaderData.getReferencePower());
    }

    @Test
    public void testExtendedFormatDeserialization() {
        RawReaderData rawReaderData = deserializer
                .deserialize("some_topic",
                        "blescan-007.petersburg.epam.com 1603718242 8 1 -77 -83 70 36.5 7835".getBytes());

        assertEquals("some_topic", rawReaderData.getDeviceId());
        assertEquals("blescan-007.petersburg.epam.com", rawReaderData.getReaderUuid());
        assertEquals(
                LocalDateTime.ofEpochSecond(1603718242L, 0, OffsetDateTime.now().getOffset()),
                rawReaderData.getTimestamp()
        );
        assertEquals(-77, rawReaderData.getRssi());
        assertEquals(-83, rawReaderData.getReferencePower());
        assertEquals(70, rawReaderData.getHeartRate());
        assertEquals(3.65, rawReaderData.getBodyTemperature(), 0.01);
        assertEquals(7835, rawReaderData.getStepCount());
    }

    @Test
    public void testEmptyMessage() {
        RawReaderData rawReaderData = deserializer.deserialize("some_topic", "".getBytes());
        assertNull(rawReaderData);
    }

    @Test
    public void testIncorrectNumberOfFields() {
        RawReaderData rawReaderData = deserializer.deserialize("some_topic", "invalid_message".getBytes());
        assertNull(rawReaderData);
    }

    @Test
    public void testIncorrectFieldType() {
        RawReaderData rawReaderData = deserializer
                .deserialize("some_topic", "station_id 100000000 10 20 ABCDEFG 30".getBytes());
        assertNull(rawReaderData);
    }

    @AfterClass
    public static void clean() {
        deserializer.close();
    }
}
