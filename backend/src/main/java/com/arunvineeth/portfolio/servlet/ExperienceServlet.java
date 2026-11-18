package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.model.Experience;
import com.arunvineeth.portfolio.service.ExperienceService;
import com.arunvineeth.portfolio.util.CorsUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/** GET /api/experience – returns all experience records */
@WebServlet("/api/experience")
public class ExperienceServlet extends HttpServlet {

    private final ExperienceService experienceService = new ExperienceService();
    private final ObjectMapper      mapper            = new ObjectMapper();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        CorsUtil.addCorsHeaders(req, res);
        res.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);
        List<Experience> expList = experienceService.getAllExperience();
        CorsUtil.writeJson(res, 200, mapper.writeValueAsString(expList));
    }
}
