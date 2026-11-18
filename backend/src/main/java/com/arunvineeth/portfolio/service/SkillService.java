package com.arunvineeth.portfolio.service;

import com.arunvineeth.portfolio.model.Skill;
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

public class SkillService {

    private static final Logger log = LoggerFactory.getLogger(SkillService.class);
    private static final String CACHE_KEY = "skills:all";

    @SuppressWarnings("unchecked")
    public List<Skill> getAllSkills() {
        Object cached = MemcachedUtil.get(CACHE_KEY);
        if (cached instanceof List<?> list) {
            log.info("CACHE HIT – skills from Memcached.");
            return (List<Skill>) list;
        }
        log.info("CACHE MISS – fetching skills from MySQL.");

        List<Skill> skills = loadFromDatabase();
        if (!skills.isEmpty()) {
            MemcachedUtil.set(CACHE_KEY, MemcachedUtil.DEFAULT_TTL, skills);
        }
        return skills;
    }

    private List<Skill> loadFromDatabase() {
        List<Skill> skills = new ArrayList<>();
        final String sql = "SELECT id, name, category, icon_key, sort_order FROM skills ORDER BY sort_order";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Skill s = new Skill();
                s.setId(rs.getInt("id"));
                s.setName(rs.getString("name"));
                s.setCategory(rs.getString("category"));
                s.setIconKey(rs.getString("icon_key"));
                s.setSortOrder(rs.getInt("sort_order"));
                skills.add(s);
            }
        } catch (SQLException e) {
            log.error("MySQL error loading skills: {}", e.getMessage());
        }
        return skills;
    }
}
