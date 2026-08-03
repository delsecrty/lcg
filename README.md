# LCG – Las Cosas Que Me Gustan · Tienda online

Sitio estático (HTML + CSS + JavaScript vanilla) listo para subir a cualquier hosting. No requiere Node, build ni frameworks — se sube tal cual por FTP o a un panel de hosting.

## 1. Mapa del sitio

```
/index.html                     Inicio
/categoria.html                 Catálogo (todas las categorías, vía ?cat=, ?filter=, ?q=)
  ?cat=stickers
  ?cat=tags
  ?cat=tarjetas
  ?cat=etiquetas
  ?cat=toppers
  ?cat=papeleria-emprendimientos
  ?cat=papeleria-reposteria
  ?cat=cumpleanos
  ?cat=colecciones
  ?filter=nuevo                 Novedades
  ?filter=ofertas               Ofertas
/producto.html?id=<sku>         Ficha de producto (una plantilla, datos por query string)
/checkout.html                  Checkout (noindex)
/como-comprar.html              Cómo comprar + #personalizar #produccion #envios #cambios
/preguntas-frecuentes.html      FAQ (con FAQPage JSON-LD)
/contacto.html                  Contacto
/robots.txt
/sitemap.xml
/css/styles.css                 Sistema de diseño completo
/js/products-data.js            Catálogo REAL (cargado desde WhatsApp Business el 31/07/2026)
/js/render.js                   Renderizado de tarjetas de producto/categoría desde los datos
/js/cart.js                     Carrito persistente (localStorage) + drawer lateral
/js/main.js                     Header, menú, marquee, WhatsApp, popup, acordeón, filtros, etc.
/assets/productos/              Fotos reales de producto (extraídas del catálogo de WhatsApp Business)
```

Páginas pendientes de definir según cómo factures/gestiones cuentas: `/cuenta.html` (login/registro) está enlazada desde el header pero no incluida — normalmente se resuelve con el sistema de cuentas del proveedor de pago o un backend simple.

## 2. Sistema de diseño

**Paleta** (variables CSS en `css/styles.css`): fondo crema `#FFFBF5`, rosa institucional `#F8C4D9` (fondos, degradés, badges) con `#C94480` como variante de contraste para botones y CTAs (ajustada para cumplir contraste AA sobre blanco — el rosa puro no alcanza), lavanda `#D9CFF0` / `#B9A8E0` (secundario), dorado `#C99A3C` (solo detalles), celeste `#BFE1EE` y amarillo `#FBE6A2` (complementarios), texto marrón oscuro `#4A3B34` (nunca negro puro).

**Tipografía**: Fredoka (display, títulos) + Inter (texto, precios, botones, navegación), vía Google Fonts.

**Componentes reutilizables**: botones (`.btn-primary/secondary/ghost/whatsapp`), badges (`Nuevo`, `Personalizable`, `Últimas unidades`, `Oferta`, `Más elegido`), tarjeta de producto (`.product-card`), tarjeta de categoría (`.cat-card`), drawer de carrito, drawer de filtros, menú móvil, acordeón de FAQ, franja animada (marquee) y barra de beneficios — todos con estados de foco visibles y soporte para `prefers-reduced-motion`.

Radios moderados (10–24px), sombras suaves, mucho espacio en blanco. Los productos que todavía no tienen foto real muestran un placeholder con textura suave (`.ph-photo`); los 6 productos reales cargados ya muestran su fotografía.

## 3. Catálogo real cargado desde WhatsApp Business

El 31/07/2026 se importaron a `js/products-data.js` los 6 productos que estaban publicados en el catálogo de la cuenta de WhatsApp Business de LCG (colección "Especial Día Del Niño"): nombre, precio, medidas, materiales, descripción y fotos son los que LCG tenía cargados en ese momento. Las fotos están en `assets/productos/`.

- **Con foto y datos reales (precio incluido):** Washi Tapes x20, Set de Stickers x2, Maxi Etiquetas Mini Héroes x8, Etiquetas Mini Súper Héroes x15, Tag Super Zorrito x15 y Tag Super Conejita x15 — todos categorizados como `stickers`, `etiquetas` o `tags`, y además etiquetados con `occasion: "cumpleanos"` para que también aparezcan al filtrar por "Cumpleaños infantiles". El 01/08/2026 se reemplazaron sus fotos por versiones de mayor calidad que LCG subió a `assets/fotos/`.
- **Con foto real pero precio a confirmar:** el 01/08/2026 aparecieron en `assets/fotos/` fotos de 6 productos que no estaban cargados todavía: Tarjetón Super Pandita, Tarjetón Super Ratón, Tag Doble con Dije, Stickers Feliz Día x24, Super Cierra Todo x16 y Etiquetas Animales Súper Héroes x15. Se sumaron al catálogo con `priceOnRequest: true` — en vez de precio y botón "Agregar al carrito" muestran "Consultar precio" y un botón de WhatsApp. Cuando tengas el precio, medidas, material y tiempos de producción reales, completá esos campos en `js/products-data.js` y sacá el flag `priceOnRequest` para que se vendan como el resto del catálogo. Gracias a estos dos productos, las categorías "Tarjetas" y "Para repostería" dejaron de estar vacías.
- **Todavía sin catálogo real:** toppers y papelería para emprendimientos no tienen productos publicados todavía. Esas páginas de categoría muestran un estado vacío prolijo ("Todavía no hay productos cargados acá, consultanos por WhatsApp") en lugar de rellenarse con productos de otra categoría.
- El 10% de descuento por transferencia sigue siendo la política general del sitio (no un dato de WhatsApp) y se calcula sobre el precio de lista de cada producto real.
- Cuando cargues más catálogo en WhatsApp Business, hay que repetir el proceso: copiar nombre/precio/medidas/descripción a `js/products-data.js` y las fotos a `assets/productos/`.

## 4. Cómo funciona (importante)

Este sitio resuelve **interfaz y experiencia completas**, pero al ser HTML estático sin backend:

- El carrito persiste en el navegador (`localStorage`) y calcula subtotal, envío estimado y el 10% de descuento por transferencia — pero el checkout **no procesa pagos todavía**. El botón "Confirmar y pagar" es el punto donde hay que enganchar Mercado Pago (Checkout Pro/Bricks) o el medio de pago que elijas.
- El buscador filtra sobre el catálogo cargado en el navegador (alcanza para ~50-100 productos; para catálogos más grandes conviene un backend con búsqueda real).
- El número de WhatsApp real de LCG (`+54 9 11 5698-3539` → `5491156983539`) ya está cargado en `js/main.js` y en todos los enlaces `wa.me` del sitio.
- El logo real (`assets/Logo LCG.jpeg`, provisto por LCG) ya está integrado: versión recortada del isologo (`assets/logo-lcg-mark.png`) en el header y el menú móvil, y el lockup completo con el nombre (`assets/logo-lcg.jpg`) en el pie de página. También se generaron favicons (`assets/favicon-32.png`, `favicon-512.png`, `apple-touch-icon.png`) a partir de la estrella del isologo.
- El color institucional `#F8C4D9` ya es la variable `--pink` del sistema de diseño (fondos, degradés y badges). Para botones y links se usa `#C94480`, una variante más saturada del mismo tono pensada para cumplir el contraste mínimo de accesibilidad sobre blanco.

## 5. Próximos pasos para publicar

1. ~~Cargar WhatsApp real~~ ✓ hecho.
2. ~~Cargar catálogo real (6 productos "Especial Día Del Niño")~~ ✓ hecho — falta sumar el resto de las categorías cuando estén publicadas en WhatsApp Business.
3. Optimizar las fotos de `assets/productos/` a WebP y generar tamaños responsivos (`srcset`) antes de publicar — hoy están en PNG, sin comprimir.
4. Conectar Mercado Pago en `checkout.html` (Checkout Pro es la opción más simple para no manejar tarjetas vos misma).
5. Definir el proveedor de hosting (cualquier hosting con archivos estáticos sirve: Hostinger, cPanel tradicional, Netlify, Vercel, GitHub Pages, etc.) y subir la carpeta completa.
6. Configurar el dominio `www.lascosasquemegustan.com.ar` apuntando al hosting, y actualizar las URLs `canonical` y de `sitemap.xml`/`robots.txt` si cambian.
7. Reemplazar los testimonios marcados como "Testimonio de ejemplo" por reseñas reales antes de publicar.
8. Sumar Google Analytics 4, Meta Pixel y verificar el dominio en Google Search Console (agregar los scripts en el `<head>` de cada página).

## 6. SEO y rendimiento ya incluidos

- Meta title/description únicos por página, `canonical`, Open Graph básico, `robots.txt` y `sitemap.xml`.
- Datos estructurados: `Organization` y `WebSite` (inicio), `BreadcrumbList` (categoría), `Product`/`Offer` (ficha de producto), `FAQPage` (preguntas frecuentes).
- Jerarquía de encabezados H1 → H2 → H3 respetada en todas las páginas.
- `prefers-reduced-motion` respetado en marquee, franja de beneficios y scroll suave.
- Contraste de texto sobre fondo verificado (marrón oscuro sobre crema/blanco, nunca texto claro sobre pastel puro).
- Formularios con `label`, campos obligatorios marcados con `*` y mensajes de error visibles (no solo color).

Las fotos de `assets/productos/` ya están cargadas con `loading="lazy"`, pero siguen en PNG sin comprimir — conviene pasarlas a WebP/AVIF y generar tamaños responsivos (`srcset`) antes de publicar.

## 7. Recomendaciones de conversión

La franja de beneficios y el 10% por transferencia están arriba de todo para reducir fricción desde el primer segundo. El botón de WhatsApp contextual (con el nombre y link del producto ya cargado en el mensaje) es probablemente la palanca de conversión más importante para este rubro — no lo escondas ni lo hagas más chico en mobile. El popup de newsletter espera 15 segundos o intención de salida a propósito: mostrarlo antes castiga la primera impresión. En la ficha de producto, no dejes que se pueda agregar al carrito un producto personalizable sin completar los campos obligatorios — ya está bloqueado en el código, pero si cambiás el formulario mantené esa validación.

## 8. Accesibilidad

Navegación completa por teclado, foco visible en todos los elementos interactivos, textos alternativos preparados para imágenes reales, `aria-label`/`aria-expanded`/`aria-pressed` en botones de estado (menú, carrito, favoritos, acordeón, filtros), y ningún estado se comunica solo por color (los badges llevan texto, no solo un tono).
