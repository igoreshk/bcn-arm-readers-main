package com.epam.beacons.cloud.monitor.service.config;

import com.epam.beacons.cloud.monitor.service.domain.RawReaderData;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.FailedDeserializationInfo;
import org.springframework.stereotype.Component;

@Component
public class RawReaderDataDeserializer implements Deserializer<RawReaderData> {

    private static final Logger LOGGER = LogManager.getLogger(RawReaderDataDeserializer.class);

    private final ErrorHandlingDeserializer<RawReaderData> errorHandlingDeserializer;

    public RawReaderDataDeserializer() {
        errorHandlingDeserializer = new ErrorHandlingDeserializer<>(this::deserializeMessage);
        errorHandlingDeserializer.setFailedDeserializationFunction(this::onFail);
    }

    private RawReaderData deserializeMessage(String topic, byte[] data) {
        String[] fields = new String(data, StandardCharsets.UTF_8).split(" ");
        if (data.length == 0) {
            throw new IllegalArgumentException("The message is empty.");
        } else if (fields.length < 6 || fields.length > 9) {
            throw new IllegalArgumentException("The number of fields in the message is less than 6 or larger than 9.");
        } else {
            ZoneOffset currentZone = OffsetDateTime.now().getOffset();
            RawReaderData dto = new RawReaderData();

            dto.setReaderUuid(fields[0]);
            dto.setTimestamp(LocalDateTime.ofEpochSecond(Long.parseLong(fields[1]), 0, currentZone));
            dto.setDeviceId(topic);
            dto.setRssi(Integer.parseInt(fields[4]));
            dto.setReferencePower(Integer.parseInt(fields[5]));

            if (fields.length > 6) {
                dto.setHeartRate(Integer.parseInt(fields[6]));
                dto.setBodyTemperature(Double.parseDouble(fields[7]) / 10);
                dto.setStepCount(Integer.parseInt(fields[8]));
            }
            return dto;
        }
    }

    private RawReaderData onFail(FailedDeserializationInfo failedDeserializationInfo) {
        LOGGER.error(
                "Deserialization error in topic {}, the message will be skipped. "
                        + "Received message:\n{}\n"
                        + "Deserialization error:\n{}",
                failedDeserializationInfo.getTopic(),
                new String(failedDeserializationInfo.getData(), StandardCharsets.UTF_8),
                failedDeserializationInfo.getException()
        );
        return null;
    }

    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
        errorHandlingDeserializer.configure(configs, isKey);
    }

    @Override
    public RawReaderData deserialize(String topic, byte[] data) {
        return errorHandlingDeserializer.deserialize(topic, data);
    }

    @Override
    public void close() {
        errorHandlingDeserializer.close();
    }
}
