package com.arunvineeth.portfolio.service;

import com.arunvineeth.portfolio.model.ContactMessage;
import com.arunvineeth.portfolio.util.DatabaseUtil;
import com.arunvineeth.portfolio.util.RabbitMQUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * ContactService
 *
 *  submit()       – validates, publishes to RabbitMQ, returns true on success.
 *  saveToDatabase()  – called by the RabbitMQ consumer after consuming the message.
 */
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);
    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * Validates the message, serialises it to JSON, and publishes to RabbitMQ.
     * @return true if published successfully.
     */
    public boolean submit(ContactMessage msg) {
        if (!isValid(msg)) {
            log.warn("ContactService.submit: validation failed.");
            return false;
        }
        try {
            String json = mapper.writeValueAsString(msg);
            boolean published = RabbitMQUtil.publish(json);
            if (published) {
                log.info("Contact message from '{}' published to RabbitMQ.", msg.getSenderName());
            } else {
                log.error("Failed to publish contact message to RabbitMQ.");
            }
            return published;
        } catch (Exception e) {
            log.error("ContactService.submit error: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Persists a processed contact message to MySQL.
     * Called by ContactWorker after consuming from RabbitMQ.
     */
    public void saveToDatabase(ContactMessage msg) {
        final String sql =
            "INSERT INTO contact_messages " +
            "  (sender_name, sender_email, subject, message, status, created_at, processed_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, msg.getSenderName());
            ps.setString(2, msg.getSenderEmail());
            ps.setString(3, msg.getSubject());
            ps.setString(4, msg.getMessage());
            ps.setString(5, "processed");
            ps.setTimestamp(6, msg.getCreatedAt() != null
                    ? Timestamp.valueOf(msg.getCreatedAt())
                    : Timestamp.valueOf(LocalDateTime.now()));
            ps.setTimestamp(7, Timestamp.valueOf(LocalDateTime.now()));
            ps.executeUpdate();
            log.info("Contact message from '{}' saved to MySQL.", msg.getSenderName());

        } catch (SQLException e) {
            log.error("MySQL error saving contact message: {}", e.getMessage());
        }
    }

    // ------------------------------------------------------------------ //

    private boolean isValid(ContactMessage msg) {
        if (msg == null) return false;
        if (isBlank(msg.getSenderName()))  return false;
        if (isBlank(msg.getSenderEmail())) return false;
        if (!msg.getSenderEmail().contains("@")) return false;
        if (isBlank(msg.getSubject()))     return false;
        if (isBlank(msg.getMessage()))     return false;
        return true;
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
