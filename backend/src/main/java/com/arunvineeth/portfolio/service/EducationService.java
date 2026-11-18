package com.arunvineeth.portfolio.service;

import com.arunvineeth.portfolio.model.Education;
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

public class EducationService {

    private static final Logger log = LoggerFactory.getLogger(EducationService.class);
    private static final String CACHE_KEY = "education:all";

    @SuppressWarnings("unchecked")
    public List<Education> getAllEducation() {
        Object cached = MemcachedUtil.get(CACHE_KEY);
        if (cached instanceof List<?> list) {
            log.info("CACHE HIT – education from Memcached.");
            return (List<Education>) list;
        }
        log.info("CACHE MISS – fetching education from MySQL.");

        List<Education> educationList = loadFromDatabase();
        if (!educationList.isEmpty()) {
            MemcachedUtil.set(CACHE_KEY, MemcachedUtil.DEFAULT_TTL, educationList);
        }
        return educationList;
    }

    private List<Education> loadFromDatabase() {
        List<Education> list = new ArrayList<>();
        final String sql =
            "SELECT id, degree, institution, university, year_range, cgpa_grade, sort_order " +
            "FROM education ORDER BY sort_order";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Education e = new Education();
                e.setId(rs.getInt("id"));
                e.setDegree(rs.getString("degree"));
                e.setInstitution(rs.getString("institution"));
                e.setUniversity(rs.getString("university"));
                e.setYearRange(rs.getString("year_range"));
                e.setCgpaGrade(rs.getString("cgpa_grade"));
                e.setSortOrder(rs.getInt("sort_order"));
                list.add(e);
            }
        } catch (SQLException e) {
            log.error("MySQL error loading education: {}", e.getMessage());
        }
        return list;
    }
}
