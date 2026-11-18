import React, { useState, useEffect } from 'react';
import './Hero.css';

const TYPED_STRINGS = [
  'Junior DevOps Engineer',
  'AWS Cloud Enthusiast',
  'Docker & Kubernetes Fan',
  'CI/CD Pipeline Builder',
  'Infrastructure Automator',
];

export default function Hero({ onViewDetails }) {
  const [displayText, setDisplayText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex,   setCharIndex]   = useState(0);
  const [deleting,    setDeleting]    = useState(false);

  /* Typing animation */
  useEffect(() => {
    const current = TYPED_STRINGS[stringIndex];
    let timeout;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(i => i + 1), 80);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(i => i - 1), 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setStringIndex(i => (i + 1) % TYPED_STRINGS.length);
    }

    setDisplayText(current.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, stringIndex]);

  const scrollToContact = e => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAbout = e => {
    e.preventDefault();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      {/* Animated background */}
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
      </div>

      <div className="hero__content">
        {/* Badge */}
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Available for opportunities
        </div>

        {/* Greeting */}
        <p className="hero__greeting">Hello, I'm</p>

        {/* Name */}
        <h1 className="hero__name">
          <span className="gradient-text">ARUN VINEETH J</span>
        </h1>

        {/* Typed role */}
        <div className="hero__role">
          <span className="hero__role-text">{displayText}</span>
          <span className="hero__cursor" aria-hidden="true">|</span>
        </div>

        {/* Short bio */}
        <p className="hero__bio">
          A passionate Computer Science graduate from Tiruchirappalli, Tamil Nadu,
          with hands-on expertise in AWS, Docker, Kubernetes, Jenkins, Terraform and Ansible.
          Building modern DevOps pipelines and cloud infrastructure.
        </p>

        {/* CTA buttons */}
        <div className="hero__actions">
          <button className="btn-primary hero__btn-view" onClick={onViewDetails}>
            <span>👤</span> VIEW MY DETAILS
          </button>
          <button className="btn-outline" onClick={scrollToContact}>
            Get in Touch
          </button>
        </div>

        {/* Tech badges */}
        <div className="hero__tech-badges">
          {['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible'].map(t => (
            <span key={t} className="hero__tech-badge">{t}</span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button className="hero__scroll-hint" onClick={scrollToAbout} aria-label="Scroll to About section">
        <span className="hero__scroll-arrow" />
      </button>
    </section>
  );
}
