# Estado actual del sitio

Referencia para quien vaya a construir versiones nuevas. Todo lo de aquí está
verificado contra la rama `staging`, que es la que tiene el trabajo más reciente.

Repositorio público: `https://github.com/Alexcat84/Trusted-Home-Services`
Rama de trabajo: `staging`

---

## El negocio

Trusted Home Services, empresa familiar de Ottawa, Ontario. Deja propiedades
listas para vender o para habitar. Un solo coordinador maneja todos los oficios,
así el cliente no contrata por separado a un pintor, un electricista y una
empresa de limpieza.

- Teléfono: (613) 204-8000
- Más de 500 casas preparadas en 6 años
- Sin depósito: se paga al terminar, incluso en proyectos de hasta $50,000
- Cotización gratis dentro de 24 horas
- Dos públicos: propietarios que van a vender, y agentes inmobiliarios
- Dominio previsto: trustedhomeservices.ca (todavía no apunta al sitio)

---

## Stack

React 19.2.7 con Vite 8.1.3 y CSS plano con tokens en `:root`.
Framer Motion 12 y anime.js 4.5 para animación.
Backend propio en funciones serverless de Vercel, con Prisma 7 y PostgreSQL.
Sin Next.js, sin Tailwind, sin librerías de componentes.

Comandos: `npm run dev`, `npm run lint`, `npm test`, `npm run build`.
La barra de calidad actual es lint sin avisos, 16 de 16 tests y build correcto.

---

## Mapa de archivos

```
src/
  App.jsx                  2142 líneas. Home, subpáginas, panel admin, formularios,
                           y el conmutador de páginas al final del archivo.
  index.css                3602 líneas. Toda la hoja de estilos, tokens en :root.
  translations.js          1158 líneas. Copy de toda la interfaz en en, fr y es,
                           más los slugs de sección por idioma.
  main.jsx                 Monta LangProvider y QuoteProvider.

  components/
    Header.jsx             Navegación, panel de servicios a ancho completo,
                           desplegable de Work With Us, selector de idioma.
    Footer.jsx
    ServicePage.jsx        Plantilla única de las nueve páginas de servicio.
    ServiceIcon.jsx        Nueve iconos SVG en línea, uno por servicio.
    Modal.jsx              Diálogo reutilizable con trampa de foco.
    CookieConsent.jsx      Carga Google Analytics solo tras aceptar.

  content/
    services.js            803 líneas. Catálogo de los nueve servicios con su
                           copy completo en en, fr y es, más slugs e imágenes.
    heroVideo.js           Cuál de los dos videos del hero está activo.

  context/
    LangContext.jsx        Idioma, con persistencia en localStorage.
    QuoteProvider.jsx      Si el diálogo de cotización está abierto.

  lib/
    routing.js             Rutas reales de las páginas de servicio con History API.
    locales.js             Idiomas activos. Español está apagado aquí, no borrado.
```

---

## Qué existe hoy

**Página principal**, en este orden:

1. Hero a altura completa de pantalla, en tres columnas fijas por decisión del
   cliente: contacto a la izquierda, video de renovación al centro, testimonios a
   la derecha. **Esta distribución no se mueve.**
2. Our Services: rejilla de nueve tarjetas que enlazan a sus páginas.
3. How We Work: proceso en tres pasos.

El formulario de cotización ya no es una sección. Es un diálogo flotante que se
abre desde cualquier botón de cotización del sitio.

**Nueve páginas de servicio**, cada una en su URL real e indexable:

```
/services/painting          /services/cleaning
/services/curb-appeal       /services/handyman
/services/decluttering      /services/electrical
/services/home-staging      /services/home-inspection
/services/flooring
```

Cada una usa la misma plantilla: hero propio con foto, qué incluye el trabajo,
por qué importa, preguntas frecuentes, llamado a cotización y enlaces al resto.
Ponen su propio `document.title` y su meta description al montarse.

**Otras páginas**, todavía por hash: `#for-realtors`, `#partners`,
`#our-projects`, `#faq`, `#privacy`, `#terms`, `#admin`.

**Navegación:** Home, Our Services (panel a ancho completo con los nueve),
How We Work, Our Projects, Work With Us (desplegable con For Realtors y Become a
Partner), Free Quote (abre el diálogo), selector EN / FR.

---

## Paleta, tokens reales de `src/index.css`

```css
--color-primary:      #0a233c;   /* azul marino: cintas, encabezado, pie, títulos */
--color-primary-dark: #0a1e3c;   /* hover y degradados */
--color-accent:       #F9772B;   /* naranja: acción principal de cada zona */
--color-accent-hover: #e06a20;
--color-text:         #2d3748;
--color-text-muted:   #718096;
--color-bg:           #ffffff;
--color-bg-alt:       #f7fafc;
--color-border:       #e2e8f0;
--radius: 12px;
--radius-lg: 20px;
--shadow:    0 4px 24px rgba(10, 35, 60, 0.08);
--shadow-lg: 0 12px 48px rgba(10, 35, 60, 0.12);
--transition: 0.3s ease;
```

Tipografías cargadas desde Google Fonts: **Outfit** para títulos, **DM Sans**
para texto.

Ojo: el valor `#ea580c` que aparece en `<meta name="theme-color">` de
`index.html` es el color de la barra del navegador en móvil, no el naranja de
marca. El de marca es `#F9772B`.

---

## Estado del SEO, con sus huecos

Lo que hay:

- `<title>` y meta description en `index.html` para la portada.
- Las nueve páginas de servicio ponen su propio título y descripción al montarse,
  con longitudes de 115 a 150 caracteres.
- `robots.txt` permite todo y apunta al sitemap.
- `vercel.json` reescribe `/services/:slug` para que una visita directa resuelva.
- El panel admin lleva `noindex`.

Lo que falta, y conviene resolver:

- **Sin Open Graph ni Twitter Card.** Compartir un enlace en redes o WhatsApp no
  muestra título, descripción ni imagen.
- **Sin `<link rel="canonical">`** en ninguna página.
- **Sin datos estructurados.** Un negocio local como este debería publicar
  `LocalBusiness` con dirección, teléfono y zona de servicio, y `Service` en cada
  página de servicio. También `FAQPage` donde hay preguntas frecuentes.
- **El sitemap está desactualizado.** Sigue listando URLs con `#` y no incluye
  ninguna de las nueve páginas de servicio.
- **Sin `hreflang`** entre la versión inglesa y la francesa.
- **Las nueve páginas comparten slug en todos los idiomas.** Traducirlos daría
  algo más de alcance en el mercado francófono de Ottawa.

---

## Reglas que no se negocian

Están en `docs/WEBSITE-RULES.md` del repositorio. Las que más se incumplen:

1. **Prohibido el guion largo**, ese que se usa como separador de frases. Ni en
   texto visible, ni en comentarios. Se reemplaza con punto, coma o dos puntos.
2. **El hero de tres columnas no se mueve.** Contacto izquierda, video centro,
   testimonios derecha.
3. **Los servicios se acceden desde el menú**, cada uno con su página.
4. **El logo no se redibuja.** Archivo oficial en
   `public/images/Logo v4.0 Inverted.jpg`, a 76px de alto.
5. **El naranja es acento, no fondo.** Reservado para la acción principal de cada
   zona.
6. Nada de emoji como iconos o viñetas. Se usan SVG en línea.
7. Ninguna imagen debe pasar de 300 KB. Formato WebP o AVIF.

---

## Cosas que conviene saber antes de tocar el CSS

- `src/index.css` tiene reglas antiguas del diseño anterior que siguen vivas y
  pueden ganar por especificidad. Ya pasó una vez: `.services-grid:not(.services-grid--four)`
  imponía cuatro columnas sobre una regla nueva de tres. Si un estilo no se
  aplica, busca una regla previa con más clases en el selector.
- Los recuadros de colores que marcan las zonas del hero siguen definidos, pero
  apagados. Se ven de nuevo añadiendo la clase `layout-debug` al `body`.
- `styles.css` en la raíz del proyecto está huérfano, nadie lo importa. El que
  vale es `src/index.css`.
