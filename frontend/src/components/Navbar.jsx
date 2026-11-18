import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#home',       label: 'Home' },
  { href: '#about',      label: 'About' },
  { href: '#skills',     label: 'Skills' },
  { href: '#projects',   label: 'Projects' },
  { href: '#education',  label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact',    label: 'Contact' },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  /* Scroll: add shadow + track active section */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map(l => l.href.replace('#', ''));
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <a href="#home" className="navbar__logo" onClick={e => handleNavClick(e, '#home')}>
          <span className="navbar__logo-bracket">{'<'}</span>
          <span className="navbar__logo-name">ArunVineeth</span>
          <span className="navbar__logo-bracket">{'/>'}</span>
        </a>

        {/* Desktop links */}
        <ul className="navbar__links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`navbar__link ${activeSection === href.replace('#', '') ? 'navbar__link--active' : ''}`}
                onClick={e => handleNavClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={`navbar__mobile-link ${activeSection === href.replace('#', '') ? 'navbar__mobile-link--active' : ''}`}
            onClick={e => handleNavClick(e, href)}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
