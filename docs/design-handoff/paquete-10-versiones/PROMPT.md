# Prompt para Claude Code: diez versiones de la página principal

Pega todo lo que está bajo la marca de inicio en una sesión de Claude Code
abierta en la carpeta del proyecto. Adjunta también, o deja en la carpeta para
que los lea, estos archivos que van en este mismo paquete:

- `ESTADO-ACTUAL.md`, qué existe hoy y sobre qué se construye
- `estado-home.html`, la portada actual renderizada, en un archivo autónomo
- `estado-pagina-servicio.html`, una página de servicio, igual de autónoma
- Las capturas `captura-*.png`, incluido el panel de servicios abierto

---

=== INICIO DEL PROMPT ===

Trabajas en el sitio de Trusted Home Services, una empresa de preparación de
propiedades en Ottawa. El código está en esta carpeta y en la rama `staging`.
Lee `ESTADO-ACTUAL.md` antes de empezar: describe la arquitectura, el mapa de
archivos, la paleta, el estado del SEO y las reglas del proyecto.

Tu encargo es producir **diez versiones distintas de la página principal**, cada
una completa y navegable, cada una con su SEO resuelto, para que el cliente
pueda compararlas y elegir una.

## Lo primero: entender lo que ya existe

Antes de escribir nada, lee el código y confirma lo que encuentres:

- `src/App.jsx`, cómo está montada la página principal hoy
- `src/index.css`, los tokens del bloque `:root` y las reglas del hero
- `src/components/Header.jsx`, la navegación y el panel de servicios
- `src/content/services.js`, el catálogo de los nueve servicios
- `src/translations.js`, cómo está organizado el copy en inglés y francés
- `docs/WEBSITE-RULES.md`, las reglas del sitio

No des por buenos los valores que aparezcan en ningún resumen sin verificarlos
en el código.

Si prefieres ver el resultado antes de leer el código, o si no consigues
levantar el servidor de desarrollo, abre `estado-home.html` y
`estado-pagina-servicio.html`. Son instantáneas del sitio funcionando, con el
marcado y los estilos ya calculados, y se abren sin depender de nada. Eso sí:
son el resultado, no la fuente. Lo que se edita vive en `src/`.

## Qué es una versión

Cada versión es la página principal completa, con su propia composición, ritmo
visual y jerarquía. No son diez veces la misma página con otro color. Deben
diferenciarse en cómo organizan la información, cuánto respiran, qué ponen
primero y cómo conducen al visitante hacia la cotización.

Cada versión debe:

1. Servirse en su propia ruta, `/v1` hasta `/v10`, para poder verlas y
   compararlas sin sustituir la página actual.
2. Traer su SEO completo, según la sección de más abajo.
3. Funcionar en inglés y en francés, usando el sistema de traducción existente.
4. Ser responsive de verdad. Más de la mitad del tráfico de este sector llega
   desde el móvil, así que el móvil es una composición propia y no una reducción
   del escritorio.
5. Reutilizar el contenido real que ya existe. No inventes servicios, cifras ni
   testimonios.

Añade además una página índice en `/versiones` que las enlace todas, con una
miniatura o una descripción de cada una y una frase sobre qué prioriza cada
propuesta. Esa es la página que verá el cliente para decidir.

## Lo que no cambia en ninguna versión

Estas cinco cosas están decididas y valen para las diez:

1. **El hero es de tres columnas**: contacto a la izquierda, video de renovación
   al centro, testimonios a la derecha. La distribución está medida y aprobada.
   Puedes cambiar tipografía, color, fondo, densidad, bordes, sombras y
   animación de entrada. No puedes mover los bloques de sitio ni eliminar
   ninguna de las tres zonas. En móvil el orden vertical es contacto, video,
   testimonios.
2. **Los nueve servicios se acceden desde el menú**, cada uno con su página. El
   cuerpo de la portada puede mostrarlos como tarjetas de acceso, pero no se
   convierte en un catálogo con el detalle de cada uno.
3. **El logo no se redibuja ni se sustituye.** Se usa el archivo real.
4. **La cotización es un diálogo flotante** que se abre desde cualquier botón. No
   vuelve a ser una sección al final de la página.
5. **Las nueve páginas de servicio no se tocan.** Ya están construidas y
   aprobadas. Las versiones son de la portada.

## Color

La paleta es canónica y parte de la marca:

```
--color-primary:      #0a233c   azul marino
--color-primary-dark: #0a1e3c
--color-accent:       #F9772B   naranja
--color-accent-hover: #e06a20
```

Puedes variar y combinar dentro de ese mundo: proporciones distintas entre claro
y oscuro, secciones en marino con texto claro, tintes y transparencias derivadas
de los dos colores, neutros templados hacia el marino. Lo que no cabe es
introducir un tercer color de marca ni cambiar el marino o el naranja por otros.

El naranja es acento, no fondo. Hoy el sitio lo pone en demasiados botones a la
vez y por eso pierde fuerza. Resérvalo para la acción principal de cada zona.

Tipografías: Outfit para títulos, DM Sans para texto, ya cargadas. Puedes variar
tamaños, pesos, interlineado y escala, que es donde de verdad se nota la
diferencia entre una versión y otra.

## SEO, una por versión

Cada versión lleva su propio bloque, y aquí es donde hay hueco real que cubrir,
porque el sitio actual va corto. Para cada una:

- `<title>` propio, de 50 a 60 caracteres, con el servicio y la ciudad.
- Meta description propia, de 140 a 160 caracteres, que diga qué gana el
  visitante y no solo qué vende la empresa.
- **Open Graph y Twitter Card completos**: `og:title`, `og:description`,
  `og:image`, `og:url`, `og:type`, `og:locale` y su alternativa. Hoy no existen,
  así que compartir un enlace en redes o WhatsApp no muestra nada.
- `<link rel="canonical">`.
- `hreflang` entre la versión inglesa y la francesa, más `x-default`.
- **Datos estructurados en JSON-LD.** Como mínimo `LocalBusiness` con nombre,
  teléfono, zona de servicio en Ottawa, horario si procede y rango de precios.
  Añade `Service` para el conjunto de servicios y `BreadcrumbList` donde tenga
  sentido. Valida mentalmente contra el vocabulario de schema.org y no inventes
  propiedades.
- Un solo `h1` por página y una jerarquía de encabezados que no salte niveles.
- Texto alternativo real en las imágenes que comuniquen algo, y vacío en las
  decorativas.
- Peso de imagen por debajo de 300 KB, en WebP o AVIF.

Actualiza además `public/sitemap.xml`, que hoy está desactualizado: sigue
listando direcciones con `#` y no incluye ninguna de las nueve páginas de
servicio. Deja el sitemap correcto para el sitio tal como está ahora.

Explica en el índice, en una línea por versión, qué apuesta de SEO hace cada una
si difieren entre sí.

## Reglas de escritura

**Prohibido el guion largo**, ese que se usa como separador entre frases. Ni en
el texto visible, ni en los comentarios del código, ni en los mensajes de commit.
Se reemplaza con punto, coma, dos puntos o paréntesis. Si una frase parece
necesitarlo, casi siempre conviene partirla en dos.

Evita las muletillas de texto generado: frases de relleno, adjetivos apilados sin
contenido, estructuras de tres elementos repetidas sin parar y párrafos que
podrían aplicar a cualquier empresa. El texto debe sonar a alguien que conoce el
oficio en Ottawa.

Nada de emoji como iconos ni como viñetas. Para iconos, SVG en línea. Ya hay
nueve en `src/components/ServiceIcon.jsx` que puedes reutilizar o ampliar.

## Accesibilidad

No es opcional y cuenta para las diez:

- Contraste suficiente en texto y controles. Cuidado especial al invertir
  secciones a fondo marino.
- Foco de teclado siempre visible.
- El diálogo de cotización atrapa el foco, cierra con Escape y devuelve el foco
  al botón que lo abrió. Ya está resuelto en `src/components/Modal.jsx`.
- Se respeta `prefers-reduced-motion`, incluido el autoplay del video.
- Navegación operable con teclado, y menús que cierran con Escape.

## Cómo trabajar

- Crea una rama nueva para esto. No trabajes sobre `staging` ni sobre `main`.
- Reutiliza lo que ya existe: `Header`, `Footer`, `Modal`, `ServiceIcon`, el
  catálogo de servicios y el sistema de traducción. Diez copias del mismo
  componente con cambios menores no es el camino.
- El CSS de cada versión va acotado a su propia clase raíz, por ejemplo
  `.v3 .hero-title`, para que ninguna versión afecte a otra ni a la página
  actual. Cuidado con las reglas antiguas que ganan por especificidad, hay un
  aviso sobre esto en `ESTADO-ACTUAL.md`.
- Añade las rutas nuevas al enrutado que ya existe en `src/lib/routing.js`, y la
  reescritura correspondiente en `vercel.json` para que una visita directa a
  `/v7` resuelva.
- Ve haciendo commits por versión, no uno gigante al final.

## Antes de dar por terminado

Ejecuta y confirma el resultado:

1. `npm run lint` sin errores ni avisos.
2. `npm test` en verde.
3. `npm run build` correcto.
4. Busca el guion largo en todo lo que hayas escrito. No debe aparecer.
5. Abre las diez versiones y la página índice y confirma que cargan sin errores
   de consola.
6. Revisa las diez a 390 px de ancho y confirma que no hay desplazamiento
   horizontal.
7. Confirma que en las diez el hero conserva sus tres zonas en su sitio.
8. Confirma que el diálogo de cotización abre desde todos los botones de cada
   versión.
9. Comprueba que cada versión tiene su título, su descripción, su Open Graph y
   su JSON-LD, y que el JSON-LD es válido.

Antes de escribir código, escribe un plan breve de las diez: nombre, tesis en una
frase y en qué se diferencia de las demás. Si dos se parecen, cambia una. Si
alguna se parece a lo que producirías por defecto para cualquier empresa de
reformas, deséchala y propón otra.

=== FIN DEL PROMPT ===
