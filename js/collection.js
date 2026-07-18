/* =====================
   蒙顶山茶线上博物馆 - Collection Hall
   ===================== */

let currentFilter = 'all';
let currentTab = 'exhibits';
let currentModalIndex = 0;

// --- Render Exhibits ---
function renderExhibits(category = 'all') {
    const grid = document.getElementById('collectionGrid');
    if (!grid) return;

    const exhibits = translations.collection?.list || [];
    const filtered = category === 'all' ? exhibits : exhibits.filter(e => e.category === category);

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="text-center" style="grid-column:1/-1;padding:60px 0;color:var(--color-text-light);">
            <i class="fas fa-leaf" style="font-size:2rem;margin-bottom:15px;display:block;"></i>
            <span>暂无展品</span>
        </div>`;
        return;
    }

    grid.innerHTML = filtered.map((item, index) => {
        const catKey = 'collection.categories.' + item.category;
        const catName = getNestedTranslation(catKey) || item.category;
        const globalIndex = exhibits.indexOf(item);
        const imgIndex = (globalIndex % 6) + 1;
        const eraText = item.era || '';

        return `
            <div class="exhibit-card media-tile animate-on-scroll" role="button" tabindex="0" onclick="openExhibitModal(${globalIndex})">
                <div class="exhibit-img">
                    <img src="./images/products/tea-${imgIndex}.jpg" alt="${item.name}"
                         onerror="this.src='https://via.placeholder.com/400x300/5B7B3A/FFFFFF?text=${encodeURIComponent(item.name)}'">
                    <span class="exhibit-era">${eraText}</span>
                </div>
                <div class="exhibit-info">
                    <span class="exhibit-category">${catName}</span>
                    <h4>${item.name}</h4>
                    <p class="exhibit-origin">${item.origin || ''}</p>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
    }).join('');

    grid.querySelectorAll('.exhibit-card[role="button"]').forEach(card => {
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.click();
            }
        });
    });

    refreshAnimations();
}

// --- Render Tools ---
function renderTools() {
    const grid = document.getElementById('collectionGrid');
    if (!grid) return;

    const tools = translations.collection?.tools || [];

    grid.innerHTML = tools.map((tool, index) => {
        return `
            <div class="tool-card animate-on-scroll">
                <div class="tool-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <div class="tool-info">
                    <span class="tool-era">${tool.era}</span>
                    <h4>${tool.name}</h4>
                    <p>${tool.desc}</p>
                </div>
            </div>
        `;
    }).join('');

    refreshAnimations();
}

// --- Open Exhibit Modal ---
function openExhibitModal(index) {
    const overlay = document.getElementById('exhibitModal');
    const exhibits = translations.collection?.list || [];
    const item = exhibits[index];
    if (!overlay || !item) return;

    currentModalIndex = index;
    const catKey = 'collection.categories.' + item.category;
    const catName = getNestedTranslation(catKey) || item.category;
    const imgIndex = (index % 6) + 1;

    overlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeExhibitModal()">&times;</button>
            <button class="modal-nav modal-prev" onclick="showPreviousExhibit()" aria-label="Previous exhibit">&#8249;</button>
            <button class="modal-nav modal-next" onclick="showNextExhibit()" aria-label="Next exhibit">&#8250;</button>
            <img src="./images/products/tea-${imgIndex}.jpg" alt="${item.name}"
                 onerror="this.src='https://via.placeholder.com/600x400/5B7B3A/FFFFFF?text=${encodeURIComponent(item.name)}'">
            <span class="modal-era">${item.era}</span>
            <span class="modal-category">${catName}</span>
            <h2>${item.name}</h2>
            <p class="modal-origin"><i class="fas fa-map-marker-alt"></i> ${item.origin || ''}</p>
            <p>${item.detail}</p>
        </div>
    `;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// --- Navigate Exhibit Modal ---
function showPreviousExhibit() {
    const exhibits = translations.collection?.list || [];
    if (!exhibits.length) return;
    const nextIndex = (currentModalIndex - 1 + exhibits.length) % exhibits.length;
    openExhibitModal(nextIndex);
}

function showNextExhibit() {
    const exhibits = translations.collection?.list || [];
    if (!exhibits.length) return;
    const nextIndex = (currentModalIndex + 1) % exhibits.length;
    openExhibitModal(nextIndex);
}

// --- Close Exhibit Modal ---
function closeExhibitModal() {
    document.getElementById('exhibitModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

// --- Filter Exhibits ---
function filterExhibits(category) {
    currentFilter = category;
    if (currentTab === 'exhibits') {
        renderExhibits(category);
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
}

// --- Switch Tab (Exhibits / Tools) ---
function switchTab(tab) {
    currentTab = tab;
    currentFilter = 'all';

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Show/hide filters for exhibits
    const filters = document.querySelector('.exhibit-filters');
    if (filters) {
        filters.style.display = tab === 'exhibits' ? 'flex' : 'none';
    }

    if (tab === 'exhibits') {
        renderExhibits('all');
    } else {
        renderTools();
    }
}

// --- Helper: Get nested translation ---
function getNestedTranslation(key) {
    const keys = key.split('.');
    let value = window.translations;
    for (const k of keys) {
        if (value) value = value[k];
    }
    return typeof value === 'string' ? value : null;
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterExhibits(btn.dataset.filter);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeExhibitModal();
        if (document.getElementById('exhibitModal')?.classList.contains('active')) {
            if (event.key === 'ArrowLeft') showPreviousExhibit();
            if (event.key === 'ArrowRight') showNextExhibit();
        }
    });

    document.getElementById('exhibitModal')?.addEventListener('click', event => {
        if (event.target.id === 'exhibitModal') closeExhibitModal();
    });

    // Wait for translations to load then render
    const checkInterval = setInterval(() => {
        if (translations.collection?.list) {
            renderExhibits('all');
            clearInterval(checkInterval);
        }
    }, 200);
});
