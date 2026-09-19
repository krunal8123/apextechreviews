// =========================================================
// ApexSearch PWA — Multi-Store Search Engine
// (Amazon, Flipkart, boAt, Myntra, Croma, Samsung)
// =========================================================

const AFFILIATE_TAG = 'apextechrevie-21';
const AMAZON_SEARCH_BASE = 'https://www.amazon.in/s?';
const AMAZON_DP_BASE = 'https://www.amazon.in/dp/';
const AMAZON_DEALS_BASE = 'https://www.amazon.in/deals?';
const RECENT_KEY = 'apexsearch_recent_searches';

const STORE_CONFIG = {
  amazon: {
    name: 'Amazon',
    btnClass: 'btn-store-amazon',
    placeholder: 'Search Amazon phones, laptops, headphones, deals...',
    hasCategory: true,
    buildUrl: (query, category) => {
      const params = new URLSearchParams();
      params.set('k', query);
      if (category && category !== 'electronics' && category !== 'todays-deals') {
        params.set('i', category);
      }
      params.set('tag', AFFILIATE_TAG);
      return category === 'todays-deals'
        ? `${AMAZON_DEALS_BASE}k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`
        : `${AMAZON_SEARCH_BASE}${params.toString()}`;
    }
  },
  flipkart: {
    name: 'Flipkart',
    btnClass: 'btn-store-flipkart',
    placeholder: 'Search Flipkart mobiles, laptops, electronics...',
    hasCategory: false,
    buildUrl: (query) => `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`
  },
  boat: {
    name: 'boAt',
    btnClass: 'btn-store-boat',
    placeholder: 'Search boAt Airdopes, headphones, smartwatches...',
    hasCategory: false,
    buildUrl: (query) => `https://www.boat-lifestyle.com/search?q=${encodeURIComponent(query)}`
  },
  myntra: {
    name: 'Myntra',
    btnClass: 'btn-store-myntra',
    placeholder: 'Search Myntra smartwatches, audio, wearables...',
    hasCategory: false,
    buildUrl: (query) => `https://www.myntra.com/${encodeURIComponent(query)}`
  },
  croma: {
    name: 'Croma',
    btnClass: 'btn-store-croma',
    placeholder: 'Search Croma laptops, TVs, audio, gadgets...',
    hasCategory: false,
    buildUrl: (query) => `https://www.croma.com/searchB?q=${encodeURIComponent(query)}`
  },
  samsung: {
    name: 'Samsung',
    btnClass: 'btn-store-samsung',
    placeholder: 'Search Samsung Galaxy phones, tablets, monitors...',
    hasCategory: false,
    buildUrl: (query) => `https://www.samsung.com/in/search/?searchvalue=${encodeURIComponent(query)}`
  }
};

let currentStore = 'amazon';

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

// ── 3. Launch Search ──────────────────────────────────────
function launchSearch(query, category) {
  if (!query) return;
  saveRecentSearch(query);

  const config = STORE_CONFIG[currentStore] || STORE_CONFIG.amazon;
  const targetUrl = config.buildUrl(query, category);

  window.open(targetUrl, '_blank');
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
  recents = recents.slice(0, 6);
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
  const btnSubmit = document.getElementById('btn-submit-search');
  const searchBtnLabel = document.getElementById('search-btn-label');
  const storeTabs = document.querySelectorAll('.store-tab');

  const allBtnClasses = Object.values(STORE_CONFIG).map(c => c.btnClass);

  // Store selector switcher
  storeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      storeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStore = tab.getAttribute('data-store');

      const config = STORE_CONFIG[currentStore] || STORE_CONFIG.amazon;

      // Update button text and color
      searchBtnLabel.textContent = `Search ${config.name}`;
      allBtnClasses.forEach(cls => btnSubmit.classList.remove(cls));
      btnSubmit.classList.add(config.btnClass);

      queryInput.placeholder = config.placeholder;

      // Category filter only needed for Amazon
      if (categorySelect) {
        categorySelect.style.display = config.hasCategory ? '' : 'none';
      }
    });
  });

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

  // Direct Product URL / ASIN Launcher
  const btnLaunchAsin = document.getElementById('btn-launch-asin');
  const asinInput = document.getElementById('direct-asin-input');

  if (btnLaunchAsin && asinInput) {
    const handleAsinLaunch = () => {
      const val = asinInput.value.trim();
      if (!val) return;

      // Supported Cuelinks direct domains (auto-monetized)
      const isDirectSupportedUrl = [
        'flipkart.com',
        'boat-lifestyle.com',
        'myntra.com',
        'croma.com',
        'samsung.com',
        'reliancedigital.in',
        'tatacliq.com',
        'ajio.com'
      ].some(domain => val.includes(domain));

      if (isDirectSupportedUrl) {
        window.open(val, '_blank');
        return;
      }

      // Amazon ASIN check
      const asinMatch = val.match(/(?:dp\/|gp\/product\/|asin=|\/)([A-Z0-9]{10})(?:[/?&]|$)/i) || val.match(/^[A-Z0-9]{10}$/i);
      if (asinMatch) {
        const asin = (asinMatch[1] || asinMatch[0]).toUpperCase();
        window.open(`${AMAZON_DP_BASE}${asin}?tag=${AFFILIATE_TAG}`, '_blank');
      } else {
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
