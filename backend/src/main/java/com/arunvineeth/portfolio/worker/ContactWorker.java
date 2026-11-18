package com.arunvineeth.portfolio.worker;

import com.arunvineeth.portfolio.model.ContactMessage;
import com.arunvineeth.portfolio.service.ContactService;
import com.arunvineeth.portfolio.util.RabbitMQUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.DeliverCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;

/**
 * ContactWorker – a lightweight Runnable that runs inside Tomcat's JVM.
 *
 * It opens one RabbitMQ channel, consumes messages from
 * portfolio_contact_queue, deserialises them, and delegates to
 * ContactService.saveToDatabase().
 *
 * Started by AppLifecycleListener on application startup.
 * The thread is a daemon thread so it does not prevent Tomcat shutdown.
 */
public class ContactWorker implements Runnable {

    private static final Logger log = LoggerFactory.getLogger(ContactWorker.class);
    private static final ObjectMapper mapper;

    static {
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    private volatile boolean running = true;
    private final ContactService contactService = new ContactService();

    @Override
    public void run() {
        log.info("ContactWorker starting – waiting for RabbitMQ connection...");

        // Retry loop: RabbitMQ may not be ready on first attempt
        while (running) {
            try {
                connectAndConsume();
            } catch (Exception e) {
                log.error("ContactWorker error: {} – retrying in 10s", e.getMessage());
                sleep(10_000);
            }
        }
        log.info("ContactWorker stopped.");
    }

    public void stop() {
        running = false;
    }

    // ------------------------------------------------------------------ //

    private void connectAndConsume() throws Exception {
        Connection conn = RabbitMQUtil.getConnection();
        if (conn == null) {
            log.warn("RabbitMQ connection not available yet, retrying in 10s...");
            sleep(10_000);
            return;
        }

        try (Channel channel = conn.createChannel()) {
            channel.queueDeclare(RabbitMQUtil.CONTACT_QUEUE, true, false, false, null);

            // Manual acknowledgement: ack only after successful DB save
            channel.basicQos(1);

            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String json = new String(delivery.getBody(), StandardCharsets.UTF_8);
                log.info("ContactWorker received message from queue.");
                try {
                    ContactMessage msg = mapper.readValue(json, ContactMessage.class);
                    contactService.saveToDatabase(msg);
                    channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    log.info("ContactWorker: message acknowledged and saved.");
                } catch (Exception e) {
                    log.error("ContactWorker: failed to process message – {}", e.getMessage());
                    // Nack without requeue to avoid infinite poison-pill loop
                    channel.basicNack(delivery.getEnvelope().getDeliveryTag(), false, false);
                }
            };

            channel.basicConsume(RabbitMQUtil.CONTACT_QUEUE, false, deliverCallback, ct -> {});
            log.info("ContactWorker: listening on queue '{}'", RabbitMQUtil.CONTACT_QUEUE);

            // Block this thread while the channel is open
            while (running && channel.isOpen()) {
                sleep(2_000);
            }
        }
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
    }
}
