/**
 * VineethCloud Portfolio – script.js
 * -----------------------------------
 * Particles · Navbar · Typing · Skill bars · Projects
 * VIEW DETAILS modal  →  calls real Flask API
 * Contact form
 */
'use strict';

/* ─────────────────────────────────────────────────────────────
   CONFIG  –  change this to point at your Flask backend
───────────────────────────────────────────────────────────── */
const API_BASE = 'http://localhost:5000';   // update when deployed

/* ─────────────────────────────────────────────────────────────
   PARTICLES
───────────────────────────────────────────────────────────── */
(function () {
  const cv  = document.getElementById('canvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, pts = [], mx = null, my = null;
  const N = 65, CONN = 125, MOUSE = 140;
  const COLS = ['#3b82f6', '#6366f1', '#a855f7', '#22d3ee'];

  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  const mkPt   = () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
    r: Math.random() * 2 + 1,
    c: COLS[Math.floor(Math.random() * COLS.length)],
    a: Math.random() * .45 + .2,
  });

  const frame = () => {
    ctx.clearRect(0, 0, W, H);
    // connections between nearby particles
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < CONN) {
          ctx.save();
          ctx.globalAlpha = (1 - d / CONN) * .28;
          ctx.strokeStyle = pts[i].c; ctx.lineWidth = .75;
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          ctx.restore();
        }
      }
    }
    pts.forEach(p => {
      // mouse trails
      if (mx !== null) {
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
        if (d < MOUSE) {
          ctx.save(); ctx.globalAlpha = (1 - d / MOUSE) * .3;
          ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = .9;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
          ctx.stroke(); ctx.restore();
        }
      }
      ctx.save(); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(frame);
  };

  resize();
  pts = Array.from({ length: N }, mkPt);
  frame();
  addEventListener('resize',    () => { resize(); pts = Array.from({ length: N }, mkPt); });
  addEventListener('mousemove', e  => { mx = e.clientX; my = e.clientY; });
  addEventListener('mouseleave',()  => { mx = null; my = null; });
})();

/* ─────────────────────────────────────────────────────────────
   NAVBAR  –  sticky on scroll + active-link highlighting
───────────────────────────────────────────────────────────── */
const nav = document.getElementById('mainNav');
addEventListener('scroll', () => {
  nav.classList.toggle('sticky', scrollY > 55);
  document.querySelectorAll('section[id]').forEach(s => {
    const a = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (a) a.classList.toggle('active', scrollY >= s.offsetTop - 150);
  });
});
const hbg    = document.getElementById('hbg');
const nlinks = document.getElementById('navLinks');
hbg && hbg.addEventListener('click', () => nlinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(a =>
  a.addEventListener('click', () => nlinks.classList.remove('open')));

/* ─────────────────────────────────────────────────────────────
   TYPING ANIMATION
───────────────────────────────────────────────────────────── */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;
  const words = ['DevOps Engineer', 'Cloud Enthusiast', 'AWS Explorer',
                 'CI/CD Practitioner', 'Linux Administrator', 'Container Enthusiast'];
  let wi = 0, ci = 0, del = false;
  const step = () => {
    el.textContent = del ? words[wi].slice(0, ci--) : words[wi].slice(0, ci++);
    if (!del && ci === words[wi].length + 1) { del = true; return setTimeout(step, 1800); }
    if (del && ci === 0)                      { del = false; wi = (wi + 1) % words.length; }
    setTimeout(step, del ? 60 : 90);
  };
  step();
})();

/* ─────────────────────────────────────────────────────────────
   SKILL BARS  –  animate when section scrolls into view
───────────────────────────────────────────────────────────── */
const skillData = [
  { cat: 'Cloud',          icon: 'fas fa-cloud',         items: [{ n: 'AWS', p: 65 }] },
  { cat: 'OS & VCS',       icon: 'fab fa-linux',         items: [{ n: 'Linux', p: 70 }, { n: 'Git', p: 75 }, { n: 'GitHub', p: 75 }] },
  { cat: 'DevOps Tools',   icon: 'fas fa-cogs',          items: [{ n: 'Docker', p: 70 }, { n: 'Kubernetes', p: 65 }, { n: 'Jenkins', p: 65 }, { n: 'Maven', p: 70 }, { n: 'Helm', p: 60 }] },
  { cat: 'Development',    icon: 'fas fa-code',          items: [{ n: 'Java', p: 60 }, { n: 'Apache Tomcat', p: 65 }] },
  { cat: 'Data / Messaging', icon: 'fas fa-database',    items: [{ n: 'MySQL', p: 65 }, { n: 'Memcached', p: 55 }, { n: 'RabbitMQ', p: 55 }] },
];

function buildSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = skillData.map(c => `
    <div class="skill-cat glass">
      <div class="scat-head">
        <div class="scat-icon"><i class="${c.icon}"></i></div>
        <span class="scat-name">${c.cat}</span>
      </div>
      <div class="skill-rows">
        ${c.items.map(s => `
          <div>
            <div class="skill-row-top">
              <span class="skill-name">${s.n}</span>
              <span class="skill-pct">${s.p}%</span>
            </div>
            <div class="skill-track">
              <div class="skill-bar" data-pct="${s.p}"></div>
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  // Animate bars when section enters viewport
  const section = document.getElementById('skills');
  let animated  = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !animated) {
      animated = true;
      setTimeout(() => document.querySelectorAll('.skill-bar[data-pct]').forEach(b => {
        b.style.width = b.dataset.pct + '%';
      }), 200);
    }
  }, { threshold: .2 }).observe(section);
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS  –  static data (displayed even without backend)
───────────────────────────────────────────────────────────── */
const projectData = [
  { icon: 'fab fa-aws',           cat: 'Cloud',         title: 'AWS Infrastructure Setup',
    desc: 'EC2 provisioning, VPC, subnets, security groups, IAM roles – hands-on cloud practice.',
    tags: ['AWS', 'EC2', 'VPC', 'IAM', 'Security Groups'] },
  { icon: 'fab fa-docker',        cat: 'Containers',    title: 'Docker Application Deployment',
    desc: 'Dockerfile authoring, image build, container lifecycle and Docker Hub push.',
    tags: ['Docker', 'Dockerfile', 'Docker Hub'] },
  { icon: 'fas fa-dharmachakra',  cat: 'Orchestration', title: 'Kubernetes Orchestration',
    desc: 'Pods, Deployments, Services, Ingress, ConfigMaps and Helm chart deployments on a local cluster.',
    tags: ['Kubernetes', 'kubectl', 'Helm', 'minikube'] },
  { icon: 'fab fa-jenkins',       cat: 'CI/CD',         title: 'Jenkins CI/CD Pipeline',
    desc: 'GitHub webhook → Maven build → automated deployment stages configured with Jenkins.',
    tags: ['Jenkins', 'GitHub', 'Maven', 'Pipeline DSL'] },
  { icon: 'fas fa-coffee',        cat: 'Development',   title: 'Java Web App Deployment',
    desc: 'WAR deployment on Apache Tomcat, NGINX reverse proxy, MySQL JDBC integration.',
    tags: ['Java', 'Tomcat', 'NGINX', 'MySQL'] },
];

function buildProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = projectData.map(p => `
    <div class="pcard">
      <div class="pcard-top">
        <div class="pcard-icon"><i class="${p.icon}"></i></div>
        <span class="pcard-cat">${p.cat}</span>
      </div>
      <div class="pcard-body">
        <h3 class="pcard-title">${p.title}</h3>
        <p class="pcard-desc">${p.desc}</p>
        <div class="pcard-tags">${p.tags.map(t => `<span class="ptag">${t}</span>`).join('')}</div>
      </div>
    </div>`).join('');
}

/* ─────────────────────────────────────────────────────────────
   VIEW DETAILS MODAL
   ─────────────────────────────────────────────────────────
   FLOW:
     1. openModal()  → fire POST /api/view-event (async, ignore result)
     2.              → show overlay + loading spinner
     3.              → GET /api/profile
     4. Response     → render source banner from res.source field
                       ("memcached" → green, "mysql" → blue, "unavailable" → red)
     5. Close on X button, Esc key, or outside click
───────────────────────────────────────────────────────────── */
const overlay = document.getElementById('profileOverlay');
const modal   = document.getElementById('profileModal');

/** Called by the VIEW DETAILS button */
window.openModal = function () {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Fire-and-forget: notify backend that "view details" was clicked
  fetch(`${API_BASE}/api/view-event`, { method: 'POST' }).catch(() => {});

  fetchProfile();
};

window.closeModal = function () {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

// Close on outside click
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

// Close on Esc
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/** Fetch profile from backend and render into modal */
function fetchProfile() {
  const bannerEl = document.getElementById('srcBanner');
  const bodyEl   = document.getElementById('modalBody');

  // Show loading spinner
  bannerEl.className = 'src-banner src-blue';
  bannerEl.innerHTML = `
    <div class="src-icon"><i class="fas fa-spinner fa-spin"></i></div>
    <div class="src-info">
      <div class="src-label">Checking Memcached then MySQL…</div>
      <div class="src-msg">Fetching your profile data</div>
    </div>`;
  bodyEl.innerHTML = `
    <div class="modal-spin">
      <div class="spinner"></div>
      <p>Loading profile data…</p>
    </div>`;

  fetch(`${API_BASE}/api/profile`)
    .then(r => r.json())
    .then(res => {
      renderSourceBanner(res, bannerEl);
      if (res.source === 'unavailable' || !res.data || !res.data.full_name) {
        bodyEl.innerHTML = `
          <div style="padding:2rem;text-align:center;color:var(--red)">
            <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:.8rem;display:block"></i>
            <strong>${res.error || 'Backend services are not reachable.'}</strong><br>
            <span style="font-size:.85rem;color:var(--text2);margin-top:.5rem;display:block">
              Start MySQL, Memcached and the Flask backend, then try again.
            </span>
          </div>`;
      } else {
        bodyEl.innerHTML = renderProfileBody(res.data);
      }
    })
    .catch(err => {
      // Backend not running at all
      bannerEl.className = 'src-banner src-red';
      bannerEl.innerHTML = `
        <div class="src-icon"><i class="fas fa-plug"></i></div>
        <div class="src-info">
          <div class="src-label">Data source: UNAVAILABLE</div>
          <div class="src-msg">Flask backend is not reachable. Start the backend first.</div>
        </div>
        <div class="src-badge">OFFLINE</div>`;
      bodyEl.innerHTML = `
        <div style="padding:2rem;text-align:center;color:var(--red)">
          <i class="fas fa-server" style="font-size:2rem;margin-bottom:.8rem;display:block"></i>
          <strong>Cannot connect to backend.</strong><br>
          <span style="font-size:.85rem;color:var(--text2);margin-top:.5rem;display:block">
            Run: <code style="background:rgba(255,255,255,.07);padding:.15rem .5rem;border-radius:4px">python backend/app.py</code>
          </span>
        </div>`;
    });
}

/** Render the green / blue / red source banner from API response */
function renderSourceBanner(res, el) {
  const src = (res.source || '').toLowerCase();
  const ts  = res.retrieved_at ? new Date(res.retrieved_at).toLocaleString() : '';

  if (src === 'memcached') {
    el.className = 'src-banner src-green';
    el.innerHTML = `
      <div class="src-icon"><i class="fas fa-bolt"></i></div>
      <div class="src-info">
        <div class="src-label">Data retrieved from: MEMCACHED (cache hit)</div>
        <div class="src-msg">Profile was already cached – no MySQL query needed.</div>
        ${ts ? `<div class="src-ts">Retrieved at: ${ts}</div>` : ''}
      </div>
      <div class="src-badge">CACHE HIT</div>`;

  } else if (src === 'mysql') {
    el.className = 'src-banner src-blue';
    el.innerHTML = `
      <div class="src-icon"><i class="fas fa-database"></i></div>
      <div class="src-info">
        <div class="src-label">Data retrieved from: MYSQL (cache miss)</div>
        <div class="src-msg">Not in cache – fetched from MySQL and stored in Memcached (TTL 300 s).</div>
        ${ts ? `<div class="src-ts">Retrieved at: ${ts}</div>` : ''}
      </div>
      <div class="src-badge">CACHE MISS</div>`;

  } else {
    el.className = 'src-banner src-red';
    el.innerHTML = `
      <div class="src-icon"><i class="fas fa-exclamation-triangle"></i></div>
      <div class="src-info">
        <div class="src-label">Data source: UNAVAILABLE</div>
        <div class="src-msg">${res.error || 'Backend services not reachable.'}</div>
        ${ts ? `<div class="src-ts">${ts}</div>` : ''}
      </div>
      <div class="src-badge">UNAVAILABLE</div>`;
  }
}

/** Build the profile detail HTML from the API data object */
function renderProfileBody(d) {
  const skills = (d.technical_skills || '').split(',').map(s => s.trim()).filter(Boolean);

  return `
    <div class="mphead">
      <div class="mp-av">AV</div>
      <div>
        <div class="mp-name">${d.full_name || '–'}</div>
        <div class="mp-desi">${d.designation || '–'}</div>
        <div class="mp-loc"><i class="fas fa-map-marker-alt"></i>&nbsp;${d.location || '–'}</div>
      </div>
    </div>

    <div class="msecs">

      <!-- Education -->
      <div>
        <div class="msec-title"><i class="fas fa-graduation-cap"></i> Education</div>
        <div class="mrow">
          <div class="mrow-icon"><i class="fas fa-graduation-cap"></i></div>
          <div>
            <div class="mrow-main">${d.education || '–'}</div>
            <div class="mrow-sub">${d.college || '–'}</div>
            <div class="mrow-sub">${d.university || '–'}</div>
            <div class="mrow-meta">
              <span class="mcgpa"><i class="fas fa-star"></i> CGPA: ${d.cgpa || '–'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Professional Experience -->
      <div>
        <div class="msec-title"><i class="fas fa-briefcase"></i> Professional Experience</div>
        <div class="mrow">
          <div class="mrow-icon"><i class="fas fa-building"></i></div>
          <div>
            <div class="mrow-main">${d.previous_company || '–'}</div>
            <div class="mrow-sub">${d.previous_role || '–'}</div>
            <div class="mrow-meta">
              <span style="font-size:.78rem;color:var(--muted);font-family:'JetBrains Mono',monospace">
                Duration: ${d.experience_duration || '–'}
              </span>
            </div>
          </div>
        </div>
        <p style="font-size:.78rem;color:var(--muted);margin-top:.6rem;padding-left:.2rem">
          ℹ The DevOps projects on this page are personal learning projects, separate from this employment.
        </p>
      </div>

      <!-- Technical Skills -->
      <div>
        <div class="msec-title"><i class="fas fa-tools"></i> Technical Skills</div>
        <div class="mskills">
          ${skills.map(s => `<span class="msk"><i class="fas fa-check-circle"></i>${s}</span>`).join('')}
        </div>
      </div>

    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   CONTACT FORM  –  calls POST /api/contact on the backend
───────────────────────────────────────────────────────────── */
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = document.getElementById('contactBtn');
    const fb   = document.getElementById('contactFb');
    const name    = document.getElementById('cName').value.trim();
    const email   = document.getElementById('cEmail').value.trim();
    const subject = document.getElementById('cSubject').value.trim();
    const message = document.getElementById('cMsg').value.trim();

    btn.disabled  = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    fb.className  = 'cfb';
    fb.textContent = '';

    fetch(`${API_BASE}/api/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, subject, message }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          fb.className  = 'cfb ok';
          fb.textContent = res.message || 'Message sent!';
          form.reset();
          toast('Message sent! 🎉', 'ok');
        } else {
          fb.className  = 'cfb err';
          fb.textContent = res.message || 'Failed. Please try again.';
        }
      })
      .catch(() => {
        fb.className  = 'cfb err';
        fb.textContent = 'Could not reach the backend. Make sure the Flask server is running.';
      })
      .finally(() => {
        btn.disabled  = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      });
  });
}

/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */
function toast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast t-${type} show`;
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSkills();
  buildProjects();
  initContact();
});
