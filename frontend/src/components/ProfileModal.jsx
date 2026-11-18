import React, { useState, useEffect, useCallback } from 'react';
import './ProfileModal.css';

/**
 * ProfileModal
 *
 * Fetches profile data from /api/profile on mount.
 * Displays a "source badge" that shows whether the data came from
 * MySQL (blue) or Memcached (purple) – set by the Java backend, not here.
 *
 * Clearing the cache calls DELETE /api/profile/cache so the next
 * open will show SOURCE: MySQL again.
 */
export default function ProfileModal({ onClose }) {
  const [profile,       setProfile]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [cacheClearing, setCacheClearing] = useState(false);
  const [cacheMsg,      setCacheMsg]      = useState(null);

  /* Fetch profile data */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server returned HTTP ${res.status}`);
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Prevent body scroll while open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Clear cache */
  const clearCache = async () => {
    setCacheClearing(true);
    setCacheMsg(null);
    try {
      const res = await fetch('/api/profile/cache', { method: 'DELETE' });
      const data = await res.json();
      setCacheMsg({ type: 'success', text: data.message || 'Cache cleared.' });
    } catch {
      setCacheMsg({ type: 'error', text: 'Failed to clear cache.' });
    } finally {
      setCacheClearing(false);
    }
  };

  /* Source indicator */
  const isMemcached = profile?.source === 'MEMCACHED';

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-box">
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">PERSONAL INFORMATION</h2>
          <div className="modal-title-line" />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="modal-loading">
            <div className="modal-spinner" />
            <p>Fetching profile from backend…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="modal-error">
            <span className="modal-error-icon">⚠️</span>
            <p>{error}</p>
            <p className="modal-error-hint">
              Make sure MySQL and Memcached are running and Tomcat is healthy.
            </p>
            <button className="btn-outline modal-retry" onClick={fetchProfile}>
              Retry
            </button>
          </div>
        )}

        {/* Profile data */}
        {!loading && !error && profile && (
          <>
            {/* Source badge – truth comes from backend */}
            <div className={`modal-source-badge modal-source-badge--${isMemcached ? 'memcached' : 'mysql'}`}>
              <span className="modal-source-dot" />
              <span className="modal-source-label">SOURCE:</span>
              <span className="modal-source-value">
                {isMemcached ? 'MEMCACHED CACHE' : 'MYSQL DATABASE'}
              </span>
            </div>

            {/* Profile fields grid */}
            <div className="modal-fields">
              <ProfileField label="Full Name"   value={profile.name} />
              <ProfileField label="Designation" value={profile.designation} />
              <ProfileField label="Degree"      value={profile.degree} />
              <ProfileField label="College"     value={profile.college} />
              <ProfileField label="University"  value={profile.university} />
              <ProfileField label="CGPA"        value={profile.cgpa} />
              <ProfileField label="School"      value={profile.school} />
              <ProfileField label="Location"    value={profile.location} />
            </div>

            {/* Cache control */}
            <div className="modal-cache-section">
              <div className="modal-cache-info">
                <span className="modal-cache-ttl-label">Cache TTL: 300 seconds</span>
                <span className="modal-cache-hint">
                  {isMemcached
                    ? 'Data served from Memcached cache (fast 🚀)'
                    : 'Data fetched from MySQL database and stored in Memcached 🗄️'}
                </span>
              </div>

              <button
                className="btn-outline modal-cache-btn"
                onClick={clearCache}
                disabled={cacheClearing}
              >
                {cacheClearing
                  ? <><span className="modal-spinner-sm" /> Clearing…</>
                  : '🗑️ CLEAR PROFILE CACHE'}
              </button>

              {cacheMsg && (
                <div className={`modal-cache-msg modal-cache-msg--${cacheMsg.type}`}>
                  {cacheMsg.type === 'success' ? '✅' : '❌'} {cacheMsg.text}
                </div>
              )}
            </div>

            {/* Refresh button */}
            <div className="modal-actions">
              <button className="btn-primary" onClick={fetchProfile}>
                🔄 Fetch Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="modal-field">
      <span className="modal-field-label">{label}</span>
      <span className="modal-field-value">{value || '—'}</span>
    </div>
  );
}
