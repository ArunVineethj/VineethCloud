package com.arunvineeth.portfolio.servlet;

import com.arunvineeth.portfolio.model.Education;
import com.arunvineeth.portfolio.service.EducationService;
import com.arunvineeth.portfolio.util.CorsUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/** GET /api/education – returns all education records */
@WebServlet("/api/education")
public class EducationServlet extends HttpServlet {

    private final EducationService educationService = new EducationService();
    private final ObjectMapper     mapper           = new ObjectMapper();

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        CorsUtil.addCorsHeaders(req, res);
        res.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        CorsUtil.addCorsHeaders(req, res);
        List<Education> educationList = educationService.getAllEducation();
        CorsUtil.writeJson(res, 200, mapper.writeValueAsString(educationList));
    }
}
