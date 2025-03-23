package com.javaweb.jobIT.configuration;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j(topic = "KAFKA-PRODUCER")
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, String> kafkaProducer() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(kafkaProducer());
    }

    @Bean
    public NewTopic confirmAccount() {
        return new NewTopic("confirm-account-topic", 3, (short) 1);
    }

    @Bean
    public NewTopic confirmForgotPassword() {
        return new NewTopic("confirm-forgot-password-topic", 3, (short) 1);
    }

    @Bean
    public NewTopic confirmApplication() {
        return new NewTopic("confirm-job-application-topic", 3, (short) 1);
    }

    @Bean
    public NewTopic confirmInterview() {
        return new NewTopic("confirm-job-interview-topic", 3, (short) 1);
    }

    @Bean
    public NewTopic notificationJob() {
        return new NewTopic("notification-job-topic", 3, (short) 1);
    }
}
