const PHONE = '919718503557';

/* ============================================================
   SCROLL REVEAL (ROBUST)
   ============================================================ */
function initReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        revealObserver.observe(el);
    });
}
// Run once on load
document.addEventListener('DOMContentLoaded', initReveal);
// Fallback: If elements are still invisible after 2s, force show
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible), .reveal-item:not(.visible)').forEach(el => el.classList.add('visible'));
}, 2000);

/* ============================================================
   NAVBAR & HAMBURGER
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

/* ============================================================
   DYNAMIC GALLERY — REALTIME (WITH DEMO DATA PERSISTENCE)
   ============================================================ */
const FALLBACK_IMAGES = [
    { src: 'images/product_decorative_profiles_1774335241973.png', caption: 'Decorative Moulding Profiles', cat: 'mouldings' },
    { src: 'images/gallery_timber_market_1774335441095.png', caption: 'Our Timber Market Shop', cat: 'shop' },
    { src: 'images/gallery_door_frame_1774335510456.png', caption: 'Premium Door Frame / Chaukhat', cat: 'frames' },
    { src: 'images/gallery_interior_wood_1774335289934.png', caption: 'Luxury Interior Wood Paneling', cat: 'interiors' },
    { src: 'images/product_furniture_wood_1774335208530.png', caption: 'Furniture Wood Work', cat: 'furniture' },
    { src: 'images/gallery_moulding_collection_1774335704157.png', caption: 'Premium Moulding Collection', cat: 'mouldings' },
    { src: 'images/gallery_wall_paneling_1774335748196.png', caption: 'Wood Wall Paneling', cat: 'interiors' },
    { src: 'images/gallery_workshop_craftsman_1774335580072.png', caption: 'Expert Craftsmanship', cat: 'shop' },
    { src: 'images/product_door_moulding_1774335102999.png', caption: 'Ornate Door Moulding', cat: 'frames' },
    { src: 'images/hero_wood_workshop_1774335072888.png', caption: 'K K Moulding Workshop', cat: 'shop' },
    { src: 'images/product_kitchen_wood_1774335136372.png', caption: 'Modular Kitchen Wood Work', cat: 'furniture' },
    { src: 'images/about_section_bg_1774335790756.png', caption: 'Premium Wood Grain Finish', cat: 'mouldings' },
];

function buildGalleryItem(data) {
    const div = document.createElement('div');
    div.className = 'gallery-item reveal-item';
    div.dataset.cat = data.cat || 'mouldings';
    if (data.fromAdmin) div.dataset.admin = '1';
    div.innerHTML = `<img src="${data.src}" alt="${data.caption}" loading="lazy"/><div class="gallery-caption">${data.caption}</div>`;
    div.addEventListener('click', () => {
        const allVis = document.querySelectorAll('.gallery-item:not(.hidden)');
        openLightboxFromItems(Array.from(allVis).indexOf(div));
    });
    return div;
}

function renderGallery(adminList) {
    const grid = document.getElementById('gallery-grid');
    if(!grid) return;
    grid.innerHTML = '';
    const all = [...adminList, ...FALLBACK_IMAGES];
    all.forEach(data => grid.appendChild(buildGalleryItem(data)));
    initFilterBtns();
    initReveal(); // Re-trigger reveal for new items
}

function startRealTimeGallery() {
    // Site is now static. Only fallback images will be shown.
    renderGallery([]);
}

function initFilterBtns() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.gallery-item').forEach(it => {
                if (filter === 'all' || it.dataset.cat === filter) it.classList.remove('hidden');
                else it.classList.add('hidden');
            });
        };
    });
}

/* CATALOGUE — REALTIME */
function startRealTimeCatalogue() {
    // Static site. No dynamic catalogues.
}

function formatBytes(b) { if(!b) return ''; if(b<1024) return b+' B'; if(b<1048576) return (b/1024).toFixed(1)+' KB'; return (b/1048576).toFixed(1)+' MB'; }

/* TESTIMONIALS SLIDER */
function initTestimonials() {
    const testiCards = document.querySelectorAll('.testi-card');
    const testiDots = document.getElementById('testi-dots');
    if(!testiCards.length || !testiDots) return;
    let currentTesti = 0;
    testiDots.innerHTML = '';
    testiCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => {
            testiCards[currentTesti].classList.remove('active');
            testiDots.children[currentTesti].classList.remove('active');
            currentTesti = i;
            testiCards[i].classList.add('active');
            testiDots.children[i].classList.add('active');
        };
        testiDots.appendChild(dot);
    });
    setInterval(() => {
        const next = (currentTesti + 1) % testiCards.length;
        if(testiDots.children[next]) testiDots.children[next].click();
    }, 5000);
}

/* LIGHTBOX */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-cap');
let currentLightboxIndex = 0;

function openLightboxFromItems(index) {
    const allVis = document.querySelectorAll('.gallery-item:not(.hidden)');
    const item = allVis[index];
    if (!item || !lightboxImg) return;
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-caption');
    lightboxImg.src = img.src;
    lightboxCap.textContent = cap ? cap.textContent : '';
    currentLightboxIndex = index;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

if(document.getElementById('lightbox-close')) document.getElementById('lightbox-close').onclick = () => { if(lightbox) lightbox.classList.remove('show'); document.body.style.overflow = ''; };
if(document.getElementById('lightbox-prev')) document.getElementById('lightbox-prev').onclick = () => {
    const allVis = document.querySelectorAll('.gallery-item:not(.hidden)');
    openLightboxFromItems((currentLightboxIndex - 1 + allVis.length) % allVis.length);
};
if(document.getElementById('lightbox-next')) document.getElementById('lightbox-next').onclick = () => {
    const allVis = document.querySelectorAll('.gallery-item:not(.hidden)');
    openLightboxFromItems((currentLightboxIndex + 1) % allVis.length);
};

/* PARTICLES */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 1;
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const dur = 10 + Math.random() * 15;
        p.style.cssText = `width:${size}px; height:${size}px; left:${left}%; bottom:-10px; animation-delay:${delay}s; animation-duration:${dur}s;`;
        container.appendChild(p);
    }
}

/* TILT */
function initTilt() {
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.onmousemove = (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            el.style.transform = `perspective(800px) rotateX(${(y-r.height/2)/r.height*-12}deg) rotateY(${(x-r.width/2)/r.width*12}deg) translateY(-8px)`;
        };
        el.onmouseleave = () => el.style.transform = 'none';
    });
}

/* FORM HANDLERS */

window.handleEnquiry = (e) => {
    e.preventDefault();
    const name = document.getElementById('enq-name').value;
    const phone = document.getElementById('enq-phone').value;
    const p = document.getElementById('enq-product').value;
    const m = document.getElementById('enq-msg').value;
    window.open(`https://wa.me/${PHONE}?text=Hello KK Moulding!%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Product:* ${p}%0A*Msg:* ${m}`, '_blank');
};

/* COUNTERS (ROBUST FIX) */
function initCounters() {
    const els = document.querySelectorAll('.counter-num');
    const animate = (el) => {
        if(el.classList.contains('animated')) return;
        el.classList.add('animated');
        const target = parseInt(el.dataset.target);
        if(isNaN(target)) return;
        
        let current = 0;
        const duration = 2000;
        const increment = Math.max(target / (duration / 20), 0.1); // Ensure progress
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + '+';
            }
        }, 20);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) animate(e.target); });
    }, { threshold: 0.1 });
    els.forEach(el => counterObserver.observe(el));
    
    // Quick failsafe for visible elements
    setTimeout(() => {
        els.forEach(el => {
            const r = el.getBoundingClientRect();
            if(r.top < window.innerHeight && r.bottom > 0) animate(el);
        });
    }, 1500);
}

/* ============================================================
   INIT EVERYTHING
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initCounters();
    initTilt();
    initTestimonials();
    startRealTimeGallery();
    startRealTimeCatalogue();
});

