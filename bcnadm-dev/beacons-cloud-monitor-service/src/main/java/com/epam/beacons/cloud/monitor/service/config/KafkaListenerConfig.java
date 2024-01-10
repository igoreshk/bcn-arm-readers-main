package com.epam.beacons.cloud.monitor.service.config;

import com.epam.beacons.cloud.monitor.service.domain.FlatBeaconPositionDto;
import com.epam.beacons.cloud.monitor.service.domain.RawReaderData;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.IntegerDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

/**
 * Kafka listener config for FlatBeaconPosition.
 */
@EnableKafka
@Configuration
public class KafkaListenerConfig {

    private final KafkaProperties kafkaProperties;
    private final RawReaderDataDeserializer deserializer;

    public KafkaListenerConfig(KafkaProperties kafkaProperties, RawReaderDataDeserializer deserializer) {
        this.kafkaProperties = kafkaProperties;
        this.deserializer = deserializer;
    }

    /**
     * {@link ConsumerFactory} for receiving data from readers.
     *
     * @return DefaultKafkaConsumerFactory
     */
    @Bean
    public ConsumerFactory<Integer, RawReaderData> readerConsumerFactory(
            @Value("${spring.kafka.consumer.group-id.reader}") String groupId
    ) {
        Map<String, Object> consumerProperties = kafkaProperties.buildConsumerProperties();
        consumerProperties.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        return new DefaultKafkaConsumerFactory<>(consumerProperties, new IntegerDeserializer(), deserializer);
    }

    /**
     * {@link ConsumerFactory} for receiving data from mobile devices.
     *
     * @return DefaultKafkaConsumerFactory
     */
    @Bean
    public ConsumerFactory<String, FlatBeaconPositionDto> mobileConsumerFactory(
            @Value("${spring.kafka.consumer.group-id.mobile}") String groupId
    ) {
        Map<String, Object> consumerProperties = kafkaProperties.buildConsumerProperties();
        consumerProperties.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        return new DefaultKafkaConsumerFactory<>(
                consumerProperties, new StringDeserializer(),
                new JsonDeserializer<>(FlatBeaconPositionDto.class, false)
        );
    }
}
