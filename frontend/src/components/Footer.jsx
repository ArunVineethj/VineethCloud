import React from 'react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__logo-bracket">{'<'}</span>
            <span className="footer__logo-name">ArunVineeth</span>
            <span className="footer__logo-bracket">{'/>'}</span>
          </div>
          <p className="footer__copy">
            © {year} Arun Vineeth J · Junior DevOps Engineer · Pudukkottai, Tamil Nadu
          </p>
          <div className="footer__stack">
            <span>React</span>
            <span>+</span>
            <span>Java Servlets</span>
            <span>+</span>
            <span>Tomcat</span>
            <span>+</span>
            <span>Memcached</span>
            <span>+</span>
            <span>RabbitMQ</span>
            <span>+</span>
            <span>MySQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
