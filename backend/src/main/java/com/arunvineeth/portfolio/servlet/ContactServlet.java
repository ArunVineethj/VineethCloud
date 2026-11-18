package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.model.ContactMessage;
import com.arunvineeth.portfolio.service.ContactService;
import com.arunvineeth.portfolio.util.CorsUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * ContactServlet
 *
 *  POST /api/contact
 *    Request body (JSON):
 *      { "senderName": "...", "senderEmail": "...", "subject": "...", "message": "..." }
 *    Response:
 *      201 { "message": "Your message has been received..." }
 *      400 { "error": "..." }
 *      500 { "error": "..." }
 */
@WebServlet("/api/contact")
public class ContactServlet extends HttpServlet {

    private static final Logger log = LoggerFactory.getLogger(ContactServlet.class);
    private final ContactService contactService = new ContactService();
    private final ObjectMapper   mapper         = new ObjectMapper();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        CorsUtil.addCorsHeaders(req, res);
        res.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);
        req.setCharacterEncoding("UTF-8");

        // Read request body
        String body = req.getReader().lines().collect(Collectors.joining());
        if (body == null || body.isBlank()) {
            CorsUtil.writeJson(res, 400, "{\"error\":\"Request body is empty.\"}");
            return;
        }

        ContactMessage msg;
        try {
            msg = mapper.readValue(body, ContactMessage.class);
        } catch (Exception e) {
            log.warn("Failed to parse contact request body: {}", e.getMessage());
            CorsUtil.writeJson(res, 400, "{\"error\":\"Invalid JSON format.\"}");
            return;
        }

        // Set timestamp
        msg.setCreatedAt(LocalDateTime.now());

        boolean submitted = contactService.submit(msg);

        if (submitted) {
            CorsUtil.writeJson(res, 201,
                "{\"message\":\"Thank you, " + escapeJson(msg.getSenderName()) +
                "! Your message has been received and is being processed.\"}");
        } else {
            CorsUtil.writeJson(res, 500,
                "{\"error\":\"Failed to send your message. Please check that all fields are valid and try again.\"}");
        }
    }

    /** Minimal JSON string escaping to prevent injection in inline JSON responses. */
    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r");
    }
}
