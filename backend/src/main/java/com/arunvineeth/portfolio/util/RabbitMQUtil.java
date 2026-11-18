package com.arunvineeth.portfolio.util;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * RabbitMQUtil – manages a shared RabbitMQ connection and provides
 * helper methods for publishing messages.
 *
 * Environment variables:
 *   RABBITMQ_HOST     – default "rabbitmq"
 *   RABBITMQ_PORT     – default "5672"
 *   RABBITMQ_USER     – default "guest"
 *   RABBITMQ_PASSWORD – default "guest"
 *
 * Queue: portfolio_contact_queue (durable)
 */
public class RabbitMQUtil {

    private static final Logger log = LoggerFactory.getLogger(RabbitMQUtil.class);

    public static final String CONTACT_QUEUE = "portfolio_contact_queue";

    private static Connection connection;
    private static final Object lock = new Object();

    /** Returns (or lazily creates) the shared connection. */
    public static Connection getConnection() {
        synchronized (lock) {
            if (connection == null || !connection.isOpen()) {
                connection = createConnection();
            }
            return connection;
        }
    }

    /** Publishes a plain-text (UTF-8) message to the contact queue. */
    public static boolean publish(String jsonMessage) {
        Connection conn = getConnection();
        if (conn == null) {
            log.error("Cannot publish: RabbitMQ connection unavailable.");
            return false;
        }
        try (Channel channel = conn.createChannel()) {
            // Declare the queue as durable so it survives broker restarts.
            channel.queueDeclare(CONTACT_QUEUE, true, false, false, null);
            channel.basicPublish(
                    "",              // default exchange
                    CONTACT_QUEUE,   // routing key = queue name
                    null,
                    jsonMessage.getBytes(java.nio.charset.StandardCharsets.UTF_8)
            );
            log.info("Published message to queue '{}'", CONTACT_QUEUE);
            return true;
        } catch (IOException | TimeoutException e) {
            log.error("Failed to publish to RabbitMQ: {}", e.getMessage());
            return false;
        }
    }

    /** Closes the shared connection (called on application shutdown). */
    public static void close() {
        synchronized (lock) {
            if (connection != null && connection.isOpen()) {
                try {
                    connection.close();
                    log.info("RabbitMQ connection closed.");
                } catch (IOException e) {
                    log.warn("Error closing RabbitMQ connection: {}", e.getMessage());
                }
                connection = null;
            }
        }
    }

    // ------------------------------------------------------------------ //

    private static Connection createConnection() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(getEnv("RABBITMQ_HOST",     "rabbitmq"));
        factory.setPort(Integer.parseInt(getEnv("RABBITMQ_PORT", "5672")));
        factory.setUsername(getEnv("RABBITMQ_USER",     "guest"));
        factory.setPassword(getEnv("RABBITMQ_PASSWORD", "guest"));
        factory.setAutomaticRecoveryEnabled(true);
        factory.setNetworkRecoveryInterval(5000);
        factory.setConnectionTimeout(10_000);
        try {
            Connection conn = factory.newConnection();
            log.info("Connected to RabbitMQ at {}:{}", factory.getHost(), factory.getPort());
            return conn;
        } catch (IOException | TimeoutException e) {
            log.error("Could not connect to RabbitMQ: {}", e.getMessage());
            return null;
        }
    }

    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }

    private RabbitMQUtil() { /* utility class */ }
}
