package com.arunvineeth.portfolio.service;

import com.arunvineeth.portfolio.model.Experience;
import com.arunvineeth.portfolio.util.DatabaseUtil;
import com.arunvineeth.portfolio.util.MemcachedUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ExperienceService {

    private static final Logger log = LoggerFactory.getLogger(ExperienceService.class);
    private static final String CACHE_KEY = "experience:all";

    @SuppressWarnings("unchecked")
    public List<Experience> getAllExperience() {
        Object cached = MemcachedUtil.get(CACHE_KEY);
        if (cached instanceof List<?> list) {
            log.info("CACHE HIT – experience from Memcached.");
            return (List<Experience>) list;
        }
        log.info("CACHE MISS – fetching experience from MySQL.");

        List<Experience> expList = loadFromDatabase();
        if (!expList.isEmpty()) {
            MemcachedUtil.set(CACHE_KEY, MemcachedUtil.DEFAULT_TTL, expList);
        }
        return expList;
    }

    private List<Experience> loadFromDatabase() {
        List<Experience> list = new ArrayList<>();
        final String sql =
            "SELECT id, company, position, duration, description, exp_type, sort_order " +
            "FROM experience ORDER BY sort_order";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Experience e = new Experience();
                e.setId(rs.getInt("id"));
                e.setCompany(rs.getString("company"));
                e.setPosition(rs.getString("position"));
                e.setDuration(rs.getString("duration"));
                e.setDescription(rs.getString("description"));
                e.setExpType(rs.getString("exp_type"));
                e.setSortOrder(rs.getInt("sort_order"));
                list.add(e);
            }
        } catch (SQLException e) {
            log.error("MySQL error loading experience: {}", e.getMessage());
        }
        return list;
    }
}
