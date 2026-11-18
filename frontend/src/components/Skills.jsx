import React, { useState, useEffect } from 'react';
import './Skills.css';

/* Icons as inline SVG paths — avoids external dependencies */
const SKILL_META = {
  aws:        { color: '#FF9900', label: 'AWS',        icon: '☁️' },
  linux:      { color: '#FCC624', label: 'Linux',      icon: '🐧' },
  docker:     { color: '#2496ED', label: 'Docker',     icon: '🐳' },
  kubernetes: { color: '#326CE5', label: 'Kubernetes', icon: '⚙️' },
  jenkins:    { color: '#D33833', label: 'Jenkins',    icon: '🔧' },
  git:        { color: '#F05032', label: 'Git',        icon: '📦' },
  terraform:  { color: '#7B42BC', label: 'Terraform',  icon: '🏗️' },
  ansible:    { color: '#EE0000', label: 'Ansible',    icon: '🤖' },
  cicd:       { color: '#06B6D4', label: 'CI/CD',      icon: '🔄' },
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch('/api/skills')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setSkills(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  /* Group skills by category */
  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-heading">
          <h2 className="gradient-text">Technical Skills</h2>
          <div className="heading-line" />
          <p>Technologies and tools I work with</p>
        </div>

        {loading && <div className="skills__loading"><div className="spinner" /></div>}
        {error   && <p className="skills__error">Could not load skills: {error}</p>}

        {!loading && !error && (
          <>
            {/* Skills grid */}
            <div className="skills__grid">
              {skills.map((skill, i) => {
                const meta = SKILL_META[skill.iconKey] || { color: '#7c3aed', icon: '🔹' };
                return (
                  <div
                    key={skill.id}
                    className="skills__card glass-card"
                    style={{ '--skill-color': meta.color, animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="skills__card-icon">{meta.icon}</div>
                    <div className="skills__card-name">{skill.name}</div>
                    <div className="skills__card-category">{skill.category}</div>
                    <div
                      className="skills__card-bar"
                      style={{ '--bar-color': meta.color }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Category breakdown */}
            <div className="skills__categories">
              {Object.entries(categories).map(([cat, items]) => (
                <div key={cat} className="skills__cat-pill">
                  <span className="skills__cat-label">{cat}</span>
                  <span className="skills__cat-items">{items.map(s => s.name).join(', ')}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
