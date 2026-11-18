package com.arunvineeth.portfolio.model;

import java.io.Serializable;

public class Education implements Serializable {

    private static final long serialVersionUID = 1L;

    private int    id;
    private String degree;
    private String institution;
    private String university;
    private String yearRange;
    private String cgpaGrade;
    private int    sortOrder;

    public Education() {}

    public int    getId()                   { return id; }
    public void   setId(int id)             { this.id = id; }

    public String getDegree()               { return degree; }
    public void   setDegree(String v)       { this.degree = v; }

    public String getInstitution()          { return institution; }
    public void   setInstitution(String v)  { this.institution = v; }

    public String getUniversity()           { return university; }
    public void   setUniversity(String v)   { this.university = v; }

    public String getYearRange()            { return yearRange; }
    public void   setYearRange(String v)    { this.yearRange = v; }

    public String getCgpaGrade()            { return cgpaGrade; }
    public void   setCgpaGrade(String v)    { this.cgpaGrade = v; }

    public int    getSortOrder()            { return sortOrder; }
    public void   setSortOrder(int v)       { this.sortOrder = v; }
}
