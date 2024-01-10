package com.epam.beacons.cloud.service.mobile.config;

import com.epam.beacons.cloud.service.mobile.domain.MobileDto;
import java.util.HashMap;
import java.util.Map;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

/**
 * Custom Kafka ProducerFactory configuration.
 **/
@Configuration
public class KafkaConfiguration {

    @Value("${spring.kafka.property.bootstrap.servers}")
    private String bootstrapServers;
    @Value("${spring.kafka.property.retries}")
    private String retries;
    @Value("${spring.kafka.property.batch.size}")
    private String batchSize;
    @Value("${spring.kafka.property.linger.ms}")
    private String linger;
    @Value("${spring.kafka.property.buffer.memory}")
    private String bufferMemory;

    private final KafkaProperties kafkaProperties;

    public KafkaConfiguration(KafkaProperties kafkaProperties) {
        this.kafkaProperties = kafkaProperties;
    }

    /**
     * Custom producer configs.
     *
     * @return Map with properties
     */
    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> props = new HashMap<>(kafkaProperties.buildProducerProperties());
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.RETRIES_CONFIG, retries);
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, batchSize);
        props.put(ProducerConfig.LINGER_MS_CONFIG, linger);
        props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, bufferMemory);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return props;
    }

    /**
     * Custom producer factory.
     *
     * @return DefaultKafkaProducerFactory
     */
    @Bean
    public ProducerFactory<String, MobileDto> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    /**
     * Custom kafka template.
     *
     * @return KafkaTemplate
     */
    @Bean
    public KafkaTemplate<String, MobileDto> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
