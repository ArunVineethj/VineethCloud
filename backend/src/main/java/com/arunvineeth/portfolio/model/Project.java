package com.arunvineeth.portfolio.model;

import java.io.Serializable;

public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    private int    id;
    private String title;
    private String description;
    private String techStack;
    private String githubUrl;
    private String demoUrl;
    private int    sortOrder;

    public Project() {}

    public int    getId()                  { return id; }
    public void   setId(int id)            { this.id = id; }

    public String getTitle()               { return title; }
    public void   setTitle(String v)       { this.title = v; }

    public String getDescription()         { return description; }
    public void   setDescription(String v) { this.description = v; }

    public String getTechStack()           { return techStack; }
    public void   setTechStack(String v)   { this.techStack = v; }

    public String getGithubUrl()           { return githubUrl; }
    public void   setGithubUrl(String v)   { this.githubUrl = v; }

    public String getDemoUrl()             { return demoUrl; }
    public void   setDemoUrl(String v)     { this.demoUrl = v; }

    public int    getSortOrder()           { return sortOrder; }
    public void   setSortOrder(int v)      { this.sortOrder = v; }
}
