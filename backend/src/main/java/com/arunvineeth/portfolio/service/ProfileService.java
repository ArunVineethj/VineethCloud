package com.arunvineeth.portfolio.service;

import com.arunvineeth.portfolio.model.Profile;
import com.arunvineeth.portfolio.util.DatabaseUtil;
import com.arunvineeth.portfolio.util.MemcachedUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * ProfileService – implements the cache-aside pattern.
 *
 * Cache key : "profile:1"
 * TTL       : MemcachedUtil.DEFAULT_TTL (300 seconds)
 *
 * Flow:
 *   1. Check Memcached.
 *   2. HIT  → return Profile with source = "MEMCACHED"
 *   3. MISS → load from MySQL, store in Memcached, return with source = "MYSQL"
 */
public class ProfileService {

    private static final Logger log = LoggerFactory.getLogger(ProfileService.class);
    private static final String CACHE_KEY = "profile:1";

    /**
     * Returns the first profile row.
     * The returned Profile always has its "source" field set.
     * Returns null if neither Memcached nor MySQL can provide the data.
     */
    public Profile getProfile() {
        // ---- Step 1: try Memcached ----
        Object cached = MemcachedUtil.get(CACHE_KEY);
        if (cached instanceof Profile cachedProfile) {
            log.info("CACHE HIT  – profile retrieved from Memcached.");
            cachedProfile.setSource("MEMCACHED");
            return cachedProfile;
        }
        log.info("CACHE MISS – fetching profile from MySQL.");

        // ---- Step 2: load from MySQL ----
        Profile profile = loadFromDatabase();
        if (profile == null) {
            log.error("Profile not found in MySQL.");
            return null;
        }

        // ---- Step 3: populate Memcached ----
        MemcachedUtil.set(CACHE_KEY, MemcachedUtil.DEFAULT_TTL, profile);
        log.info("Profile stored in Memcached with TTL={}s.", MemcachedUtil.DEFAULT_TTL);

        profile.setSource("MYSQL");
        return profile;
    }

    /** Removes the profile entry from Memcached (for cache-clear testing). */
    public void clearCache() {
        MemcachedUtil.delete(CACHE_KEY);
        log.info("Profile cache cleared.");
    }

    // ------------------------------------------------------------------ //

    private Profile loadFromDatabase() {
        final String sql =
            "SELECT id, full_name, designation, degree, college, university, " +
            "       cgpa, school, location, about_text, github_url, linkedin_url, email " +
            "FROM   profile LIMIT 1";

        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                Profile p = new Profile();
                p.setId(rs.getInt("id"));
                p.setFullName(rs.getString("full_name"));
                p.setDesignation(rs.getString("designation"));
                p.setDegree(rs.getString("degree"));
                p.setCollege(rs.getString("college"));
                p.setUniversity(rs.getString("university"));
                p.setCgpa(rs.getString("cgpa"));
                p.setSchool(rs.getString("school"));
                p.setLocation(rs.getString("location"));
                p.setAboutText(rs.getString("about_text"));
                p.setGithubUrl(rs.getString("github_url"));
                p.setLinkedinUrl(rs.getString("linkedin_url"));
                p.setEmail(rs.getString("email"));
                return p;
            }
        } catch (SQLException e) {
            log.error("MySQL error loading profile: {}", e.getMessage());
        }
        return null;
    }
}
