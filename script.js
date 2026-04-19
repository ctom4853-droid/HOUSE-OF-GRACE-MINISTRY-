// ==========================================
// FIREBASE CONFIG
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsJt6pGxS-oivZgeAp5aS4IeiO2upGfXo",
  authDomain: "house-of-grace-d1857.firebaseapp.com",
  projectId: "house-of-grace-d1857",
  storageBucket: "house-of-grace-d1857.firebasestorage.app",
  messagingSenderId: "868565873356",
  appId: "1:868565873356:web:e70b820ba0db84a4778869"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// CLOUDINARY CONFIG
// ==========================================

const CLOUDINARY_CLOUD = 'dyqj5jtsf';
const CLOUDINARY_PRESET = 'ml_default';

// ==========================================
// ADMIN CONFIG
// ==========================================

const ADMIN_PASSWORD = 'houseofgrace1';

// ==========================================
// STATE
// ==========================================

let siteData = {
  logo: null,
  youtubeEmbed: 'https://www.youtube.com/embed/k_fdpUa7-t8?si=rzUbyxaAkjOv4ton',
  programme: null,
  activities: {
    sunday: { title: 'Sunday Service', time: '9:00 AM & 11:00 AM WAT' },
    monday: { title: 'Bible Study', time: 'Monday 5:00 PM WAT' },
    wednesday: { title: 'Counselling Services', time: 'Wednesday 9:00 AM WAT' }
  }
};

let adminVisible = false;
let isLoggedIn = false;
let countdownInterval = null;

// ==========================================
// SECRET KEY COMBO — Shift + W
// ==========================================

document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key === 'W') toggleAdminPanel();
  if (e.key === 'Escape' && adminVisible) hideAdminPanel();
});

function toggleAdminPanel() {
  if (adminVisible) {
    hideAdminPanel();
  } else {
    adminVisible = true;
    showAdminLogin();
  }
}

// ==========================================
// ADMIN LOGIN
// ==========================================

function showAdminLogin() {
  const overlay = document.getElementById('admin-overlay');
  overlay.style.display = 'flex';
  if (!isLoggedIn) {
    document.getElementById('admin-login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
  } else {
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadAdminFields();
  }
  setTimeout(() => document.getElementById('admin-password-input')?.focus(), 100);
}

function hideAdminPanel() {
  document.getElementById('admin-overlay').style.display = 'none';
  adminVisible = false;
}

function checkAdminPassword() {
  const input = document.getElementById('admin-password-input').value;
  if (input === ADMIN_PASSWORD) {
    isLoggedIn = true;
    document.getElementById('admin-login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('admin-error').style.display = 'none';
    loadAdminFields();
  } else {
    document.getElementById('admin-error').style.display = 'block';
    document.getElementById('admin-password-input').value = '';
  }
}

function adminLogout() {
  isLoggedIn = false;
  adminVisible = false;
  document.getElementById('admin-login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('admin-password-input').value = '';
  hideAdminPanel();
}

// ==========================================
// LOAD DATA FROM FIREBASE
// ==========================================

async function loadSiteData() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'main'));
    if (snap.exists()) siteData = { ...siteData, ...snap.data() };
    applySiteData();
  } catch (err) {
    console.error('Error loading site data:', err);
    applySiteData();
  }
}

// ==========================================
// APPLY DATA TO PAGE
// ==========================================

function applySiteData() {
  // Logo
  if (siteData.logo) {
    document.querySelectorAll('.church-logo').forEach(img => { img.src = siteData.logo; });
  }

  // YouTube embed
  if (siteData.youtubeEmbed) {
    const iframe = document.querySelector('.stream-embed iframe');
    if (iframe) iframe.src = siteData.youtubeEmbed;
  }

  // Activities
  const acts = siteData.activities;
  const actEls = document.querySelectorAll('.service-time-item');
  const days = ['sunday', 'monday', 'wednesday'];
  actEls.forEach((el, i) => {
    const day = days[i];
    if (acts[day]) {
      const h3 = el.querySelector('h3');
      const p = el.querySelector('p');
      if (h3) h3.textContent = acts[day].title;
      if (p) p.textContent = acts[day].time;
    }
  });

  // Programme
  renderProgramme();
}

// ==========================================
// PROGRAMME SECTION
// ==========================================

function renderProgramme() {
  let section = document.getElementById('programme-section');

  if (!siteData.programme || !siteData.programme.title) {
    if (section) section.style.display = 'none';
    return;
  }

  const prog = siteData.programme;

  if (!section) {
    section = document.createElement('section');
    section.id = 'programme-section';
    section.className = 'py-24 bg-slate-900 text-white relative overflow-hidden';
    const hero = document.getElementById('home');
    if (hero && hero.nextSibling) {
      hero.parentNode.insertBefore(section, hero.nextSibling);
    } else {
      document.body.appendChild(section);
    }
  }

  section.style.display = 'block';
  const targetDate = new Date(prog.date).getTime();
  const isPast = targetDate < Date.now();

  section.innerHTML = `
    <div class="absolute inset-0 opacity-20" style="background:linear-gradient(135deg,#d4af37 0%,#1e3a5f 100%);"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-4">
        <span class="text-yellow-400 font-semibold tracking-wider uppercase text-sm">Upcoming Programme</span>
        <h2 style="font-family:'Cormorant Garamond',serif;" class="text-4xl md:text-5xl font-bold mt-2 mb-2">${prog.title}</h2>
        ${prog.description ? `<p class="text-gray-300 max-w-2xl mx-auto mt-3">${prog.description}</p>` : ''}
      </div>
      <div class="flex flex-col lg:flex-row items-center justify-center gap-12 mt-10">
        ${prog.image ? `<div class="w-full max-w-sm"><img src="${prog.image}" alt="${prog.title}" class="rounded-2xl shadow-2xl w-full object-cover border-4 border-yellow-400/30" style="max-height:350px;"></div>` : ''}
        <div class="text-center">
          <p class="text-gray-300 mb-6 text-lg">${isPast ? 'This programme has taken place' : 'Starts on ' + new Date(prog.date).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
          ${!isPast ? `
          <div class="flex justify-center gap-6" id="countdown-timer">
            <div class="text-center"><div class="text-5xl font-bold text-yellow-400" id="cd-days">00</div><div class="text-gray-400 text-sm mt-1 uppercase tracking-wider">Days</div></div>
            <div class="text-5xl font-bold text-white self-start mt-1">:</div>
            <div class="text-center"><div class="text-5xl font-bold text-yellow-400" id="cd-hours">00</div><div class="text-gray-400 text-sm mt-1 uppercase tracking-wider">Hours</div></div>
            <div class="text-5xl font-bold text-white self-start mt-1">:</div>
            <div class="text-center"><div class="text-5xl font-bold text-yellow-400" id="cd-mins">00</div><div class="text-gray-400 text-sm mt-1 uppercase tracking-wider">Mins</div></div>
            <div class="text-5xl font-bold text-white self-start mt-1">:</div>
            <div class="text-center"><div class="text-5xl font-bold text-yellow-400" id="cd-secs">00</div><div class="text-gray-400 text-sm mt-1 uppercase tracking-wider">Secs</div></div>
          </div>` : ''}
        </div>
      </div>
    </div>`;

  if (!isPast) startCountdown(targetDate);
}

function startCountdown(targetDate) {
  if (countdownInterval) clearInterval(countdownInterval);
  function update() {
    const diff = targetDate - Date.now();
    if (diff <= 0) { clearInterval(countdownInterval); renderProgramme(); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2,'0'); };
    set('cd-days', d); set('cd-hours', h); set('cd-mins', m); set('cd-secs', s);
  }
  update();
  countdownInterval = setInterval(update, 1000);
}

// ==========================================
// LOAD ADMIN FIELDS
// ==========================================

function loadAdminFields() {
  document.getElementById('admin-youtube').value = siteData.youtubeEmbed || '';
  document.getElementById('admin-sunday-title').value = siteData.activities.sunday.title;
  document.getElementById('admin-sunday-time').value = siteData.activities.sunday.time;
  document.getElementById('admin-monday-title').value = siteData.activities.monday.title;
  document.getElementById('admin-monday-time').value = siteData.activities.monday.time;
  document.getElementById('admin-wednesday-title').value = siteData.activities.wednesday.title;
  document.getElementById('admin-wednesday-time').value = siteData.activities.wednesday.time;
  if (siteData.programme) {
    document.getElementById('admin-prog-title').value = siteData.programme.title || '';
    document.getElementById('admin-prog-date').value = siteData.programme.date || '';
    document.getElementById('admin-prog-desc').value = siteData.programme.description || '';
    if (siteData.programme.image) {
      const prev = document.getElementById('admin-prog-preview');
      prev.src = siteData.programme.image;
      prev.style.display = 'block';
    }
  }
}

// ==========================================
// SAVE FUNCTIONS
// ==========================================

async function saveLogo() {
  const input = document.getElementById('admin-logo-file');
  if (!input.files || !input.files[0]) { showAdminToast('Please select an image first', 'error'); return; }
  const btn = document.getElementById('save-logo-btn');
  btn.textContent = '⏳ Uploading...'; btn.disabled = true;
  try {
    siteData.logo = await uploadToCloudinary(input.files[0]);
    await saveToFirebase();
    applySiteData();
    showAdminToast('✓ Logo updated!');
  } catch (err) {
    showAdminToast('❌ Failed to upload logo', 'error');
  } finally {
    btn.textContent = 'Save Logo'; btn.disabled = false;
  }
}

async function saveYoutube() {
  let val = document.getElementById('admin-youtube').value.trim();
  if (!val) { showAdminToast('Please enter a YouTube link', 'error'); return; }
  if (val.includes('watch?v=')) val = 'https://www.youtube.com/embed/' + val.split('v=')[1].split('&')[0];
  else if (val.includes('youtu.be/')) val = 'https://www.youtube.com/embed/' + val.split('youtu.be/')[1].split('?')[0];
  siteData.youtubeEmbed = val;
  await saveToFirebase();
  applySiteData();
  showAdminToast('✓ Video updated!');
}

async function saveActivities() {
  siteData.activities = {
    sunday: { title: document.getElementById('admin-sunday-title').value, time: document.getElementById('admin-sunday-time').value },
    monday: { title: document.getElementById('admin-monday-title').value, time: document.getElementById('admin-monday-time').value },
    wednesday: { title: document.getElementById('admin-wednesday-title').value, time: document.getElementById('admin-wednesday-time').value }
  };
  await saveToFirebase();
  applySiteData();
  showAdminToast('✓ Activities updated!');
}

async function saveProgramme() {
  const title = document.getElementById('admin-prog-title').value.trim();
  const date = document.getElementById('admin-prog-date').value;
  const desc = document.getElementById('admin-prog-desc').value.trim();
  const imageInput = document.getElementById('admin-prog-image');
  if (!title || !date) { showAdminToast('Title and date are required', 'error'); return; }
  const btn = document.getElementById('save-prog-btn');
  btn.textContent = '⏳ Saving...'; btn.disabled = true;
  try {
    let imageUrl = siteData.programme?.image || null;
    if (imageInput.files && imageInput.files[0]) {
      btn.textContent = '⏳ Uploading image...';
      imageUrl = await uploadToCloudinary(imageInput.files[0]);
    }
    siteData.programme = { title, date, description: desc, image: imageUrl };
    await saveToFirebase();
    applySiteData();
    showAdminToast('✓ Programme saved!');
  } catch (err) {
    showAdminToast('❌ Failed to save programme', 'error');
  } finally {
    btn.textContent = 'Save Programme'; btn.disabled = false;
  }
}

async function clearProgramme() {
  if (!confirm('Remove the programme? It will be hidden from the site.')) return;
  siteData.programme = null;
  await saveToFirebase();
  applySiteData();
  showAdminToast('✓ Programme removed');
  ['admin-prog-title','admin-prog-date','admin-prog-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('admin-prog-preview').style.display = 'none';
}

async function saveToFirebase() {
  await setDoc(doc(db, 'settings', 'main'), siteData, { merge: true });
}

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:'POST', body:fd });
  if (!res.ok) throw new Error('Upload failed');
  return (await res.json()).secure_url;
}

function previewProgImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => { const p = document.getElementById('admin-prog-preview'); p.src = e.target.result; p.style.display = 'block'; };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewLogoImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => { const p = document.getElementById('admin-logo-preview'); p.src = e.target.result; p.style.display = 'block'; };
    reader.readAsDataURL(input.files[0]);
  }
}

function showAdminToast(msg, type = 'success') {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.style.background = type === 'error' ? '#dc2626' : '#16a34a';
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 3000);
}

// ==========================================
// EXISTING SITE FUNCTIONS
// ==========================================

lucide.createIcons();

const navbar = document.getElementById('navbar');
const navText = document.querySelectorAll('.nav-text');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('nav-blur', 'shadow-lg');
    navText.forEach(el => { el.classList.remove('text-white'); el.classList.add('text-slate-900'); });
    navLinks.forEach(el => { el.classList.remove('text-white'); el.classList.add('text-slate-700'); });
  } else {
    navbar.classList.remove('nav-blur', 'shadow-lg');
    navText.forEach(el => { el.classList.add('text-white'); el.classList.remove('text-slate-900'); });
    navLinks.forEach(el => { el.classList.add('text-white'); el.classList.remove('text-slate-700'); });
  }
});

document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-message').textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { target.scrollIntoView({ behavior: 'smooth' }); document.getElementById('mobile-menu').classList.add('hidden'); }
  });
});

function checkLiveStatus() {
  const now = new Date();
  const isLive = (now.getDay() >= 0 && now.getDay() <= 6) && (now.getHours() >= 20 && now.getHours() < 22);
  document.querySelectorAll('.live-pulse').forEach(el => {
    const label = el.parentElement.querySelector('span:last-child');
    if (!isLive && label) {
      el.style.opacity = '0.5';
      label.textContent = 'Offline';
      label.classList.remove('text-red-400');
      label.classList.add('text-gray-400');
    }
  });
}
checkLiveStatus();
setInterval(checkLiveStatus, 60000);

// ==========================================
// EXPOSE TO WINDOW
// ==========================================

window.checkAdminPassword = checkAdminPassword;
window.adminLogout = adminLogout;
window.hideAdminPanel = hideAdminPanel;
window.saveLogo = saveLogo;
window.saveYoutube = saveYoutube;
window.saveActivities = saveActivities;
window.saveProgramme = saveProgramme;
window.clearProgramme = clearProgramme;
window.previewProgImage = previewProgImage;
window.previewLogoImage = previewLogoImage;
window.copyToClipboard = copyToClipboard;

// ==========================================
// INJECT ADMIN PANEL INTO PAGE
// ==========================================

function injectAdminPanel() {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div id="admin-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.75);align-items:center;justify-content:center;backdrop-filter:blur(6px);">

      <!-- Login -->
      <div id="admin-login-screen" style="display:flex;flex-direction:column;align-items:center;background:#0f172a;border:1px solid #d4af37;border-radius:16px;padding:40px;width:90%;max-width:380px;">
        <div style="font-size:40px;margin-bottom:12px;">⛪</div>
        <h2 style="color:white;font-size:22px;font-weight:700;margin-bottom:4px;font-family:'Cormorant Garamond',serif;">Admin Access</h2>
        <p style="color:#6b7280;font-size:13px;margin-bottom:24px;">House of Grace Church</p>
        <input id="admin-password-input" type="password" placeholder="Enter password"
          style="width:100%;padding:12px 16px;border-radius:8px;border:1px solid #374151;background:#1e293b;color:white;font-size:15px;margin-bottom:10px;outline:none;box-sizing:border-box;"
          onkeydown="if(event.key==='Enter')checkAdminPassword()">
        <div id="admin-error" style="display:none;color:#ef4444;font-size:13px;margin-bottom:10px;">❌ Incorrect password</div>
        <button onclick="checkAdminPassword()" style="width:100%;padding:12px;background:linear-gradient(135deg,#d4af37,#b8941f);color:white;font-weight:700;border:none;border-radius:8px;cursor:pointer;font-size:15px;margin-bottom:8px;">Unlock Panel</button>
        <button onclick="hideAdminPanel()" style="background:none;border:none;color:#6b7280;cursor:pointer;font-size:13px;">Cancel</button>
      </div>

      <!-- Dashboard -->
      <div id="admin-dashboard" style="display:none;background:#0f172a;border:1px solid #d4af37;border-radius:16px;width:95%;max-width:820px;max-height:90vh;overflow-y:auto;padding:28px;">

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;border-bottom:1px solid #1e293b;padding-bottom:16px;">
          <div>
            <h2 style="color:white;font-size:20px;font-weight:700;font-family:'Cormorant Garamond',serif;">⛪ Church Admin Panel</h2>
            <p style="color:#6b7280;font-size:12px;margin-top:3px;">Press Shift+W to open · Esc to close</p>
          </div>
          <button onclick="adminLogout()" style="background:#1e293b;border:1px solid #374151;color:#9ca3af;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;">🔒 Logout</button>
        </div>

        <!-- LOGO -->
        <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:16px;">
          <h3 style="color:#d4af37;font-size:15px;font-weight:600;margin-bottom:12px;">📷 Church Logo</h3>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
            <img id="admin-logo-preview" style="display:none;width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid #d4af37;">
            <label style="background:#0f172a;border:1px dashed #374151;border-radius:8px;padding:10px 16px;color:#9ca3af;cursor:pointer;font-size:14px;display:inline-block;">
              📁 Choose Image
              <input type="file" id="admin-logo-file" accept="image/*" style="display:none;" onchange="previewLogoImage(this)">
            </label>
            <button id="save-logo-btn" onclick="saveLogo()" style="background:linear-gradient(135deg,#d4af37,#b8941f);color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;">Save Logo</button>
          </div>
        </div>

        <!-- YOUTUBE -->
        <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:16px;">
          <h3 style="color:#d4af37;font-size:15px;font-weight:600;margin-bottom:12px;">▶️ YouTube Live Video</h3>
          <input id="admin-youtube" type="text" placeholder="Paste any YouTube link or embed URL"
            style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#0f172a;color:white;font-size:14px;margin-bottom:10px;box-sizing:border-box;outline:none;">
          <button onclick="saveYoutube()" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;">Save Video</button>
          <p style="color:#6b7280;font-size:12px;margin-top:8px;">Paste normal YouTube link — I'll convert it automatically</p>
        </div>

        <!-- PROGRAMME -->
        <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:16px;">
          <h3 style="color:#d4af37;font-size:15px;font-weight:600;margin-bottom:4px;">📅 Upcoming Programme</h3>
          <p style="color:#6b7280;font-size:12px;margin-bottom:14px;">Section is hidden when empty. Fill and save to show it on the site.</p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
            <div>
              <label style="color:#9ca3af;font-size:12px;display:block;margin-bottom:5px;">Programme Title *</label>
              <input id="admin-prog-title" type="text" placeholder="e.g. Annual Convention 2026"
                style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#0f172a;color:white;font-size:14px;box-sizing:border-box;outline:none;">
            </div>
            <div>
              <label style="color:#9ca3af;font-size:12px;display:block;margin-bottom:5px;">Date & Time *</label>
              <input id="admin-prog-date" type="datetime-local"
                style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#0f172a;color:white;font-size:14px;box-sizing:border-box;outline:none;">
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="color:#9ca3af;font-size:12px;display:block;margin-bottom:5px;">Description</label>
            <textarea id="admin-prog-desc" rows="3" placeholder="Tell people about this programme..."
              style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#0f172a;color:white;font-size:14px;box-sizing:border-box;outline:none;resize:vertical;"></textarea>
          </div>

          <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap;margin-bottom:14px;">
            <div>
              <label style="color:#9ca3af;font-size:12px;display:block;margin-bottom:5px;">Programme Image (optional)</label>
              <label style="background:#0f172a;border:1px dashed #374151;border-radius:8px;padding:10px 16px;color:#9ca3af;cursor:pointer;font-size:14px;display:inline-block;">
                📁 Choose Image
                <input type="file" id="admin-prog-image" accept="image/*" style="display:none;" onchange="previewProgImage(this)">
              </label>
            </div>
            <img id="admin-prog-preview" style="display:none;width:130px;height:100px;object-fit:cover;border-radius:8px;border:2px solid #d4af37;">
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button id="save-prog-btn" onclick="saveProgramme()" style="background:linear-gradient(135deg,#d4af37,#b8941f);color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;">Save Programme</button>
            <button onclick="clearProgramme()" style="background:#374151;color:#9ca3af;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:14px;">🗑️ Clear & Hide</button>
          </div>
        </div>

        <!-- ACTIVITIES -->
        <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:8px;">
          <h3 style="color:#d4af37;font-size:15px;font-weight:600;margin-bottom:14px;">📋 Weekly Activities</h3>
          ${['sunday','monday','wednesday'].map(day => `
          <div style="margin-bottom:14px;">
            <label style="color:#9ca3af;font-size:12px;display:block;margin-bottom:6px;text-transform:capitalize;">${day.charAt(0).toUpperCase()+day.slice(1)}</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <input id="admin-${day}-title" type="text" placeholder="Service title"
                style="padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#0f172a;color:white;font-size:14px;outline:none;">
              <input id="admin-${day}-time" type="text" placeholder="e.g. 9:00 AM WAT"
                style="padding:10px 14px;border-radius:8px;border:1px solid #374151;background:#0f172a;color:white;font-size:14px;outline:none;">
            </div>
          </div>`).join('')}
          <button onclick="saveActivities()" style="background:linear-gradient(135deg,#d4af37,#b8941f);color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;">Save Activities</button>
        </div>

      </div>
    </div>

    <!-- Admin Toast -->
    <div id="admin-toast" style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#16a34a;color:white;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;opacity:0;transition:all 0.3s ease;z-index:99999;pointer-events:none;white-space:nowrap;"></div>
  `;
  document.body.appendChild(wrap);
}

// ==========================================
// INIT
// ==========================================

injectAdminPanel();
loadSiteData();
