package com.epam.beacons.cloud.service.mobile.service;

import com.epam.beacons.cloud.service.mobile.domain.MobileDto;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

/**
 * MobileService implementation.
 */
@Service
public class MobileService {

    private static final Logger LOGGER = LogManager.getLogger(MobileService.class);

    private final KafkaTemplate<String, MobileDto> kafkaTemplate;

    public MobileService(
            KafkaTemplate<String, MobileDto> kafkaTemplate
    ) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * {@link MobileDto} is sent to Kafka topic by Kafka producer.
     *
     * @param mobileDto - data from mobile client
     */
    public void sendMessage(MobileDto mobileDto) {
        ListenableFuture<SendResult<String, MobileDto>> result = kafkaTemplate
                .send(mobileDto.getDeviceId(), mobileDto);
        result.addCallback(new ListenableFutureCallback<SendResult<String, MobileDto>>() {
            @Override
            public void onSuccess(SendResult<String, MobileDto> result) {
                LOGGER.info(
                        "Sent message=[" + mobileDto.toString() + "] with offset=["
                                + result.getRecordMetadata().offset() + "]"
                );
            }

            @Override
            public void onFailure(Throwable ex) {
                LOGGER.error("Unable to send message=[" + mobileDto.toString() + "]", ex);
            }
        });
    }
}
