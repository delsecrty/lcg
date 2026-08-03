/**
 * LCG — Las Cosas Que Me Gustan
 * Carrito persistente (localStorage) + drawer lateral.
 * Se incluye en todas las páginas. Requiere products-data.js cargado antes.
 */
(function () {
  const STORAGE_KEY = "lcg_cart_v1";
  const TRANSFER_DISCOUNT = 0.1; // 10% off pagando por transferencia
  const SHIPPING_FLAT = 2500; // envío estimado de referencia (se recalcula en checkout)
  const FREE_SHIPPING_FROM = 25000;

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderCart();
    updateCartCount();
  }

  function findProduct(id) {
    // Nota: LCG_PRODUCTS se declara con "const" en products-data.js, así que no
    // cuelga de window (solo var/function lo hacen) — hay que referenciarlo así,
    // apoyándose en que ambos scripts comparten el mismo scope global de módulo clásico.
    return (typeof LCG_PRODUCTS !== "undefined" ? LCG_PRODUCTS : []).find((p) => p.id === id);
  }

  function addToCart(productId, qty, variant) {
    qty = qty || 1;
    const items = readCart();
    const existing = items.find((i) => i.id === productId && i.variant === (variant || ""));
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty: qty, variant: variant || "" });
    }
    writeCart(items);
    openCartDrawer();
  }

  function updateQty(productId, variant, qty) {
    let items = readCart();
    items = items
      .map((i) => (i.id === productId && i.variant === (variant || "") ? { ...i, qty: Math.max(1, qty) } : i))
      .filter((i) => i.qty > 0);
    writeCart(items);
  }

  function removeFromCart(productId, variant) {
    let items = readCart().filter((i) => !(i.id === productId && i.variant === (variant || "")));
    writeCart(items);
  }

  function cartTotals() {
    const items = readCart();
    let subtotal = 0;
    items.forEach((i) => {
      const p = findProduct(i.id);
      if (p) subtotal += p.price * i.qty;
    });
    const transferTotal = Math.round(subtotal * (1 - TRANSFER_DISCOUNT));
    const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
    return { subtotal, transferTotal, shipping, count: items.reduce((a, i) => a + i.qty, 0) };
  }

  function updateCartCount() {
    const { count } = cartTotals();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = String(count);
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  function renderCart() {
    const container = document.querySelector("[data-cart-items]");
    if (!container) return;
    const items = readCart();
    const emptyEl = document.querySelector("[data-cart-empty]");
    const footEl = document.querySelector("[data-cart-foot]");

    if (items.length === 0) {
      container.innerHTML = "";
      if (emptyEl) emptyEl.style.display = "block";
      if (footEl) footEl.style.display = "none";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";
    if (footEl) footEl.style.display = "flex";

    container.innerHTML = items
      .map((i) => {
        const p = findProduct(i.id);
        if (!p) return "";
        return `
        <div class="cart-item">
          <div class="cart-item__img"><div class="ph-photo" aria-hidden="true">Foto</div></div>
          <div>
            <p class="cart-item__name">${p.name}</p>
            ${i.variant ? `<p class="cart-item__variant">Variante: ${i.variant}</p>` : ""}
            <div class="qty-stepper" style="margin-top:8px;">
              <button type="button" aria-label="Restar unidad" data-qty-minus="${p.id}" data-variant="${i.variant}">−</button>
              <input type="text" inputmode="numeric" value="${i.qty}" aria-label="Cantidad" data-qty-input="${p.id}" data-variant="${i.variant}" readonly>
              <button type="button" aria-label="Sumar unidad" data-qty-plus="${p.id}" data-variant="${i.variant}">+</button>
            </div>
            <p class="cart-item__price">${lcgFormatARS(p.price * i.qty)}</p>
            <button type="button" class="cart-item__remove" data-remove="${p.id}" data-variant="${i.variant}">Quitar</button>
          </div>
        </div>`;
      })
      .join("");

    const totals = cartTotals();
    const subtotalEl = document.querySelector("[data-cart-subtotal]");
    const shippingEl = document.querySelector("[data-cart-shipping]");
    const transferEl = document.querySelector("[data-cart-transfer]");
    if (subtotalEl) subtotalEl.textContent = lcgFormatARS(totals.subtotal);
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? "Gratis" : lcgFormatARS(totals.shipping);
    if (transferEl) transferEl.textContent = lcgFormatARS(totals.transferTotal + totals.shipping);
  }

  function openCartDrawer() {
    const drawer = document.querySelector("[data-cart-drawer]");
    if (drawer) {
      drawer.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }
  function closeCartDrawer() {
    const drawer = document.querySelector("[data-cart-drawer]");
    if (drawer) {
      drawer.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.getAttribute("data-add-to-cart");
      const qtyInput = document.querySelector(`[data-product-qty="${id}"]`);
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      const variantEl = document.querySelector(`[data-selected-variant="${id}"]`);
      addToCart(id, qty, variantEl ? variantEl.getAttribute("data-value") : "");
    }
    const openBtn = e.target.closest("[data-cart-open]");
    if (openBtn) {
      e.preventDefault();
      openCartDrawer();
    }
    const closeBtn = e.target.closest("[data-cart-close]");
    if (closeBtn) {
      e.preventDefault();
      closeCartDrawer();
    }
    const backdrop = e.target.closest("[data-cart-backdrop]");
    if (backdrop) closeCartDrawer();

    const minus = e.target.closest("[data-qty-minus]");
    if (minus) {
      const id = minus.getAttribute("data-qty-minus");
      const variant = minus.getAttribute("data-variant") || "";
      const items = readCart();
      const item = items.find((i) => i.id === id && i.variant === variant);
      if (item) updateQty(id, variant, item.qty - 1);
    }
    const plus = e.target.closest("[data-qty-plus]");
    if (plus) {
      const id = plus.getAttribute("data-qty-plus");
      const variant = plus.getAttribute("data-variant") || "";
      const items = readCart();
      const item = items.find((i) => i.id === id && i.variant === variant);
      if (item) updateQty(id, variant, item.qty + 1);
    }
    const remove = e.target.closest("[data-remove]");
    if (remove) {
      removeFromCart(remove.getAttribute("data-remove"), remove.getAttribute("data-variant") || "");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCartDrawer();
  });

  // Exponer utilidades globalmente
  window.LCGCart = { addToCart, cartTotals, readCart, openCartDrawer, closeCartDrawer };

  document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    updateCartCount();
  });
})();
