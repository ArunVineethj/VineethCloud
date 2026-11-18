import React from 'react';
import './About.css';

const HIGHLIGHTS = [
  { icon: '🎓', label: 'Education',    value: 'B.Sc Computer Science, CGPA 8.3' },
  { icon: '📍', label: 'Location',     value: 'Pudukkottai, Tamil Nadu, India' },
  { icon: '💼', label: 'Experience',   value: 'Process Associate, Capgemini' },
  { icon: '🎯', label: 'Goal',         value: 'DevOps & Cloud Engineering' },
];

export default function About({ onViewDetails }) {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-heading">
          <h2 className="gradient-text">About Me</h2>
          <div className="heading-line" />
          <p>Get to know the person behind the code</p>
        </div>

        <div className="about__grid">
          {/* Left: avatar + highlights */}
          <div className="about__left">
            <div className="about__avatar-wrap">
              <div className="about__avatar">
                <span className="about__avatar-initials">AV</span>
                <div className="about__avatar-ring about__avatar-ring--1" />
                <div className="about__avatar-ring about__avatar-ring--2" />
              </div>
            </div>

            <div className="about__highlights">
              {HIGHLIGHTS.map(({ icon, label, value }) => (
                <div key={label} className="about__highlight glass-card">
                  <span className="about__highlight-icon">{icon}</span>
                  <div>
                    <span className="about__highlight-label">{label}</span>
                    <span className="about__highlight-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: text */}
          <div className="about__right">
            <h3 className="about__subtitle">
              Junior DevOps Engineer &amp; Cloud Enthusiast
            </h3>
            <p className="about__text">
              I'm a fresh Computer Science graduate from St. Joseph's College, Tiruchirappalli,
              under Bharathidasan University, with a strong CGPA of 8.3. My passion lies in
              building reliable, automated, and scalable infrastructure.
            </p>
            <p className="about__text">
              Before transitioning to a DevOps career, I gained professional work experience as
              a <strong>Process Associate (Non-Voice)</strong> at Capgemini for 8 months.
              That role sharpened my attention to detail, documentation skills, and professional
              discipline — qualities that directly translate to writing clean Infrastructure as Code
              and maintaining production systems.
            </p>
            <p className="about__text">
              I am actively building my DevOps skill set through hands-on projects covering
              AWS cloud provisioning, containerisation with Docker and Kubernetes, CI/CD
              automation with Jenkins, infrastructure management with Terraform, and server
              configuration with Ansible. I am eager to contribute to real-world DevOps teams
              and grow into a mid-level Cloud/DevOps Engineer.
            </p>

            <div className="about__actions">
              <button className="btn-primary about__view-btn" onClick={onViewDetails}>
                <span>👤</span> VIEW MY DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
