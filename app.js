// =========================================================
// ApexTech Hub — Live Amazon Search Engine & Deals Engine
// Automatically injects your Amazon Associate Tag into every search
// =========================================================

const AMAZON_SEARCH_BASE = 'https://www.amazon.in/s?';
const AMAZON_DP_BASE = 'https://www.amazon.in/dp/';
const AMAZON_DEALS_BASE = 'https://www.amazon.in/deals?';

const TRENDING_SEARCHES = [
  "Sony WH-1000XM5",
  "iPhone 16 Pro",
  "MacBook Air M3",
  "Mechanical Keyboard",
  "Anker 100W GaN Charger",
  "Samsung Galaxy S24",
  "Logitech MX Master 3S",
  "4K Gaming Monitor",
  "Boat Airdopes ANC",
  "iPad Air M2"
];

const CATEGORIES_DATA = [
  {
    id: "audio",
    icon: "🎧",
    title: "Headphones & Earbuds",
    desc: "Active noise cancellation, studio monitors, wireless earbuds & soundbars.",
    query: "wireless noise cancelling headphones",
    tags: ["Sony", "Bose", "Sennheiser", "Apple AirPods", "Boat", "JBL"]
  },
  {
    id: "laptops",
    icon: "💻",
    title: "Laptops & Computers",
    desc: "Productivity ultrabooks, Apple MacBooks, gaming rigs & tablets.",
    query: "laptops for productivity and gaming",
    tags: ["Apple MacBook", "Dell XPS", "Asus ROG", "Lenovo ThinkPad", "HP Pavilion"]
  },
  {
    id: "phones",
    icon: "📱",
    title: "Smartphones & 5G Mobiles",
    desc: "Flagship smartphones, budget 5G picks, high-wattage chargers & cases.",
    query: "5G smartphones",
    tags: ["Apple iPhone", "Samsung Galaxy", "OnePlus", "Google Pixel", "Xiaomi"]
  },
  {
    id: "smartwatches",
    icon: "⌚",
    title: "Smartwatches & Wearables",
    desc: "Fitness trackers, AMOLED smartwatches, heart monitors & GPS sports watches.",
    query: "smartwatches for men and women",
    tags: ["Apple Watch", "Samsung Galaxy Watch", "Garmin", "Amazfit", "Noise"]
  },
  {
    id: "gaming",
    icon: "🎮",
    title: "Gaming & Consoles",
    desc: "PS5, Xbox, mechanical gaming keyboards, high-DPI mice & 144Hz+ monitors.",
    query: "gaming gear and accessories",
    tags: ["PlayStation 5", "Xbox Series X", "Razer", "Logitech G", "SteelSeries"]
  },
  {
    id: "workstation",
    icon: "🔌",
    title: "Workstation Docks & Hubs",
    desc: "Dual 4K USB-C docking stations, GaN chargers, monitor arms & desk hubs.",
    query: "usb c docking station dual 4k",
    tags: ["Anker", "Belkin", "Ugreen", "Baseus", "Satechi"]
  },
  {
    id: "tv-audio",
    icon: "📺",
    title: "Smart TVs & Home Audio",
    desc: "4K OLED displays, Dolby Atmos soundbars, streaming sticks & projectors.",
    query: "4k oled smart tv",
    tags: ["Sony Bravia", "LG OLED", "Samsung QLED", "Fire TV Stick 4K", "JBL Bar"]
  },
  {
    id: "creator",
    icon: "🎙️",
    title: "Content Creator & Streaming",
    desc: "USB dynamic microphones, 4K webcams, ring lights & capture cards.",
    query: "streaming microphone and webcam",
    tags: ["Shure", "Rode", "Elgato", "Blue Yeti", "Logitech Brio"]
  }
];

// Helper: Get active affiliate tag
function getActiveTag() {
  const input = document.getElementById('tag-input');
  return (input && input.value.trim()) || 'apextechrevie-21';
}

// Build Amazon search URL
function buildSearchURL(query, categoryNode, tag) {
  const params = new URLSearchParams();
  params.set('k', query);
  if (categoryNode && categoryNode !== 'electronics' && categoryNode !== 'todays-deals') {
    params.set('i', categoryNode);
  }
  params.set('tag', tag);
  return `${AMAZON_SEARCH_BASE}${params.toString()}`;
}

// Build Amazon deals URL
function buildDealsURL(query, tag) {
  return `${AMAZON_DEALS_BASE}k=${encodeURIComponent(query)}&tag=${tag}`;
}

// Render Trending Chips
function renderTrendingChips(tag) {
  const container = document.getElementById('trending-chips');
  if (!container) return;

  container.innerHTML = TRENDING_SEARCHES.map(term => {
    const url = buildSearchURL(term, 'electronics', tag);
    return `<a href="${url}" class="chip-item" target="_blank" rel="sponsored nofollow">${term}</a>`;
  }).join('');
}

// Render Category Cards
function renderCategories(tag) {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = CATEGORIES_DATA.map(cat => {
    const catUrl = buildSearchURL(cat.query, 'electronics', tag);

    const subPills = cat.tags.map(brand => {
      const brandUrl = buildSearchURL(`${brand} ${cat.title}`, 'electronics', tag);
      return `<a href="${brandUrl}" class="cat-pill" target="_blank" rel="sponsored nofollow">${brand}</a>`;
    }).join('');

    return `
      <div class="category-card" id="cat-${cat.id}">
        <div class="category-card-top">
          <div class="cat-icon">${cat.icon}</div>
          <div>
            <h3>${cat.title}</h3>
            <p>${cat.desc}</p>
          </div>
        </div>

        <div class="cat-brands-wrap">
          <span class="cat-brands-label">Popular Searches:</span>
          <div class="cat-pills-list">${subPills}</div>
        </div>

        <a href="${catUrl}" class="btn-category-search" target="_blank" rel="sponsored nofollow">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          Search ${cat.title} on Amazon
        </a>
      </div>
    `;
  }).join('');
}

// Update Highlight Banners
function updateHighlightBanners(tag) {
  const lightning = document.getElementById('deal-lightning');
  const prime = document.getElementById('deal-prime');

  if (lightning) {
    lightning.href = `${AMAZON_DEALS_BASE}i=electronics&tag=${tag}`;
  }
  if (prime) {
    lightning.href = `${AMAZON_SEARCH_BASE}k=electronics+best+sellers&tag=${tag}`;
  }
}

// Global helper for footer links
window.searchWithCategory = function(term) {
  const tag = getActiveTag();
  const url = buildSearchURL(term, 'electronics', tag);
  window.open(url, '_blank');
};

// Initialize
function init() {
  const tag = getActiveTag();
  renderTrendingChips(tag);
  renderCategories(tag);
  updateHighlightBanners(tag);

  // Search Form Submit
  const searchForm = document.getElementById('amazon-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const queryInput = document.getElementById('amazon-query');
      const categorySelect = document.getElementById('amazon-category');
      const query = queryInput.value.trim() || 'electronics best deals';
      const category = categorySelect.value;
      const currentTag = getActiveTag();

      let targetUrl;
      if (category === 'todays-deals') {
        targetUrl = buildDealsURL(query, currentTag);
      } else {
        targetUrl = buildSearchURL(query, category, currentTag);
      }

      window.open(targetUrl, '_blank');
    });
  }

  // Tag Input Changes
  const tagInput = document.getElementById('tag-input');
  const tagStatus = document.getElementById('tag-status');
  if (tagInput) {
    tagInput.addEventListener('input', function() {
      const newTag = this.value.trim() || 'apextechrevie-21';
      renderTrendingChips(newTag);
      renderCategories(newTag);
      updateHighlightBanners(newTag);
      if (tagStatus) {
        tagStatus.textContent = `Active (${newTag})`;
        tagStatus.style.color = '#10b981';
      }
    });
  }

  // Direct ASIN / URL Launcher
  const btnLaunch = document.getElementById('btn-launch-asin');
  const asinInput = document.getElementById('direct-asin-input');

  if (btnLaunch && asinInput) {
    const launchAsin = () => {
      const val = asinInput.value.trim();
      if (!val) return;

      const currentTag = getActiveTag();
      // Match 10-character alphanumeric ASIN
      const asinMatch = val.match(/(?:dp\/|gp\/product\/|asin=|\/)([A-Z0-9]{10})(?:[/?&]|$)/i) || val.match(/^[A-Z0-9]{10}$/i);

      if (asinMatch) {
        const asin = asinMatch[1] || asinMatch[0];
        window.open(`${AMAZON_DP_BASE}${asin.toUpperCase()}?tag=${currentTag}`, '_blank');
      } else {
        // Fallback: search for whatever text was entered
        window.open(buildSearchURL(val, 'electronics', currentTag), '_blank');
      }
    };

    btnLaunch.addEventListener('click', launchAsin);
    asinInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') launchAsin();
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
