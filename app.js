// =========================================================
// ApexTech Reviews — Data-Driven App Engine
// All products are loaded from products.json.
// To add a new product: just add an entry to products.json!
// =========================================================

const AMAZON_BASE = 'https://www.amazon.in/dp/';
const BADGE_CLASSES = {
  'editors-choice': 'award-editors-choice',
  'best-value': 'award-best-value',
  'enthusiast': 'award-enthusiast'
};

const CATEGORY_ICONS = {
  audio: '🎧',
  mic: '🎙️',
  keyboard: '⌨️',
  dock: '🔌'
};

// ── Helper: build an affiliate URL ──────────────────────────────────────────
function buildLink(asin, tag) {
  return `${AMAZON_BASE}${asin}?tag=${tag}`;
}

// ── Helper: Amazon SVG icon ──────────────────────────────────────────────────
function amazonSVG() {
  return `<svg viewBox="0 0 24 24"><path d="M15.3 11.2c-.1-.7-.4-1.3-.9-1.8-.5-.5-1.1-.8-1.8-.9-.8 0-1.4.3-2 .8-.5.5-.8 1.1-.9 1.9h5.6zm1.9 2.5c-.1.7-.4 1.3-.8 1.8-.5.5-1.1.8-1.9.9-.7 0-1.4-.3-1.9-.8-.5-.5-.8-1.1-.9-1.9h5.5zM21.7 20.3c-.3.3-.8.4-1.2.4-1.5 0-3.3-.7-5.5-2.1-2.2-1.4-4-3-5.4-4.8C8.2 12 7.3 10.3 7 8.7c-.2-.9 0-1.7.5-2.3.4-.6 1.1-.9 2-.9 1 0 1.8.4 2.3 1.2.4.7.6 1.5.6 2.4 0 .9-.3 1.7-.8 2.4-.5.7-1.2 1.2-2.1 1.5.6 1.1 1.4 2.1 2.4 3 1 1 2.2 1.8 3.5 2.5.4-.7.9-1.3 1.6-1.7.7-.4 1.4-.6 2.2-.6.9 0 1.7.3 2.3.9.6.6.9 1.4.9 2.3-.1.4-.2.7-.4.9z"/></svg>`;
}

// ── Render: Top Verdict Box (first product marked topPick:true) ──────────────
function renderVerdictBox(product, tag) {
  const link = buildLink(product.asin, tag);
  return `
  <div class="verdict-box" id="top-pick">
    <div class="verdict-header">
      <span class="verdict-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        Editor's Choice 2026
      </span>
      <div class="verdict-score">
        <span style="font-size:0.85rem;color:var(--text-secondary)">Lab Score</span>
        <div class="score-circle">${product.score}</div>
      </div>
    </div>
    <div class="verdict-grid">
      <div class="verdict-image-wrapper">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="verdict-content">
        <h2>${product.title}</h2>
        <p class="verdict-summary">${product.summary}</p>
        <div class="verdict-highlights">
          ${product.highlights.map(h => `<span class="highlight-tag">✓ ${h}</span>`).join('')}
        </div>
        <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">
          <a href="${link}" class="cta-amazon affiliate-link" target="_blank" rel="sponsored nofollow" data-asin="${product.asin}">
            ${amazonSVG()} Check Price on Amazon.in
          </a>
          <a href="#${product.id}" class="cta-secondary">Read Full Deep-Dive ↓</a>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Render: Comparison Table Row ─────────────────────────────────────────────
function renderTableRow(product, tag) {
  const link = buildLink(product.asin, tag);
  const badgeClass = BADGE_CLASSES[product.badge] || 'award-best-value';
  return `
  <tr data-cat="${product.category}">
    <td>
      <div class="table-product-cell">
        <img src="${product.image}" class="table-product-thumb" alt="${product.title}">
        <div>
          <div class="table-product-title">${product.title}</div>
          <span class="award-badge ${badgeClass}">${product.badgeLabel}</span>
        </div>
      </div>
    </td>
    <td>${CATEGORY_ICONS[product.category] || ''} ${product.category}</td>
    <td>${product.keyFeature}</td>
    <td><strong style="color:var(--accent-emerald)">${product.score} / 10</strong></td>
    <td>${product.targetBuyer}</td>
    <td>
      <a href="${link}" class="cta-amazon affiliate-link" style="padding:8px 14px;font-size:0.82rem" target="_blank" rel="sponsored nofollow" data-asin="${product.asin}">
        View on Amazon
      </a>
    </td>
  </tr>`;
}

// ── Render: Full Deep-Dive Review Card ────────────────────────────────────────
function renderReviewCard(product, index, tag) {
  const link = buildLink(product.asin, tag);
  const badgeClass = BADGE_CLASSES[product.badge] || 'award-best-value';
  const specsHTML = Object.entries(product.specs)
    .map(([k, v]) => `<div class="spec-chip-item"><span>${k}:</span><strong>${v}</strong></div>`)
    .join('');
  const prosHTML = product.pros.map(p => `<li>${p}</li>`).join('');
  const consHTML = product.cons.map(c => `<li>${c}</li>`).join('');

  return `
  <article class="review-card" id="${product.id}" data-cat="${product.category}">
    <div class="review-card-top">
      <div>
        <div class="review-badge-row">
          <span class="award-badge ${badgeClass}">${product.badgeLabel}</span>
          <span style="font-size:0.8rem;color:var(--text-muted)">ASIN: ${product.asin}</span>
        </div>
        <h3 class="review-card-title">${index + 1}. ${product.title}</h3>
      </div>
      <div class="review-rating-pill">★ ${product.rating} / 5.0</div>
    </div>

    <div class="review-body-layout">
      <div class="review-gallery">
        <img src="${product.image}" class="main-product-img" alt="${product.title}">
        <div class="spec-chip-list">${specsHTML}</div>
      </div>

      <div>
        <p style="color:var(--text-secondary);margin-bottom:20px">${product.summary}</p>

        <div class="pros-cons-container">
          <div class="pro-column">
            <div class="box-heading">✓ What We Loved (Pros)</div>
            <ul class="pros-cons-list">${prosHTML}</ul>
          </div>
          <div class="con-column">
            <div class="box-heading">✕ Where It Falls Short (Cons)</div>
            <ul class="pros-cons-list">${consHTML}</ul>
          </div>
        </div>

        <div class="audience-row">
          <div class="audience-card buy">
            <strong>Buy this if:</strong> ${product.buyIf}
          </div>
          <div class="audience-card skip">
            <strong>Skip this if:</strong> ${product.skipIf}
          </div>
        </div>

        <div class="review-actions">
          <span class="pricing-note">${product.pricingNote}</span>
          <a href="${link}" class="cta-amazon affiliate-link" target="_blank" rel="sponsored nofollow" data-asin="${product.asin}">
            ${amazonSVG()} Check Latest Price on Amazon.in
          </a>
        </div>
      </div>
    </div>
  </article>`;
}

// ── Render: Google Product Review Schema (JSON-LD) ────────────────────────────
function injectSchema(product) {
  const existing = document.getElementById('product-schema');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'product-schema';
  script.textContent = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.summary,
    "review": {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": String(product.rating), "bestRating": "5" },
      "author": { "@type": "Person", "name": "ApexTech Editorial Team" },
      "publisher": { "@type": "Organization", "name": "ApexTech Reviews" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(product.rating),
      "reviewCount": "184"
    }
  }, null, 2);
  document.head.appendChild(script);
}

// ── Main: Load products.json & build entire page ──────────────────────────────
async function init() {
  let products;
  try {
    const res = await fetch('products.json');
    products = await res.json();
  } catch (e) {
    console.error('Could not load products.json:', e);
    return;
  }

  const tag = document.getElementById('tag-input').value || 'apextechrevie-21';

  // Render verdict box (first topPick)
  const topPick = products.find(p => p.topPick) || products[0];
  document.getElementById('top-pick-container').innerHTML = renderVerdictBox(topPick, tag);
  injectSchema(topPick);

  // Render comparison table
  const tbody = document.getElementById('comparison-table-body');
  tbody.innerHTML = products.map(p => renderTableRow(p, tag)).join('');

  // Render review cards
  const grid = document.getElementById('reviews-grid');
  grid.innerHTML = products.map((p, i) => renderReviewCard(p, i, tag)).join('');

  // Mobile sticky bar
  const mobileBar = document.getElementById('mobile-cta-bar');
  const mobileTitle = document.getElementById('mobile-product-title');
  const mobileCTALink = document.getElementById('mobile-cta-link');
  if (mobileBar) {
    mobileBar.style.display = '';
    mobileCTALink.href = buildLink(topPick.asin, tag);
    mobileTitle.textContent = topPick.title.slice(0, 28) + '...';
  }

  // ── Amazon Tag Configurator ──────────────────────────────────────────────
  const tagInput = document.getElementById('tag-input');
  const tagStatus = document.getElementById('tag-status');

  function refreshAllLinks(newTag) {
    document.querySelectorAll('.affiliate-link').forEach(link => {
      const asin = link.getAttribute('data-asin');
      if (asin) link.href = buildLink(asin, newTag);
    });
    if (mobileCTALink) mobileCTALink.href = buildLink(topPick.asin, newTag);
    tagStatus.textContent = `Active (${newTag})`;
    tagStatus.style.color = '#10b981';
    tagStatus.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 300 });
  }

  tagInput.addEventListener('input', e => refreshAllLinks(e.target.value.trim() || 'apextechrevie-21'));

  // ── Category Filter ──────────────────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');

      document.querySelectorAll('#comparison-table-body tr').forEach(row => {
        row.style.display = (cat === 'all' || row.dataset.cat === cat) ? '' : 'none';
      });
      document.querySelectorAll('.review-card').forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) card.animate(
          [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 250, easing: 'ease-out' }
        );
      });
    });
  });

  // ── Mobile sticky context switcher (updates as user scrolls) ────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const asin = entry.target.querySelector('.affiliate-link')?.dataset.asin;
        const title = entry.target.querySelector('.review-card-title')?.textContent || '';
        const currentTag = tagInput.value.trim() || 'apextechrevie-21';
        if (asin && mobileCTALink) mobileCTALink.href = buildLink(asin, currentTag);
        if (mobileTitle) mobileTitle.textContent = title.replace(/^\d+\.\s*/, '').slice(0, 28) + '...';
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.review-card').forEach(card => observer.observe(card));

  // ── Blogger / WordPress export helpers ───────────────────────────────────
  function showAndCopy(text, btn) {
    const preview = document.getElementById('code-preview');
    document.getElementById('snippet-text').textContent = text;
    preview.style.display = 'block';
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.style.background = '#10b981';
      btn.style.color = '#fff';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 2500);
    });
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('btn-copy-table')?.addEventListener('click', function () {
    showAndCopy('<!-- Comparison Table -->\n' + document.querySelector('.table-container').outerHTML, this);
  });
  document.getElementById('btn-copy-card')?.addEventListener('click', function () {
    const card = document.querySelector('.review-card');
    showAndCopy('<!-- Review Card -->\n' + (card ? card.outerHTML : ''), this);
  });
  document.getElementById('btn-copy-schema')?.addEventListener('click', function () {
    const s = document.getElementById('product-schema');
    showAndCopy(s ? `<script type="application/ld+json">\n${s.textContent}\n<\/script>` : '', this);
  });
}

document.addEventListener('DOMContentLoaded', init);
