import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Education from './components/Education.jsx';
import Experience from './components/Experience.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import BackToTop from './components/BackToTop.jsx';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main>
        <Hero onViewDetails={() => setModalOpen(true)} />
        <About onViewDetails={() => setModalOpen(true)} />
        <Skills />
        <Projects />
        <Education />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      {modalOpen && <ProfileModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
