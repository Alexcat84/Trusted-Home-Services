# Design brief — Trusted Home Services

**Cómo usar este archivo:** copia todo lo que está debajo de la línea `═══ PROMPT ═══`
y pégalo en Claude junto con el archivo [`current-home.html`](./current-home.html).
Ese HTML es una captura real del sitio actual (DOM renderizado + `src/index.css`
completo, sin modificar), así que Claude trabaja sobre lo que ya existe y no sobre
suposiciones.

**Archivos de este paquete:**

| Archivo | Qué es |
|---|---|
| `current-home.html` | Captura autocontenida del home actual (rama `staging`, 1440×1000). Renderiza idéntico al sitio real. |
| `current-home-reference.png` | Captura de pantalla completa, por si el HTML no se puede renderizar. |
| `DESIGN-BRIEF.md` | Este archivo: el prompt. |

---

## Hallazgos previos que conviene arreglar (independientes del rediseño)

1. **`styles.css` en la raíz del proyecto está huérfano.** La app importa
   `src/index.css`; nadie importa `styles.css`. Son dos hojas distintas con
   paletas distintas y eso ya causó confusión. Recomiendo borrarlo.
2. **La paleta real no es la documentada.** `DISENO-PALETA-Y-ESTRUCTURA.md` dice
   `#223151`, pero el CSS vivo usa `--color-primary: #0a233c`. El prompt de abajo
   usa **los valores reales**.
3. **Imágenes sin optimizar.** `decluttering-removal.jpg` pesa **5.8 MB**;
   hay varias sobre 1.5 MB. En móvil eso es una pantalla en blanco de varios
   segundos. Antes de lanzar hay que convertir todo a WebP/AVIF y redimensionar.
4. **Los recuadros de colores del hero son guías temporales**, marcadas en el CSS
   como `/* TEMP: hero layout debug */`. El prompt le indica a Claude que no
   forman parte del diseño.

---

═══ PROMPT ═══

Eres el director de diseño de un estudio pequeño. Te contrataron para rediseñar
el sitio de **Trusted Home Services**, y el cliente ya rechazó propuestas que se
sentían genéricas o de plantilla. Quiere algo **realmente impactante y
profesional**, no un tema de WordPress más.

Te adjunto `current-home.html`: es una **captura real del sitio actual**, con el
DOM renderizado y la hoja de estilos completa (`src/index.css`, 3.043 líneas)
incrustada sin modificar. Trabaja a partir de eso — no inventes el punto de
partida.

## El negocio

Empresa familiar en **Ottawa, Ontario (Canadá)** que deja propiedades listas para
vender o para mudarse. Un solo contacto coordina todos los oficios: el cliente no
tiene que llamar a un pintor, un electricista y una empresa de limpieza por
separado.

- **Teléfono:** (613) 204-8000
- **Trayectoria:** más de 500 casas preparadas en 6 años
- **Diferenciador fuerte:** *no piden depósito*. Se paga al terminar la obra,
  incluso en proyectos de hasta $50.000
- **Respuesta:** dentro de 24 horas
- **Dos públicos distintos:** propietarios que van a vender, y agentes
  inmobiliarios (realtors) que preparan sus listados
- **Sitio trilingüe:** inglés (principal), francés y español

**Competidor de referencia:** `prepnsell.com` — hace exactamente lo mismo a escala
nacional y rankea bien en Google. Sirve como referencia de *estructura y alcance
de servicios*, **no** para copiar diseño ni textos.

## Identidad visual — respetar

Al cliente le gustan sus colores. **No los cambies.** Estos son los valores reales
del CSS actual:

```
--color-primary:      #0a233c   /* azul marino muy oscuro — cintas, header, footer */
--color-primary-dark: #0a1e3c   /* hover y gradientes */
--color-accent:       #F9772B   /* naranja — CTAs, enlaces, iconos */
--color-accent-hover: #e06a20
--color-text:         #2d3748
--color-text-muted:   #718096
--color-bg-alt:       #f7fafc
```

Tipografías actuales: **Outfit** (títulos) y **DM Sans** (texto), vía Google Fonts.
Puedes proponer otro emparejamiento si mejora claramente el resultado, pero
justifícalo.

Lo que **sí** puedes rediseñar libremente: composición, jerarquía, retícula,
escala tipográfica, densidad, movimiento, tratamiento fotográfico y cómo se
distribuye el naranja (hoy se usa de más y pierde fuerza).

## Los nueve servicios

Cada uno será su propia página con URL indexable (`/services/painting`, no
`#painting`):

1. Painting & Coatings
2. Curb Appeal
3. Decluttering & Removal
4. Home Staging
5. Flooring
6. Cleaning
7. Handyman *(absorbe drywall, masilla, carpintería menor y luminarias)*
8. **Electrical** — nuevo
9. **Home Inspection** — nuevo

Se elimina la categoría antigua "Repairs & preparation" por redundante con Handyman.

## Cambios que el cliente pidió explícitamente

1. **Los 9 servicios pasan de tarjetas en el home a páginas propias.** Hay que
   resolver un menú que permita navegarlos sin abrumar. El competidor tiene ~16
   ítems en un dropdown; eso es justo lo que **no** queremos.

2. **El hero se reorganiza en tres columnas** (ya está así en la captura):
   - **Izquierda:** contacto — botón de cotización, teléfono, sello de garantía
   - **Centro:** un **video** de renovación antes/después *(ver abajo)*
   - **Derecha:** testimonios de clientes

3. **El centro del hero llevará un video**, probablemente generado con IA,
   mostrando la transformación de una casa. En la captura ese espacio se ve
   vacío: **es intencional, está reservado**. Diseña alrededor de un `<video>`
   en bucle, sin sonido, con reproducción automática y un póster estático de
   respaldo. Contempla que puede ser vertical u horizontal.

4. **"Get a Free Quote" pasa a ser un modal flotante.** Hoy es una sección al
   final de la página que obliga a hacer scroll. Debe abrirse sobre el contenido
   desde cualquier punto del sitio. El formulario es un asistente de varios pasos
   que ya existe.

5. Los **recuadros de colores** (rojo, magenta, verde) que aparecen en el hero de
   la captura son **guías temporales de maquetación**, marcadas en el CSS como
   `/* TEMP: hero layout debug */`. No son parte del diseño — ignóralas.

## Lo que tienes que entregar

Genera **entre 5 y 7 direcciones de diseño claramente distintas** para la página
principal. No variaciones de color de una misma idea: cada una debe partir de una
tesis diferente sobre qué ve primero el visitante y cómo llega a los servicios.

Para **cada** dirección incluye:

- Una **maqueta renderizada y navegable** del home: barra de navegación (con el
  menú de servicios resuelto), hero de tres columnas, presentación de los 9
  servicios y el CTA de cotización.
- **Un nombre y una tesis en una frase** — qué prioriza esta dirección.
- **El menú resuelto de verdad.** Es una decisión de diseño central, no un
  detalle: muestra cómo se accede a los 9 servicios.
- **A favor / en contra**, honestos. Incluye la desventaja real de cada una.

Cierra con una **tabla comparativa** y **tu recomendación argumentada** — cuál
elegirías y por qué, incluyendo qué tomarías prestado de las descartadas.

## Restricciones técnicas

- **Un solo archivo HTML autocontenido.** Todo el CSS y JS en línea. Sin CDNs,
  sin `<script src>` externo, sin hojas de estilo remotas: una CSP estricta los
  bloquea. Si necesitas una tipografía no estándar, incrústala como `@font-face`
  con data URI, o usa una pila de fuentes del sistema.
- **Sin imágenes externas.** Para las fotos usa marcadores construidos con CSS
  (gradientes, formas) o SVG en línea. Las fotos reales las pone el cliente.
- **Responsive de verdad.** El hero de tres columnas tiene que degradar bien en
  móvil, donde entra más de la mitad del tráfico de este sector.
- **Accesible.** Contraste suficiente, foco visible por teclado, respeta
  `prefers-reduced-motion`, el modal de cotización atrapa el foco correctamente.
- **Copy real, en inglés.** Nada de *lorem ipsum*. Usa los datos del negocio de
  arriba. Puedes reescribir los textos actuales si mejoran.

## Qué evitar

- El aspecto "plantilla de contratista": héroe con foto de stock oscurecida,
  tres iconos redondos, botón naranja centrado.
- Los tics visuales de IA: degradado morado-azul, cremas con serif y terracota,
  emojis como marcadores de sección, todo centrado, todo con esquinas muy
  redondeadas, tarjetas con barrita de acento a la izquierda.
- Copiar la estética de `prepnsell.com`. Tomamos su alcance de servicios, no su
  diseño.
- Movimiento decorativo. Si algo se anima, que sea porque ayuda a entender la
  transformación que vende este negocio.

Antes de escribir código, escribe un plan breve de diseño por cada dirección
(color, tipografía, retícula, tesis). Si alguno se parece a lo que producirías
por defecto para cualquier empresa de reformas, deséchalo y reemplázalo.

═══ FIN DEL PROMPT ═══
