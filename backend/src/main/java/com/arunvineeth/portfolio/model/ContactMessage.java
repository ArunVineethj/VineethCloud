package com.arunvineeth.portfolio.model;

import java.io.Serializable;
import java.time.LocalDateTime;

public class ContactMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    private int           id;
    private String        senderName;
    private String        senderEmail;
    private String        subject;
    private String        message;
    private String        status;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    public ContactMessage() {}

    public int           getId()                       { return id; }
    public void          setId(int id)                 { this.id = id; }

    public String        getSenderName()               { return senderName; }
    public void          setSenderName(String v)       { this.senderName = v; }

    public String        getSenderEmail()              { return senderEmail; }
    public void          setSenderEmail(String v)      { this.senderEmail = v; }

    public String        getSubject()                  { return subject; }
    public void          setSubject(String v)          { this.subject = v; }

    public String        getMessage()                  { return message; }
    public void          setMessage(String v)          { this.message = v; }

    public String        getStatus()                   { return status; }
    public void          setStatus(String v)           { this.status = v; }

    public LocalDateTime getCreatedAt()                { return createdAt; }
    public void          setCreatedAt(LocalDateTime v) { this.createdAt = v; }

    public LocalDateTime getProcessedAt()              { return processedAt; }
    public void          setProcessedAt(LocalDateTime v){ this.processedAt = v; }
}
