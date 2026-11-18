import React, { useState } from 'react';
import './Contact.css';

const INITIAL_FORM = {
  senderName:  '',
  senderEmail: '',
  subject:     '',
  message:     '',
};

const INITIAL_ERRORS = {
  senderName:  '',
  senderEmail: '',
  subject:     '',
  message:     '',
};

export default function Contact() {
  const [form,        setForm]        = useState(INITIAL_FORM);
  const [errors,      setErrors]      = useState(INITIAL_ERRORS);
  const [submitting,  setSubmitting]  = useState(false);
  const [result,      setResult]      = useState(null); // { type: 'success'|'error', message }

  const validate = () => {
    const e = { ...INITIAL_ERRORS };
    if (!form.senderName.trim())  e.senderName  = 'Name is required.';
    if (!form.senderEmail.trim()) e.senderEmail = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail))
      e.senderEmail = 'Enter a valid email address.';
    if (!form.subject.trim())     e.subject     = 'Subject is required.';
    if (!form.message.trim())     e.message     = 'Message is required.';
    else if (form.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters.';
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setResult(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: 'success', message: data.message || 'Message sent successfully!' });
        setForm(INITIAL_FORM);
      } else {
        setResult({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-heading">
          <h2 className="gradient-text">Contact Me</h2>
          <div className="heading-line" />
          <p>Have an opportunity or just want to say hello? Send me a message.</p>
        </div>

        <div className="contact__grid">
          {/* Info panel */}
          <div className="contact__info">
            <h3 className="contact__info-heading">Let's Connect</h3>
            <p className="contact__info-text">
              I'm actively looking for Junior DevOps Engineer opportunities.
              Whether it's a full-time role, freelance project, or just a
              conversation about cloud and DevOps, I'd love to hear from you.
            </p>

            <div className="contact__info-items">
              <div className="contact__info-item">
                <span className="contact__info-icon">📍</span>
                <div>
                  <span className="contact__info-label">Location</span>
                  <span className="contact__info-val">Pudukkottai, Tamil Nadu, India</span>
                </div>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-icon">💼</span>
                <div>
                  <span className="contact__info-label">Status</span>
                  <span className="contact__info-val contact__info-val--green">
                    Open to opportunities
                  </span>
                </div>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-icon">🎓</span>
                <div>
                  <span className="contact__info-label">Education</span>
                  <span className="contact__info-val">B.Sc CS · CGPA 8.3</span>
                </div>
              </div>
            </div>

            {/* Architecture note */}
            <div className="contact__arch-note">
              <p className="contact__arch-title">⚡ Message flow</p>
              <p className="contact__arch-desc">
                Your message is validated by Java Servlet → published to
                RabbitMQ → consumed by a Java worker → saved in MySQL.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="contact__form-wrap glass-card">
            {result && (
              <div className={`contact__result contact__result--${result.type}`}>
                <span>{result.type === 'success' ? '✅' : '❌'}</span>
                {result.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact__form" noValidate>
              <div className="contact__row">
                <div className="contact__field">
                  <label htmlFor="senderName">Full Name *</label>
                  <input
                    id="senderName"
                    name="senderName"
                    type="text"
                    placeholder="Your full name"
                    value={form.senderName}
                    onChange={handleChange}
                    className={errors.senderName ? 'contact__input--error' : ''}
                  />
                  {errors.senderName && <span className="contact__error">{errors.senderName}</span>}
                </div>

                <div className="contact__field">
                  <label htmlFor="senderEmail">Email Address *</label>
                  <input
                    id="senderEmail"
                    name="senderEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={form.senderEmail}
                    onChange={handleChange}
                    className={errors.senderEmail ? 'contact__input--error' : ''}
                  />
                  {errors.senderEmail && <span className="contact__error">{errors.senderEmail}</span>}
                </div>
              </div>

              <div className="contact__field">
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Job opportunity / Collaboration / Just saying hi"
                  value={form.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'contact__input--error' : ''}
                />
                {errors.subject && <span className="contact__error">{errors.subject}</span>}
              </div>

              <div className="contact__field">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  className={errors.message ? 'contact__input--error' : ''}
                />
                {errors.message && <span className="contact__error">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="btn-primary contact__submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="contact__submit-spinner" />
                    Sending...
                  </>
                ) : (
                  <><span>✉️</span> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
