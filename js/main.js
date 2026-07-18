/* =====================
   蒙顶山茶线上博物馆 - Main JavaScript
   ===================== */

let currentLang = localStorage.getItem('mengdingLang') || 'zh';
let translations = {};

// --- Load Translations ---
async function loadTranslations(lang) {
    try {
        const response = await fetch(`./i18n/${lang}.json`);
        translations = await response.json();
        window.translations = translations;
        applyTranslations();
    } catch (error) {
        console.error('Failed to load translations:', error);
    }
}

// --- Apply Translations to DOM ---
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.dataset.i18n.split('.');
        let value = translations;
        for (const key of keys) {
            if (value) value = value[key];
        }
        if (typeof value === 'string') {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.textContent = value;
            }
        }
    });

    // Update document title
    if (translations.nav) {
        const page = document.body.dataset.page;
        // Map internal page names to nav keys for title
        const pageTitleMap = {
            'index': 'home',
            'history': 'history',
            'collection': 'collection',
            'craft': 'craft',
            'visit': 'visit'
        };
        const navKey = pageTitleMap[page] || page;
        if (translations.nav[navKey]) {
            document.title = translations.nav[navKey] + ' | 蒙顶山茶文化数字博物馆';
        }
    }

    // Update language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

// --- Switch Language ---
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('mengdingLang', lang);
    loadTranslations(lang);
}

// --- Header scroll effect ---
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// --- Mobile Menu Toggle ---
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (toggle) {
        toggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }
}

// --- Active Nav Link ---
function initActiveNav() {
    const currentPage = document.body.dataset.page;
    if (currentPage) {
        document.querySelectorAll('.nav-list a').forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href ? href.replace('.html', '') : '';
            if (linkPage === currentPage || (currentPage === 'index' && linkPage === 'index')) {
                link.classList.add('active');
            }
        });
    }
}

// --- AOS-like Scroll Animation ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// --- Refresh animations for dynamically loaded content ---
function refreshAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        // Only trigger if not already visible
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    // Set page identifier
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'index.html';
    document.body.dataset.page = pageName.replace('.html', '');

    initHeader();
    initMobileMenu();
    initActiveNav();
    loadTranslations(currentLang);
    initScrollAnimations();
});
