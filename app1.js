/* ============================================================
   LUXE E-COMMERCE v2 — app.js
   Upgrades: Custom cursor · Magnetic hover · Cart toast ·
             Animated quantity changes · Shimmer add-to-cart ·
             Shipping progress bar · Modal qty selector ·
             Smooth item removal · GSAP polish
============================================================ */

"use strict";

/* ============================================================
   DATA
============================================================ */
const PRODUCTS = [
  { id:1,  name:"Obsidian Chronograph", category:"watches",     price:1290, originalPrice:null, rating:4.9, reviews:128, badge:"bestseller", featured:true,  image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",  description:"Precision Swiss movement encased in hand-polished obsidian-black ceramic. Water resistant to 200m. Sapphire crystal glass. A statement of quiet authority." },
  { id:2,  name:"Vellum Tote",          category:"bags",        price:740,  originalPrice:null, rating:4.7, reviews:84,  badge:"new",         featured:true,  image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",  description:"Full-grain vegetable-tanned leather. Blind-stitched seams. Aged brass hardware. This tote develops a rich patina unique to its owner — a living object." },
  { id:3,  name:"Lumière Parfum",       category:"fragrance",   price:380,  originalPrice:420,  rating:4.8, reviews:213, badge:"sale",        featured:false, image:"https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80",  description:"Top notes of Calabrian bergamot and black pepper. Heart of aged oud and iris. Base of white musk and ambergris. 50 ml hand-blown Murano glass flacon." },
  { id:4,  name:"Meridian Card Holder", category:"accessories", price:195,  originalPrice:null, rating:4.6, reviews:67,  badge:null,          featured:false, image:"https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",  description:"Six card slots and a central bill compartment. Slim Italian nappa leather, 4mm profile. Slip it in your breast pocket and feel the difference." },
  { id:5,  name:"Solstice Bracelet",    category:"accessories", price:520,  originalPrice:null, rating:4.5, reviews:42,  badge:"new",         featured:false, image:"coppertist-wu-CzUiSgSTowo-unsplash.jpg",  description:"Hand-forged 18k gold vermeil over sterling silver. Adjustable clasp. Each piece is unique — slight variations in texture confirm its artisanal origin." },
  { id:6,  name:"Glacier Field Watch",  category:"watches",     price:875,  originalPrice:950,  rating:4.7, reviews:99,  badge:"sale",        featured:true,  image:"https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80",  description:"Field-watch heritage meets modern minimalism. Scratch-resistant crystal, luminous indices, automatic winding. Built for anywhere — dressed for everywhere." },
  { id:7,  name:"Noir Crossbody",       category:"bags",        price:590,  originalPrice:null, rating:4.9, reviews:156, badge:"bestseller",  featured:false, image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&flip=h", description:"Compact, structured crossbody in butter-soft calfskin. Internal suede lining. Adjustable strap with gold D-ring detailing. Carries what you need. Nothing more." },
  { id:8,  name:"Amber Elixir",         category:"fragrance",   price:290,  originalPrice:null, rating:4.6, reviews:88,  badge:null,          featured:false, image:"puscas-adryan-77k9-nfxmhs-unsplash.jpg",  description:"A warm oriental accord — tonka bean, vanilla absolute, and sandalwood — wrapped in a luminous amber heart. Long-lasting. Deeply personal." },
  { id:9,  name:"Aurum Cufflinks",      category:"accessories", price:310,  originalPrice:null, rating:4.8, reviews:33,  badge:"new",         featured:false, image:"https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&q=80",  description:"Cast from recycled 18k gold. Geometric faceted face with onyx inlay. Presented in a hand-stitched Italian leather box." },
  { id:10, name:"Strata Messenger",     category:"bags",        price:860,  originalPrice:null, rating:4.7, reviews:61,  badge:null,          featured:false, image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",  description:"Double-layer waxed canvas shell with full-grain leather trim. Dedicated 16\" laptop sleeve. Magnetic closures, YKK zippers. For those who carry ideas." },
];

const TESTIMONIALS = [
  { quote:"The craftsmanship is extraordinary. I've owned luxury pieces from many houses, but LUXE operates at a completely different level of intentionality.", name:"Isabelle Fontaine", title:"Creative Director, Paris", avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80" },
  { quote:"Every single detail — the packaging, the texture, the weight — communicates that you're holding something genuinely rare. This is what luxury should feel like.", name:"Marcus Chen", title:"Architect, Singapore", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" },
  { quote:"I ordered the Obsidian Chronograph on a whim. Six months later it's the piece I reach for every single day. Timeless in the truest sense.", name:"Valentina Russo", title:"Entrepreneur, Milan", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80" },
  { quote:"Customer service matched the product quality — attentive, personal, never scripted. The entire LUXE experience is a breath of fresh air.", name:"James Hargrove", title:"Editor-at-Large, London", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80" },
];

/* ============================================================
   CART STATE
============================================================ */
let cart = JSON.parse(localStorage.getItem("luxe_cart_v2") || "[]");

function saveCart() { localStorage.setItem("luxe_cart_v2", JSON.stringify(cart)); }
function cartCount() { return cart.reduce((s,i) => s + i.qty, 0); }
function cartSubtotal() { return cart.reduce((s,i) => s + i.price * i.qty, 0); }
function cartTotalStr() {
  return `$${cartSubtotal().toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

/** Add item, animate button, show toast, update cart */
function addToCart(productId, fromBtn) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });

  saveCart();
  updateCartUI();
  animateCartIcon();
  showToast(product);

  // Flash the source button if provided
  if (fromBtn) flashAddBtn(fromBtn);
}

function removeFromCart(productId) {
  const item = document.querySelector(`.cart-item[data-id="${productId}"]`);
  if (item) {
    item.classList.add("removing");
    setTimeout(() => {
      cart = cart.filter(i => i.id !== productId);
      saveCart();
      updateCartUI();
    }, 420);
  } else {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
  }
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }

  // Animate qty value
  const valEl = document.querySelector(`.cart-item[data-id="${productId}"] .qty-value`);
  if (valEl) {
    valEl.classList.remove("tick");
    void valEl.offsetWidth;
    valEl.textContent = item.qty;
    valEl.classList.add("tick");
    setTimeout(() => valEl.classList.remove("tick"), 400);
  }

  // Update subtotal inline
  const subEl = document.querySelector(`.cart-item[data-id="${productId}"] .cart-item__subtotal`);
  if (subEl) subEl.textContent = `Subtotal: $${(item.price * item.qty).toLocaleString()}`;

  saveCart();
  updateCartBadgeAndTotal();
}

/* ── Cart icon wiggle ── */
function animateCartIcon() {
  const btn = document.getElementById("cartBtn");
  btn.classList.remove("wiggle");
  void btn.offsetWidth;
  btn.classList.add("wiggle");
  setTimeout(() => btn.classList.remove("wiggle"), 600);
}

/* ── Badge update ── */
function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  const count = cartCount();
  badge.textContent = count;

  if (count > 0) badge.classList.add("visible");
  else badge.classList.remove("visible");

  badge.classList.remove("pop");
  void badge.offsetWidth;
  badge.classList.add("pop");
}

/* ── Total update ── */
function updateCartTotal() {
  const el = document.getElementById("cartTotal");
  if (!el) return;
  el.classList.remove("updated");
  void el.offsetWidth;
  el.textContent = cartTotalStr();
  el.classList.add("updated");
  setTimeout(() => el.classList.remove("updated"), 600);

  // Update shipping progress
  updateShippingProgress();
}

function updateCartBadgeAndTotal() {
  updateCartBadge();
  updateCartTotal();
}

/* ── Full cart sync ── */
function updateCartUI() {
  updateCartBadge();
  updateCartTotal();
  renderCartItems();

  // Update header count label
  const label = document.getElementById("cartHeaderMeta");
  if (label) label.textContent = cartCount() === 0 ? "Empty" : `${cartCount()} item${cartCount() !== 1 ? "s" : ""}`;
}

/* ── Shipping progress ── */
const FREE_SHIPPING_THRESHOLD = 1000;

function updateShippingProgress() {
  const wrap = document.getElementById("shippingProgressWrap");
  if (!wrap) return;
  const subtotal = cartSubtotal();
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  document.getElementById("shippingBarFill").style.width = pct + "%";

  const labelEl = document.getElementById("shippingLabel");
  if (remaining <= 0) {
    labelEl.innerHTML = `<span>🎉 Free shipping unlocked!</span>`;
  } else {
    labelEl.innerHTML = `<span>Free shipping on orders over $1,000</span><em>$${remaining.toLocaleString()} away</em>`;
  }
}

/* ── Flash add button ── */
function flashAddBtn(btn) {
  const original = btn.innerHTML;
  btn.classList.add("added");
  btn.innerHTML = "✓";
  setTimeout(() => {
    btn.classList.remove("added");
    btn.innerHTML = original;
  }, 1000);
}

/* ============================================================
   CART ITEMS RENDER
============================================================ */
function renderCartItems() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item adding" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="cart-item__img" loading="lazy" />
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__unit-price">$${item.price.toLocaleString()}</p>
        <p class="cart-item__subtotal">Subtotal: $${(item.price * item.qty).toLocaleString()}</p>
      </div>
      <div class="cart-item__qty">
        <div class="qty-stepper">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)"  aria-label="Increase">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  `).join("");

  // Remove the 'adding' class after animation plays
  setTimeout(() => {
    document.querySelectorAll(".cart-item.adding").forEach(el => el.classList.remove("adding"));
  }, 500);
}

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
let toastTimeout;

function showToast(product) {
  let toast = document.getElementById("cartToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cartToast";
    toast.className = "cart-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="cart-toast__check">✓</div>
    <div class="cart-toast__text">
      <p class="cart-toast__label">Added to cart</p>
      <p class="cart-toast__name">${product.name}</p>
    </div>
  `;

  clearTimeout(toastTimeout);
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ============================================================
   STARS HTML
============================================================ */
function starsHTML(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star ${i < Math.round(rating) ? "filled" : ""}">★</span>`
  ).join("") + `<span class="rating-count">(${Math.round(rating * 10) / 10})</span>`;
}

/* ============================================================
   PRODUCT CARDS RENDER
============================================================ */
function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");

  if (list.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  grid.innerHTML = list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__img-wrap">
        ${p.badge ? `<span class="product-badge product-badge--${p.badge}">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <!-- Quick-action overlay -->
        <div class="product-card__actions">
          <button class="action-btn action-btn--cart quick-add" data-id="${p.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Add to Cart
          </button>
          <button class="action-btn action-btn--view quick-view" data-id="${p.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View
          </button>
        </div>
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${p.category}</p>
        <h3 class="product-card__name">${p.name}</h3>
        <div class="stars">${starsHTML(p.rating)}</div>
        <div class="product-card__footer">
          <div>
            <span class="product-card__price">$${p.price.toLocaleString()}</span>
            ${p.originalPrice ? `<span class="product-card__price-original">$${p.originalPrice.toLocaleString()}</span>` : ""}
          </div>
          <button class="add-to-cart-btn circle-add" data-id="${p.id}" aria-label="Add to cart">+</button>
        </div>
      </div>
    </article>
  `).join("");

  // Wire up click handlers
  grid.querySelectorAll(".product-card").forEach(card => {
    const id = Number(card.dataset.id);

    // Open modal on card click (not on action buttons)
    card.addEventListener("click", e => {
      if (!e.target.closest(".product-card__actions") && !e.target.closest(".add-to-cart-btn")) {
        openModal(id);
      }
    });
  });

  // Quick-add buttons in overlay
  grid.querySelectorAll(".quick-add").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id), btn);
    });
  });

  // Quick-view buttons
  grid.querySelectorAll(".quick-view").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      openModal(Number(btn.dataset.id));
    });
  });

  // Circle +  buttons
  grid.querySelectorAll(".circle-add").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id), btn);
    });
  });

  animateCards();
}

/* ============================================================
   FEATURED
============================================================ */
function renderFeatured() {
  const featured = PRODUCTS.filter(p => p.featured);
  const grid = document.getElementById("featuredGrid");

  grid.innerHTML = featured.map(p => `
    <div class="featured-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="featured-card__overlay">
        <p class="featured-card__tag">${p.category}</p>
        <h3 class="featured-card__name">${p.name}</h3>
        <p class="featured-card__price">From $${p.price.toLocaleString()}</p>
        <button class="btn btn--primary btn--sm featured-card__btn feat-add" data-id="${p.id}">
          <span>Add to Cart</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".featured-card").forEach(card => {
    card.addEventListener("click", e => {
      if (!e.target.closest(".btn")) openModal(Number(card.dataset.id));
    });
  });

  grid.querySelectorAll(".feat-add").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.id), btn);
    });
  });
}

/* ============================================================
   FILTERING
============================================================ */
let activeCategory = "all";
let maxPrice = 2000;
let searchQuery = "";

function getFiltered() {
  return PRODUCTS.filter(p => {
    const catOk   = activeCategory === "all" || p.category === activeCategory;
    const priceOk = p.price <= maxPrice;
    const searchOk = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return catOk && priceOk && searchOk;
  });
}

function applyFilters() { renderProducts(getFiltered()); }

function initFilters() {
  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.cat;
      applyFilters();
    });
  });

  const range = document.getElementById("priceRange");
  const rangeVal = document.getElementById("priceVal");

  range.addEventListener("input", () => {
    maxPrice = Number(range.value);
    rangeVal.textContent = `$${maxPrice.toLocaleString()}`;
    // Update range track fill via JS (CSS gradient)
    const pct = ((maxPrice - 50) / (2000 - 50)) * 100;
    range.style.background = `linear-gradient(to right, var(--gold-dk) 0%, var(--gold-dk) ${pct}%, var(--bg-4) ${pct}%, var(--bg-4) 100%)`;
    applyFilters();
  });

  document.getElementById("searchInput").addEventListener("input", e => {
    searchQuery = e.target.value;
    applyFilters();
  });
}

/* ============================================================
   MODAL — with quantity selector
============================================================ */
let modalQty = 1;

function openModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  modalQty = 1;

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-img-wrap">
      <img src="${p.image}" alt="${p.name}" />
    </div>
    <div class="modal-details">
      <p class="modal-cat">${p.category}</p>
      <h2 class="modal-name">${p.name}</h2>
      <div class="stars modal-stars">${starsHTML(p.rating)}</div>
      <p class="modal-desc">${p.description}</p>
      <p class="modal-price">$${p.price.toLocaleString()}</p>
      <div class="modal-actions">
        <div class="modal-qty">
          <button class="qty-btn" id="mqMinus">−</button>
          <span class="qty-value" id="mqVal">1</span>
          <button class="qty-btn" id="mqPlus">+</button>
        </div>
        <button class="btn btn--primary modal-add-btn" data-id="${p.id}">
          <span>Add to Cart</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  `;

  // Wire modal qty
  document.getElementById("mqMinus").addEventListener("click", () => {
    if (modalQty > 1) { modalQty--; document.getElementById("mqVal").textContent = modalQty; }
  });

  document.getElementById("mqPlus").addEventListener("click", () => {
    modalQty++;
    document.getElementById("mqVal").textContent = modalQty;
  });

  document.querySelector(".modal-add-btn").addEventListener("click", function() {
    for (let i = 0; i < modalQty; i++) addToCart(p.id);
    flashAddBtn(this);
    setTimeout(closeModal, 600);
  });

  document.getElementById("modalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

function initModal() {
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modalOverlay")) closeModal();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModal(); closeCart(); } });
}

/* ============================================================
   CART SIDEBAR
============================================================ */
function openCart() {
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
  updateShippingProgress();
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

function initCart() {
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    // Checkout animation
    const btn = document.getElementById("checkoutBtn");
    btn.innerHTML = "Processing…";
    btn.style.pointerEvents = "none";

    setTimeout(() => {
      alert("🛍 Thank you for your order! (Demo checkout)");
      cart = [];
      saveCart();
      updateCartUI();
      closeCart();
      btn.innerHTML = '<span>Checkout</span>';
      btn.style.pointerEvents = "";
    }, 1200);
  });

  updateCartUI();
}

/* ============================================================
   TESTIMONIALS SLIDER
============================================================ */
let currentSlide = 0;
let sliderTimer;

function initTestimonials() {
  const track = document.getElementById("testimonialsTrack");
  const dots = document.getElementById("sliderDots");

  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <p class="testimonial-quote">${t.quote}</p>
      <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" loading="lazy" />
      <p class="testimonial-name">${t.name}</p>
      <p class="testimonial-title">${t.title}</p>
    </div>
  `).join("");

  dots.innerHTML = TESTIMONIALS.map((_, i) =>
    `<button class="slider-dot ${i === 0 ? "active" : ""}" data-i="${i}"></button>`
  ).join("");

  dots.querySelectorAll(".slider-dot").forEach(dot => {
    dot.addEventListener("click", () => goToSlide(Number(dot.dataset.i)));
  });

  sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % TESTIMONIALS.length), 5500);
}

function goToSlide(index) {
  currentSlide = index;
  document.getElementById("testimonialsTrack").style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll(".slider-dot").forEach((d, i) => d.classList.toggle("active", i === index));
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide((currentSlide + 1) % TESTIMONIALS.length), 5500);
}

/* ============================================================
   NEWSLETTER
============================================================ */
function initNewsletter() {
  const btn = document.getElementById("subscribeBtn");
  const input = document.getElementById("emailInput");
  const note = document.getElementById("newsletterNote");

  btn.addEventListener("click", () => {
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = "↑ Please enter a valid email address.";
      note.style.color = "#d95f5f";
      input.style.borderColor = "#d95f5f";
      return;
    }
    input.style.borderColor = "";
    note.textContent = "✓ You're on the list. Watch your inbox.";
    note.style.color = "var(--gold)";
    input.value = "";

    // Button confirm animation
    const span = btn.querySelector("span");
    const original = span.textContent;
    span.textContent = "Subscribed!";
    setTimeout(() => span.textContent = original, 3000);
  });

  input.addEventListener("input", () => {
    if (input.style.borderColor) input.style.borderColor = "";
  });
}

/* ============================================================
   NAVIGATION
============================================================ */
function initNav() {
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  const burger = document.getElementById("burger");
  const links  = document.querySelector(".nav__links");
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    links.classList.toggle("open");
  });
}

/* ============================================================
   CUSTOM CURSOR
============================================================ */
function initCursor() {
  // Not on touch devices
  if (!window.matchMedia("(hover: hover)").matches) return;

  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  // Dot follows immediately
  document.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  // Ring lags behind with lerp
  function lerpRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(lerpRing);
  }

  lerpRing();

  // Hover state on interactive elements
  document.addEventListener("mouseover", e => {
    if (e.target.closest("a, button, .product-card, .featured-card, .filter-pill, input")) {
      document.body.classList.add("cursor-hover");
    }
  });

  document.addEventListener("mouseout", e => {
    if (e.target.closest("a, button, .product-card, .featured-card, .filter-pill, input")) {
      document.body.classList.remove("cursor-hover");
    }
  });

  document.addEventListener("mousedown", () => document.body.classList.add("cursor-click"));
  document.addEventListener("mouseup",   () => document.body.classList.remove("cursor-click"));
}

/* ============================================================
   HERO CANVAS
============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.22,
      dy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.45 + 0.1,
    };
  }

  function init() { resize(); particles = Array.from({ length: 90 }, makeParticle); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${p.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,169,110,${0.065 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize, { passive: true });
  init(); draw();
}

/* ============================================================
   GSAP ANIMATIONS
============================================================ */
function initGSAP() {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance */
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.8, delay: 0.4 })
    .to(".hero__headline .line", { opacity: 1, y: 0, duration: 1, stagger: 0.18 }, "-=0.35")
    .to(".hero__sub",            { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
    .to(".hero__content .btn",   { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
    .to(".hero__scroll-hint",    { opacity: 1, duration: 0.6 }, "-=0.2");

  /* Section headers */
  gsap.utils.toArray(".section-header").forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      opacity: 0, y: 36, duration: 0.85, ease: "power3.out",
    });
  });

  /* Featured cards — staggered wave */
  gsap.utils.toArray(".featured-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 90%" },
      opacity: 0, y: 55, duration: 0.85, ease: "power3.out", delay: i * 0.13,
    });
  });

  /* Testimonials */
  gsap.from(".testimonials-slider", {
    scrollTrigger: { trigger: ".testimonials-section", start: "top 82%" },
    opacity: 0, y: 40, duration: 0.9, ease: "power3.out",
  });

  /* Newsletter */
  gsap.from(".newsletter-glass", {
    scrollTrigger: { trigger: ".newsletter-section", start: "top 80%" },
    opacity: 0, y: 50, scale: 0.97, duration: 1, ease: "power3.out",
  });

  /* Filter bar */
  gsap.from(".filter-bar", {
    scrollTrigger: { trigger: ".filter-bar", start: "top 90%" },
    opacity: 0, y: 20, duration: 0.7, ease: "power3.out",
  });
}

/** Staggered card reveal after every filter/search */
function animateCards() {
  if (typeof gsap === "undefined") {
    document.querySelectorAll(".product-card").forEach(c => { c.style.opacity = "1"; c.style.transform = "none"; });
    return;
  }

  gsap.to(".product-card", {
    opacity: 1, y: 0,
    duration: 0.6, stagger: 0.07,
    ease: "power3.out",
    clearProps: "transform",
  });
}

/* ============================================================
   HTML INJECTION — cursor elements + cart sidebar upgrades
============================================================ */
function injectDOM() {
  // Cursor elements
  document.body.insertAdjacentHTML("afterbegin", `
    <div id="cursor-dot"></div>
    <div id="cursor-ring"></div>
  `);

  // Upgrade cart sidebar header
  const header = document.querySelector(".cart-sidebar__header");
  if (header) {
    const h3 = header.querySelector("h3");
    h3.insertAdjacentHTML("afterend", `<p class="cart-header-meta" id="cartHeaderMeta">Empty</p>`);
  }

  // Inject shipping progress bar into cart footer (before total)
  const footer = document.querySelector(".cart-sidebar__footer");
  if (footer) {
    footer.insertAdjacentHTML("afterbegin", `
      <div class="shipping-progress-wrap" id="shippingProgressWrap">
        <div class="shipping-label" id="shippingLabel">
          <span>Free shipping on orders over $1,000</span>
          <em>$1,000 away</em>
        </div>
        <div class="shipping-bar">
          <div class="shipping-bar-fill" id="shippingBarFill" style="width:0%"></div>
        </div>
      </div>
    `);
  }

  // Upgrade cart total element to add animated class + wrap
  const totalSpan = document.getElementById("cartTotal");
  if (totalSpan) {
    totalSpan.id = "";
    totalSpan.className = "cart-total-amount";
    totalSpan.insertAdjacentHTML("beforebegin", `<span class="cart-total-label">Total</span>`);
    totalSpan.id = "cartTotal";
  }

  // Wrap checkout button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    const wrapper = document.createElement("div");
    wrapper.className = "checkout-btn-wrap";
    checkoutBtn.parentNode.insertBefore(wrapper, checkoutBtn);
    wrapper.appendChild(checkoutBtn);
  }
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  injectDOM();

  renderProducts(PRODUCTS);
  renderFeatured();
  initTestimonials();

  initFilters();
  initModal();
  initCart();
  initNewsletter();
  initNav();
  initCursor();
  initHeroCanvas();
  initGSAP();
});
