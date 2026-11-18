package com.arunvineeth.portfolio.model;

import java.io.Serializable;

public class Experience implements Serializable {

    private static final long serialVersionUID = 1L;

    private int    id;
    private String company;
    private String position;
    private String duration;
    private String description;
    private String expType;
    private int    sortOrder;

    public Experience() {}

    public int    getId()                   { return id; }
    public void   setId(int id)             { this.id = id; }

    public String getCompany()              { return company; }
    public void   setCompany(String v)      { this.company = v; }

    public String getPosition()             { return position; }
    public void   setPosition(String v)     { this.position = v; }

    public String getDuration()             { return duration; }
    public void   setDuration(String v)     { this.duration = v; }

    public String getDescription()          { return description; }
    public void   setDescription(String v)  { this.description = v; }

    public String getExpType()              { return expType; }
    public void   setExpType(String v)      { this.expType = v; }

    public int    getSortOrder()            { return sortOrder; }
    public void   setSortOrder(int v)       { this.sortOrder = v; }
}
