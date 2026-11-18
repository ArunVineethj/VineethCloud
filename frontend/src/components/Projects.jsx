import React, { useState, useEffect } from 'react';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setProjects(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-heading">
          <h2 className="gradient-text">Projects</h2>
          <div className="heading-line" />
          <p>Hands-on DevOps and cloud infrastructure projects</p>
        </div>

        {loading && <div className="projects__loading"><div className="spinner" /></div>}
        {error   && <p className="projects__error">Could not load projects: {error}</p>}

        {!loading && !error && (
          <div className="projects__grid">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const techs = project.techStack
    ? project.techStack.split(',').map(t => t.trim())
    : [];

  return (
    <article
      className="projects__card glass-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Top accent bar */}
      <div className="projects__card-accent" />

      <div className="projects__card-body">
        {/* Number badge */}
        <span className="projects__number">
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3 className="projects__title">{project.title}</h3>
        <p className="projects__description">{project.description}</p>

        {/* Tech stack tags */}
        <div className="projects__techs">
          {techs.map(t => (
            <span key={t} className="projects__tech-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="projects__card-footer">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="projects__link"
          >
            <span>⌥</span> GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="projects__link projects__link--demo"
          >
            <span>↗</span> Live Demo
          </a>
        )}
      </div>
    </article>
  );
}
