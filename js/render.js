/**
 * LCG — Las Cosas Que Me Gustan
 * Render de tarjetas de producto a partir de products-data.js
 * Mantiene los datos separados del HTML/plantilla.
 */
const LCG_BADGE_LABELS = {
  new: '<span class="badge badge-new">Nuevo</span>',
  custom: '<span class="badge badge-custom">Personalizable</span>',
  last_units: '<span class="badge badge-lastunits">Últimas unidades</span>',
  offer: '<span class="badge badge-offer">Oferta</span>',
  most_picked: '<span class="badge tag-most-picked">Más elegido</span>',
};

function lcgRenderBadges(product) {
  const badges = [...(product.badges || [])];
  if (product.stock === "last_units" && !badges.includes("last_units")) badges.push("last_units");
  return badges.map((b) => LCG_BADGE_LABELS[b] || "").join("");
}

function lcgRenderSwatches(product) {
  if (!product.swatches || product.swatches.length < 2) return "";
  return `<div class="product-card__variants" data-swatch-group aria-label="Colores disponibles">
    ${product.swatches
      .map(
        (c, idx) =>
          `<button type="button" class="swatch" style="background:${c}" data-swatch="${c}" aria-pressed="${idx === 0}" aria-label="Color ${idx + 1}"></button>`
      )
      .join("")}
  </div>`;
}

function lcgRenderProductMedia(product) {
  const images = product.images || [];
  if (!images.length) {
    return `<div class="ph-photo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        Foto de producto
      </div>`;
  }
  const main = `<img src="${images[0]}" alt="${product.name}" loading="lazy" width="400" height="400">`;
  const alt = images[1] ? `<img class="img-alt" src="${images[1]}" alt="${product.name} – foto adicional" loading="lazy" width="400" height="400">` : "";
  return main + alt;
}

function lcgRenderProductCard(product) {
  const priceBlock = product.priceOnRequest
    ? `<div class="product-card__prices"><span class="product-card__price product-card__price--onrequest">Consultar precio</span></div>`
    : `<div class="product-card__prices">
        <span class="product-card__price">${lcgFormatARS(product.price)}</span>
      </div>`;
  const actionBlock = product.priceOnRequest
    ? `<div class="product-card__actions">
        <a href="https://wa.me/5491156983539?text=${encodeURIComponent('Hola! Quiero consultar precio y disponibilidad de: ' + product.name)}" class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener">Consultar</a>
      </div>`
    : `<div class="product-card__actions">
        <button type="button" class="btn btn-primary btn-sm" data-add-to-cart="${product.id}" data-selected-variant="${product.id}">Agregar</button>
      </div>`;
  return `
  <article class="product-card">
    <a href="producto.html?id=${product.id}" class="product-card__link-full" aria-label="Ver ${product.name}"></a>
    <div class="product-card__media">
      ${lcgRenderProductMedia(product)}
      <div class="product-card__badges">${lcgRenderBadges(product)}</div>
      <button type="button" class="product-card__fav" data-fav-toggle aria-pressed="false" aria-label="Guardar ${product.name} en favoritos">♥</button>
    </div>
    <div class="product-card__body">
      <p class="product-card__cat">${product.categoryLabel}</p>
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__pack">${product.pack}</p>
      ${priceBlock}
      ${lcgRenderSwatches(product)}
      ${actionBlock}
    </div>
  </article>`;
}

function lcgRenderProductGrid(containerSelector, products) {
  const el = document.querySelector(containerSelector);
  if (!el) return;
  el.innerHTML = products.map(lcgRenderProductCard).join("");
}

function lcgRenderCategoryCard(cat) {
  const media = cat.image
    ? `<img src="${cat.image}" alt="${cat.label}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
    : `<div class="ph-photo" aria-hidden="true" style="background:none;">
        <svg viewBox="0 0 24 24" width="40" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2l2.6 6.6L22 10l-5.4 4.6L18 22l-6-3.6L6 22l1.4-7.4L2 10l7.4-1.4L12 2z"/></svg>
      </div>`;
  return `
  <a class="cat-card" href="categoria.html?cat=${cat.slug}">
    <div class="cat-card__img alt-${cat.colorClass}">
      ${media}
    </div>
    <div class="cat-card__body">
      <h3 class="cat-card__title">${cat.label}</h3>
      <p class="cat-card__desc">${cat.desc}</p>
      <span class="cat-card__link">Ver categoría →</span>
    </div>
  </a>`;
}

function lcgRenderCategoryGrid(containerSelector, cats) {
  const el = document.querySelector(containerSelector);
  if (!el) return;
  el.innerHTML = cats.map(lcgRenderCategoryCard).join("");
}
