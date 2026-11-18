package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.model.Skill;
import com.arunvineeth.portfolio.service.SkillService;
import com.arunvineeth.portfolio.util.CorsUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/** GET /api/skills – returns all skills */
@WebServlet("/api/skills")
public class SkillsServlet extends HttpServlet {

    private final SkillService skillService = new SkillService();
    private final ObjectMapper mapper       = new ObjectMapper();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        CorsUtil.addCorsHeaders(req, res);
        res.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);
        List<Skill> skills = skillService.getAllSkills();
        CorsUtil.writeJson(res, 200, mapper.writeValueAsString(skills));
    }
}
