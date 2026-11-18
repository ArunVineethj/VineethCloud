import React, { useState, useEffect } from 'react';
import './Experience.css';

const EXP_TYPE_LABELS = {
  non_voice_process: 'Non-Voice Process',
  professional:      'Professional',
  internship:        'Internship',
};

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    fetch('/api/experience')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setExperience(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-heading">
          <h2 className="gradient-text">Experience</h2>
          <div className="heading-line" />
          <p>Professional background and work history</p>
        </div>

        {loading && <div className="exp__loading"><div className="spinner" /></div>}
        {error   && <p className="exp__error">Could not load experience: {error}</p>}

        {!loading && !error && (
          <div className="exp__list">
            {experience.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ExperienceCard({ exp, index }) {
  const typeLabel = EXP_TYPE_LABELS[exp.expType] || exp.expType;

  return (
    <article
      className="exp__card glass-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Left accent bar */}
      <div className="exp__accent-bar" />

      <div className="exp__content">
        {/* Header */}
        <div className="exp__header">
          <div className="exp__header-left">
            <div className="exp__company-logo">
              {exp.company.charAt(0)}
            </div>
            <div>
              <h3 className="exp__position">{exp.position}</h3>
              <span className="exp__company">{exp.company}</span>
            </div>
          </div>
          <div className="exp__header-right">
            <span className="exp__duration">
              <span>🕐</span> {exp.duration}
            </span>
            <span className="exp__type-badge">{typeLabel}</span>
          </div>
        </div>

        {/* Description */}
        <p className="exp__description">{exp.description}</p>

        {/* Non-voice note */}
        {exp.expType === 'non_voice_process' && (
          <div className="exp__note">
            <span>ℹ️</span>
            This is prior work experience in a non-voice back-office process, not DevOps professional experience.
            It provided valuable corporate discipline and professional skills before the transition to a DevOps career.
          </div>
        )}
      </div>
    </article>
  );
}
