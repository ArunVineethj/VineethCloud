package com.arunvineeth.portfolio.model;

import java.io.Serializable;

/**
 * Profile – stores personal information.
 * Implements Serializable so Spymemcached can serialise it.
 * The "source" field is set by the service layer (MYSQL / MEMCACHED)
 * and is NOT stored in the database.
 */
public class Profile implements Serializable {

    private static final long serialVersionUID = 1L;

    private int    id;
    private String fullName;
    private String designation;
    private String degree;
    private String college;
    private String university;
    private String cgpa;
    private String school;
    private String location;
    private String aboutText;
    private String githubUrl;
    private String linkedinUrl;
    private String email;

    // Not persisted – assigned at the service / servlet layer
    private String source;

    public Profile() {}

    // ------------------------------------------------------------------ //
    // Getters and setters
    // ------------------------------------------------------------------ //

    public int getId()                    { return id; }
    public void setId(int id)             { this.id = id; }

    public String getFullName()           { return fullName; }
    public void setFullName(String v)     { this.fullName = v; }

    public String getDesignation()        { return designation; }
    public void setDesignation(String v)  { this.designation = v; }

    public String getDegree()             { return degree; }
    public void setDegree(String v)       { this.degree = v; }

    public String getCollege()            { return college; }
    public void setCollege(String v)      { this.college = v; }

    public String getUniversity()         { return university; }
    public void setUniversity(String v)   { this.university = v; }

    public String getCgpa()               { return cgpa; }
    public void setCgpa(String v)         { this.cgpa = v; }

    public String getSchool()             { return school; }
    public void setSchool(String v)       { this.school = v; }

    public String getLocation()           { return location; }
    public void setLocation(String v)     { this.location = v; }

    public String getAboutText()          { return aboutText; }
    public void setAboutText(String v)    { this.aboutText = v; }

    public String getGithubUrl()          { return githubUrl; }
    public void setGithubUrl(String v)    { this.githubUrl = v; }

    public String getLinkedinUrl()        { return linkedinUrl; }
    public void setLinkedinUrl(String v)  { this.linkedinUrl = v; }

    public String getEmail()              { return email; }
    public void setEmail(String v)        { this.email = v; }

    public String getSource()             { return source; }
    public void setSource(String source)  { this.source = source; }
}
