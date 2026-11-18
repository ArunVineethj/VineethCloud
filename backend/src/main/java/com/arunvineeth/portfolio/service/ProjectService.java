package com.arunvineeth.portfolio.service;

import com.arunvineeth.portfolio.model.Project;
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

public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);
    private static final String CACHE_KEY = "projects:all";

    @SuppressWarnings("unchecked")
    public List<Project> getAllProjects() {
        Object cached = MemcachedUtil.get(CACHE_KEY);
        if (cached instanceof List<?> list) {
            log.info("CACHE HIT – projects from Memcached.");
            return (List<Project>) list;
        }
        log.info("CACHE MISS – fetching projects from MySQL.");

        List<Project> projects = loadFromDatabase();
        if (!projects.isEmpty()) {
            MemcachedUtil.set(CACHE_KEY, MemcachedUtil.DEFAULT_TTL, projects);
        }
        return projects;
    }

    private List<Project> loadFromDatabase() {
        List<Project> projects = new ArrayList<>();
        final String sql =
            "SELECT id, title, description, tech_stack, github_url, demo_url, sort_order " +
            "FROM projects ORDER BY sort_order";
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Project p = new Project();
                p.setId(rs.getInt("id"));
                p.setTitle(rs.getString("title"));
                p.setDescription(rs.getString("description"));
                p.setTechStack(rs.getString("tech_stack"));
                p.setGithubUrl(rs.getString("github_url"));
                p.setDemoUrl(rs.getString("demo_url"));
                p.setSortOrder(rs.getInt("sort_order"));
                projects.add(p);
            }
        } catch (SQLException e) {
            log.error("MySQL error loading projects: {}", e.getMessage());
        }
        return projects;
    }
}
