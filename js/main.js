/**
 * LCG — Las Cosas Que Me Gustan
 * Comportamiento compartido de todo el sitio.
 */
(function () {
  const WHATSAPP_NUMBER = "5491156983539"; // +54 9 11 5698-3539

  /* ---------- Header sticky con sombra al hacer scroll ---------- */
  const header = document.querySelector("[data-site-header]");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menú móvil ---------- */
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-mobile-menu-open]")) {
      mobileMenu?.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    if (e.target.closest("[data-mobile-menu-close]") || e.target.closest("[data-mobile-menu-backdrop]")) {
      mobileMenu?.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  /* ---------- Buscador móvil (mostrar/ocultar) ---------- */
  const searchToggle = document.querySelector("[data-search-toggle]");
  const searchMobile = document.querySelector("[data-search-mobile]");
  if (searchToggle && searchMobile) {
    searchToggle.addEventListener("click", () => {
      const isHidden = searchMobile.style.display === "none";
      searchMobile.style.display = isHidden ? "block" : "none";
      if (isHidden) searchMobile.querySelector("input")?.focus();
    });
  }

  /* ---------- WhatsApp flotante con mensajes contextuales ---------- */
  const waFloat = document.querySelector("[data-wa-float]");
  const waMenu = document.querySelector("[data-wa-menu]");
  if (waFloat && waMenu) {
    waFloat.addEventListener("click", () => waMenu.classList.toggle("is-open"));
    document.addEventListener("click", (e) => {
      if (!waMenu.contains(e.target) && !waFloat.contains(e.target)) waMenu.classList.remove("is-open");
    });

    const pageTitle = document.title.split("|")[0].trim();
    const pageUrl = window.location.href;
    const messages = {
      consulta: `Hola! Quiero consultar por este producto: ${pageTitle} (${pageUrl})`,
      personalizar: `Hola! Quiero personalizar este diseño: ${pageTitle} (${pageUrl})`,
      pedido: `Hola! Necesito ayuda con mi pedido.`,
      cotizar: `Hola! Quiero cotizar una cantidad diferente para: ${pageTitle} (${pageUrl})`,
    };
    waMenu.querySelectorAll("[data-wa-msg]").forEach((link) => {
      const key = link.getAttribute("data-wa-msg");
      const text = encodeURIComponent(messages[key] || "Hola! Quiero hacer una consulta.");
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    });
  }
  // Botones puntuales "Consultar por WhatsApp" en fichas de producto
  document.querySelectorAll("[data-wa-quick]").forEach((btn) => {
    const pageTitle = document.title.split("|")[0].trim();
    const text = encodeURIComponent(`Hola! Quiero consultar por este producto: ${pageTitle} (${window.location.href})`);
    btn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  });

  /* ---------- Newsletter — popup con retraso / intención de salida ---------- */
  const popup = document.querySelector("[data-newsletter-popup]");
  if (popup) {
    const DISMISSED_KEY = "lcg_newsletter_dismissed";
    let shown = sessionStorage.getItem(DISMISSED_KEY) === "1";

    const show = () => {
      if (shown) return;
      popup.classList.add("is-open");
      shown = true;
      sessionStorage.setItem(DISMISSED_KEY, "1");
    };

    // Se activa a los 15s como mínimo...
    const delayTimer = setTimeout(show, 15000);

    // ...o al detectar intención de salida (mouse hacia la barra superior del navegador)
    document.addEventListener("mouseleave", (e) => {
      if (e.clientY <= 0) show();
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-newsletter-close]") || e.target.closest("[data-newsletter-backdrop]")) {
        popup.classList.remove("is-open");
        clearTimeout(delayTimer);
      }
    });
  }

  /* ---------- Acordeón (FAQ de producto) ---------- */
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-accordion-trigger]");
    if (!trigger) return;
    const item = trigger.closest(".accordion-item");
    const wasOpen = item.classList.contains("is-open");
    item.parentElement.querySelectorAll(".accordion-item").forEach((i) => i.classList.remove("is-open"));
    if (!wasOpen) item.classList.add("is-open");
    trigger.setAttribute("aria-expanded", String(!wasOpen));
  });

  /* ---------- Favoritos (localStorage simple) ---------- */
  document.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav-toggle]");
    if (!favBtn) return;
    const pressed = favBtn.getAttribute("aria-pressed") === "true";
    favBtn.setAttribute("aria-pressed", String(!pressed));
  });

  /* ---------- Selector de variantes (swatches) en tarjetas y ficha ---------- */
  document.addEventListener("click", (e) => {
    const swatch = e.target.closest("[data-swatch]");
    if (!swatch) return;
    const group = swatch.closest("[data-swatch-group]");
    group.querySelectorAll("[data-swatch]").forEach((s) => s.setAttribute("aria-pressed", "false"));
    swatch.setAttribute("aria-pressed", "true");
    const selectedEl = group.parentElement.querySelector("[data-selected-variant]");
    if (selectedEl) selectedEl.setAttribute("data-value", swatch.getAttribute("data-swatch"));
  });

  /* ---------- Steppers de cantidad (previos al agregar al carrito) ---------- */
  document.addEventListener("click", (e) => {
    const step = e.target.closest("[data-step]");
    if (!step) return;
    const target = document.querySelector(step.getAttribute("data-step-target"));
    if (!target) return;
    const min = parseInt(target.min || "1", 10);
    let val = parseInt(target.value, 10) || min;
    val = step.getAttribute("data-step") === "plus" ? val + 1 : Math.max(min, val - 1);
    target.value = val;
  });

  /* ---------- Galería de producto: miniaturas ---------- */
  document.addEventListener("click", (e) => {
    const thumb = e.target.closest("[data-gallery-thumb]");
    if (!thumb) return;
    const wrap = thumb.closest("[data-gallery]");
    wrap.querySelectorAll("[data-gallery-thumb]").forEach((t) => t.setAttribute("aria-current", "false"));
    thumb.setAttribute("aria-current", "true");
    const main = wrap.querySelector("[data-gallery-main]");
    const src = thumb.getAttribute("data-src");
    if (main && src) {
      const alt = thumb.querySelector("img")?.alt || "";
      main.innerHTML = `<img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;">`;
    } else if (main) {
      main.textContent = thumb.textContent;
    }
  });

  /* ---------- Filtros — panel móvil en categoría ---------- */
  const filtersDrawer = document.querySelector("[data-filters-drawer]");
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-filters-open]")) {
      filtersDrawer?.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    if (e.target.closest("[data-filters-close]") || e.target.closest("[data-filters-backdrop]")) {
      filtersDrawer?.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  /* ---------- Barra fija de compra en ficha de producto (móvil) ---------- */
  const stickyBar = document.querySelector("[data-sticky-buy]");
  const buyAnchor = document.querySelector("[data-buy-anchor]");
  if (stickyBar && buyAnchor) {
    const observer = new IntersectionObserver(
      ([entry]) => stickyBar.classList.toggle("is-visible", !entry.isIntersecting),
      { rootMargin: "-40% 0px 0px 0px" }
    );
    observer.observe(buyAnchor);
  }

  /* ---------- Validación de formulario de personalización ---------- */
  document.querySelectorAll("[data-custom-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      let valid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        const field = input.closest(".field");
        if (!input.value.trim()) {
          valid = false;
          field?.classList.add("has-error");
        } else {
          field?.classList.remove("has-error");
        }
      });
      if (!valid) e.preventDefault();
    });
  });

  /* ---------- Selección de medio de pago en checkout ---------- */
  document.querySelectorAll("[data-payment-option]").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll("[data-payment-option]").forEach((o) => o.classList.remove("is-selected"));
      opt.classList.add("is-selected");
      opt.querySelector('input[type="radio"]').checked = true;
      const transferNote = document.querySelector("[data-transfer-note]");
      if (transferNote) {
        transferNote.style.display = opt.getAttribute("data-payment-option") === "transferencia" ? "block" : "none";
      }
    });
  });
})();
