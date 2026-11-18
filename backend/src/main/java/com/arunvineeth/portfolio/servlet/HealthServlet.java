package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.util.CorsUtil;
import com.arunvineeth.portfolio.util.DatabaseUtil;
import com.arunvineeth.portfolio.util.MemcachedUtil;
import com.arunvineeth.portfolio.util.RabbitMQUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.Connection;

/**
 * HealthServlet
 *
 *  GET /api/health
 *
 *  Returns the health status of all backend services.
 *  Useful for Docker health checks and troubleshooting.
 */
@WebServlet("/api/health")
public class HealthServlet extends HttpServlet {

    private static final Logger log = LoggerFactory.getLogger(HealthServlet.class);

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        CorsUtil.addCorsHeaders(req, res);
        res.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);

        boolean mysqlOk      = checkMySQL();
        boolean memcachedOk  = checkMemcached();
        boolean rabbitmqOk   = checkRabbitMQ();
        boolean allOk        = mysqlOk && memcachedOk && rabbitmqOk;

        String json = String.format(
            "{" +
            "\"status\":\"%s\"," +
            "\"services\":{" +
              "\"mysql\":\"%s\"," +
              "\"memcached\":\"%s\"," +
              "\"rabbitmq\":\"%s\"" +
            "}," +
            "\"application\":\"Arun Vineeth Portfolio\"," +
            "\"version\":\"1.0.0\"" +
            "}",
            allOk ? "UP" : "DEGRADED",
            mysqlOk     ? "UP" : "DOWN",
            memcachedOk ? "UP" : "DOWN",
            rabbitmqOk  ? "UP" : "DOWN"
        );

        int statusCode = allOk ? 200 : 503;
        CorsUtil.writeJson(res, statusCode, json);
    }

    private boolean checkMySQL() {
        try (Connection conn = DatabaseUtil.getConnection()) {
            return conn != null && conn.isValid(2);
        } catch (Exception e) {
            log.warn("MySQL health check failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean checkMemcached() {
        try {
            if (MemcachedUtil.getClient() == null) return false;
            MemcachedUtil.set("health:ping", 10, "pong");
            Object result = MemcachedUtil.get("health:ping");
            return "pong".equals(result);
        } catch (Exception e) {
            log.warn("Memcached health check failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean checkRabbitMQ() {
        try {
            var conn = RabbitMQUtil.getConnection();
            return conn != null && conn.isOpen();
        } catch (Exception e) {
            log.warn("RabbitMQ health check failed: {}", e.getMessage());
            return false;
        }
    }
}
