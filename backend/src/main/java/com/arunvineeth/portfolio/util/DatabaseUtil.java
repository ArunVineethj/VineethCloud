package com.arunvineeth.portfolio.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DatabaseUtil – provides MySQL JDBC connections.
 *
 * Connection parameters are read from environment variables so that
 * the same WAR can run in any Docker environment without code changes.
 *
 *   DB_URL      – full JDBC URL, e.g. jdbc:mysql://mysql:3306/vineeth_portfolio
 *   DB_USER     – MySQL username
 *   DB_PASSWORD – MySQL password
 */
public class DatabaseUtil {

    private static final Logger log = LoggerFactory.getLogger(DatabaseUtil.class);

    private static final String DB_URL;
    private static final String DB_USER;
    private static final String DB_PASSWORD;

    static {
        // Load the MySQL driver once at class-load time.
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            log.info("MySQL JDBC driver loaded successfully.");
        } catch (ClassNotFoundException e) {
            log.error("Failed to load MySQL JDBC driver: {}", e.getMessage());
            throw new ExceptionInInitializerError(e);
        }

        DB_URL = getEnv("DB_URL",
                "jdbc:mysql://mysql:3306/vineeth_portfolio" +
                "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
        DB_USER     = getEnv("DB_USER",     "portfolio_user");
        DB_PASSWORD = getEnv("DB_PASSWORD", "portfolio_pass");
    }

    /** Returns a new JDBC connection. Caller is responsible for closing it. */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    /** Reads an environment variable; returns defaultValue if unset or blank. */
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }

    private DatabaseUtil() { /* utility class – no instances */ }
}
