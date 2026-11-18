package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.model.Profile;
import com.arunvineeth.portfolio.service.ProfileService;
import com.arunvineeth.portfolio.util.CorsUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * ProfileServlet
 *
 *  GET  /api/profile         – returns profile data with cache source indicator.
 *  DELETE /api/profile/cache – clears the Memcached profile entry.
 */
@WebServlet(urlPatterns = {"/api/profile", "/api/profile/cache"})
public class ProfileServlet extends HttpServlet {

    private static final Logger log = LoggerFactory.getLogger(ProfileServlet.class);
    private final ProfileService profileService = new ProfileService();
    private final ObjectMapper   mapper         = new ObjectMapper();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        CorsUtil.addCorsHeaders(req, res);
        res.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);

        Profile profile = profileService.getProfile();

        if (profile == null) {
            CorsUtil.writeJson(res, 503,
                "{\"error\":\"Profile data unavailable. MySQL or Memcached may be down.\"}");
            return;
        }

        // Build response map matching the frontend API contract
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name",        profile.getFullName());
        body.put("designation", profile.getDesignation());
        body.put("degree",      profile.getDegree());
        body.put("college",     profile.getCollege());
        body.put("university",  profile.getUniversity());
        body.put("cgpa",        profile.getCgpa());
        body.put("school",      profile.getSchool());
        body.put("location",    profile.getLocation());
        body.put("aboutText",   profile.getAboutText());
        body.put("githubUrl",   profile.getGithubUrl());
        body.put("linkedinUrl", profile.getLinkedinUrl());
        body.put("email",       profile.getEmail());
        // source is set by the service layer: "MYSQL" or "MEMCACHED"
        body.put("source",      profile.getSource());

        CorsUtil.writeJson(res, 200, mapper.writeValueAsString(body));
    }

    /** DELETE /api/profile/cache – clears the profile cache entry */
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);
        profileService.clearCache();
        CorsUtil.writeJson(res, 200,
            "{\"message\":\"Profile cache cleared. Next request will fetch from MySQL.\"}");
    }
}
