package com.arunvineeth.portfolio.model;

import java.io.Serializable;

public class Skill implements Serializable {

    private static final long serialVersionUID = 1L;

    private int    id;
    private String name;
    private String category;
    private String iconKey;
    private int    sortOrder;

    public Skill() {}

    public int    getId()                  { return id; }
    public void   setId(int id)            { this.id = id; }

    public String getName()                { return name; }
    public void   setName(String v)        { this.name = v; }

    public String getCategory()            { return category; }
    public void   setCategory(String v)    { this.category = v; }

    public String getIconKey()             { return iconKey; }
    public void   setIconKey(String v)     { this.iconKey = v; }

    public int    getSortOrder()           { return sortOrder; }
    public void   setSortOrder(int v)      { this.sortOrder = v; }
}
