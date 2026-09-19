// =========================================================
// ApexSearch PWA — Amazon Affiliate Search Engine
// =========================================================

const AFFILIATE_TAG = 'apextechrevie-21';
const AMAZON_SEARCH_BASE = 'https://www.amazon.in/s?';
const AMAZON_DP_BASE = 'https://www.amazon.in/dp/';
const AMAZON_DEALS_BASE = 'https://www.amazon.in/deals?';
const RECENT_KEY = 'apexsearch_recent_searches';

// ── 1. Register Service Worker (PWA) ─────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker registered:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// ── 2. Handle PWA Install Prompt ──────────────────────────
let deferredPrompt;
const installBanner = document.getElementById('pwa-install-banner');
const btnInstall = document.getElementById('btn-install-pwa');
const btnClosePwa = document.getElementById('btn-close-pwa');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBanner) {
    installBanner.style.display = 'flex';
  }
});

if (btnInstall) {
  btnInstall.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
    if (installBanner) installBanner.style.display = 'none';
  });
}

if (btnClosePwa && installBanner) {
  btnClosePwa.addEventListener('click', () => {
    installBanner.style.display = 'none';
  });
}

// ── 3. Amazon Search Logic ────────────────────────────────
function buildSearchURL(query, category) {
  const params = new URLSearchParams();
  params.set('k', query);
  if (category && category !== 'electronics' && category !== 'todays-deals') {
    params.set('i', category);
  }
  params.set('tag', AFFILIATE_TAG);
  return `${AMAZON_SEARCH_BASE}${params.toString()}`;
}

function buildDealsURL(query) {
  return `${AMAZON_DEALS_BASE}k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
}

function launchSearch(query, category) {
  if (!query) return;
  saveRecentSearch(query);

  let url;
  if (category === 'todays-deals') {
    url = buildDealsURL(query);
  } else {
    url = buildSearchURL(query, category || 'electronics');
  }
  window.open(url, '_blank');
}

// ── 4. Recent Searches Storage ────────────────────────────
function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveRecentSearch(query) {
  const clean = query.trim();
  if (!clean) return;

  let recents = getRecentSearches().filter(q => q.toLowerCase() !== clean.toLowerCase());
  recents.unshift(clean);
  recents = recents.slice(0, 6); // Keep last 6
  localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
  renderRecentSearches();
}

function renderRecentSearches() {
  const wrap = document.getElementById('recent-searches-wrap');
  const container = document.getElementById('recent-chips');
  const recents = getRecentSearches();

  if (!wrap || !container) return;

  if (recents.length === 0) {
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';
  container.innerHTML = recents.map(q => `
    <button type="button" class="chip" data-query="${q.replace(/"/g, '&quot;')}">${q}</button>
  `).join('');

  container.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      const input = document.getElementById('amazon-query');
      if (input) input.value = q;
      const cat = document.getElementById('amazon-category')?.value || 'electronics';
      launchSearch(q, cat);
    });
  });
}

// ── 5. Initialize UI Events ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('amazon-search-form');
  const queryInput = document.getElementById('amazon-query');
  const categorySelect = document.getElementById('amazon-category');
  const btnClear = document.getElementById('btn-clear-query');

  // Show/hide clear button
  if (queryInput && btnClear) {
    queryInput.addEventListener('input', () => {
      btnClear.style.display = queryInput.value.length > 0 ? 'flex' : 'none';
    });
    btnClear.addEventListener('click', () => {
      queryInput.value = '';
      btnClear.style.display = 'none';
      queryInput.focus();
    });
  }

  // Search form submit
  if (searchForm && queryInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = queryInput.value.trim();
      const cat = categorySelect ? categorySelect.value : 'electronics';
      launchSearch(q, cat);
    });
  }

  // Direct ASIN / URL Launcher
  const btnLaunchAsin = document.getElementById('btn-launch-asin');
  const asinInput = document.getElementById('direct-asin-input');

  if (btnLaunchAsin && asinInput) {
    const handleAsinLaunch = () => {
      const val = asinInput.value.trim();
      if (!val) return;

      const asinMatch = val.match(/(?:dp\/|gp\/product\/|asin=|\/)([A-Z0-9]{10})(?:[/?&]|$)/i) || val.match(/^[A-Z0-9]{10}$/i);

      if (asinMatch) {
        const asin = (asinMatch[1] || asinMatch[0]).toUpperCase();
        window.open(`${AMAZON_DP_BASE}${asin}?tag=${AFFILIATE_TAG}`, '_blank');
      } else {
        // Fallback: search for input text
        launchSearch(val, 'electronics');
      }
    };

    btnLaunchAsin.addEventListener('click', handleAsinLaunch);
    asinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAsinLaunch();
    });
  }

  // Clear all recents
  const btnClearRecent = document.getElementById('btn-clear-recent');
  if (btnClearRecent) {
    btnClearRecent.addEventListener('click', () => {
      localStorage.removeItem(RECENT_KEY);
      renderRecentSearches();
    });
  }

  renderRecentSearches();
});
