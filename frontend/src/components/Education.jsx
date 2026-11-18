import React, { useState, useEffect } from 'react';
import './Education.css';

export default function Education() {
  const [education, setEducation] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    fetch('/api/education')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setEducation(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <section id="education" className="section education">
      <div className="container">
        <div className="section-heading">
          <h2 className="gradient-text">Education</h2>
          <div className="heading-line" />
          <p>Academic background and qualifications</p>
        </div>

        {loading && <div className="edu__loading"><div className="spinner" /></div>}
        {error   && <p className="edu__error">Could not load education: {error}</p>}

        {!loading && !error && (
          <div className="edu__timeline">
            {education.map((edu, i) => (
              <EduCard key={edu.id} edu={edu} index={i} total={education.length} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EduCard({ edu, index, total }) {
  return (
    <div className="edu__item" style={{ animationDelay: `${index * 0.12}s` }}>
      {/* Timeline spine */}
      <div className="edu__spine">
        <div className="edu__dot" />
        {index < total - 1 && <div className="edu__line" />}
      </div>

      {/* Card */}
      <div className="edu__card glass-card">
        <div className="edu__card-header">
          <span className="edu__icon">🎓</span>
          <div>
            <h3 className="edu__degree">{edu.degree}</h3>
            <span className="edu__year">{edu.yearRange}</span>
          </div>
        </div>
        <div className="edu__card-body">
          <p className="edu__institution">
            <span className="edu__institution-icon">🏛️</span>
            {edu.institution}
          </p>
          <p className="edu__university">
            <span className="edu__university-icon">📚</span>
            {edu.university}
          </p>
          <div className="edu__grade-badge">{edu.cgpaGrade}</div>
        </div>
      </div>
    </div>
  );
}
