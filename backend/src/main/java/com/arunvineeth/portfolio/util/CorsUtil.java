package com.arunvineeth.portfolio.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * CorsUtil – sets CORS headers on every API response.
 *
 * During development the React Vite dev-server runs on a different port,
 * so broad CORS headers are helpful.  In production, Tomcat serves both
 * the static files and the APIs from the same origin, so the headers are
 * harmless but still present.
 */
public class CorsUtil {

    public static void addCorsHeaders(HttpServletRequest req, HttpServletResponse res) {
        String origin = req.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            res.setHeader("Access-Control-Allow-Origin",  origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
        }
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
        res.setHeader("Access-Control-Max-Age", "3600");
    }

    public static void writeJson(HttpServletResponse res, int status, String json) throws java.io.IOException {
        res.setStatus(status);
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");
        res.getWriter().write(json);
    }

    private CorsUtil() {}
}
