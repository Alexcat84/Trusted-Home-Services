# Corrección del batch 1 + solicitud del batch 2

Pega todo lo que está bajo `═══ PROMPT ═══` en la misma conversación donde te
entregaron el batch 1.

**Contexto de la verificación:** los tres prototipos se renderizaron en Chrome
headless (Playwright) a 1440×1000 y a 390×844, con clic aislado en carga limpia
sobre cada control. Lo que sigue está reproducido, no supuesto.

---

═══ PROMPT ═══

Verifiqué el batch 1 renderizando los tres prototipos en Chrome (Playwright), a
1440×1000 y a 390×844, haciendo clic sobre cada control en cargas limpias
independientes. **El diseño está muy bien** — las tres direcciones son
distintas, el copy es sólido y el modal de cotización, cuando abre, está bien
construido. No hace falta rediseñar nada.

Pero hay dos fallos de cableado reproducibles que impiden evaluar el entregable,
y falta la segunda mitad de lo pedido. Corrige lo primero y entrega lo segundo.

## Lo que sí funciona (para que no lo toques)

- Las tres páginas cargan sin un solo error de JavaScript.
- Los nueve servicios aparecen en las tres, con badge `NEW` en Electrical y
  Home Inspection.
- "No deposit", "500+ homes", el teléfono (613) 204-8000 y el selector EN/FR/ES
  están presentes en las tres.
- El menú de servicios abre correctamente en las tres, y cada dirección lo
  resuelve de forma distinta. Muy bien.
- El carrusel de testimonios rota y responde a los puntos.
- A 390 px no hay scroll horizontal y el menú hamburguesa abre mostrando los
  servicios.
- El foco de teclado es visible.
- El contenedor de video acepta 16/9 y 9/16 vía `videoAspect`. Correcto.

---

## FALLO 1 — Los enlaces del hub dan 404

`00-directions-hub.dc.html` apunta a archivos que no existen:

```
El hub enlaza a:            Los archivos realmente se llaman:
"THS Home — 01 The Promise.dc.html"        01-the-promise.dc.html
"THS Home — 02 The Transformation.dc.html" 02-the-transformation.dc.html
"THS Home — 03 The Concierge"              03-the-concierge.dc.html
```

Las tres tarjetas dan **404 al hacer clic**. El hub es la vía de revisión
acordada, así que hoy el entregable no se puede navegar.

**Corrige los `href` para que apunten a los nombres reales en kebab-case**
(no renombres los archivos). Cuando agregues las direcciones 4–6, usa la misma
convención: `04-…`, `05-…`, `06-…`.

---

## FALLO 2 — El CTA principal "Free Quote" no abre el modal

Probé cada botón de cotización por separado, en carga limpia, disparando el
clic sobre el elemento. Solo **uno de cada cuatro o cinco** abre el diálogo:

**01-the-promise**
| Botón | ¿Abre? |
|---|---|
| "Free Quote" — en el `<header>` | **NO** |
| "Free Quote" — en el hero | **NO** |
| "Get a free quote" — en el mega-menú | sí |
| "Get my free quote" — sección de cierre | **NO** |

**02-the-transformation**
| Botón | ¿Abre? |
|---|---|
| "Free Quote" — en el `<header>` | **NO** |
| "Get a free quote" — tarjeta de contacto del hero | **NO** |
| "Get a free quote" — en el menú | sí |
| "Get my free quote" — sección de cierre | **NO** |

**03-the-concierge**
| Botón | ¿Abre? |
|---|---|
| "Free Quote" — en el `<header>` | **NO** |
| "Get a free quote →" — en el hero | **NO** |
| "Get a quote for this" — en el trades board | **NO** |
| "Get a free quote" — en el menú | sí |
| "Get my free quote" — sección de cierre | **NO** |

El README dice en la línea 166: *"Free Quote modal (all directions): opens from
any Free Quote / play / audience button."* **Eso no se cumple.** El botón naranja
del header es el CTA más visible del sitio y es exactamente lo que el cliente
pidió convertir en modal flotante — y está muerto en las tres direcciones.

**Conecta al mismo modal todos los disparadores**, en las tres direcciones:

- El botón "Free Quote" del header (desktop **y** el del drawer móvil).
- Todos los CTA de cotización del cuerpo de la página, incluido "Get my free
  quote" del cierre y "Get a quote for this" del trades board.
- El botón de play sobre el póster del video, si el README sigue afirmando que
  abre el modal. Si prefieres que el play no haga nada hasta que exista el video
  real, quita esa afirmación del README — pero que el documento y el código digan
  lo mismo.
- En Concierge, "Get a quote for this" debería además **preseleccionar el chip
  del oficio activo** al abrir el modal. Es un detalle que ya sugiere tu propio
  diseño.

---

## FALLO 3 — El modal no atrapa el foco

Tu propio README lo reconoce en la línea 188 ("add a proper focus trap +
return-focus in production"), pero como los prototipos son la referencia de
comportamiento, resuélvelo ahí:

- Al abrir, mover el foco al primer control del diálogo.
- Ciclar `Tab` / `Shift+Tab` dentro del diálogo, sin escapar al fondo.
- Al cerrar (✕, Escape o clic en el scrim), **devolver el foco al botón que lo
  abrió**.
- Marcar el resto de la página como `aria-hidden` mientras el modal está abierto.

---

## FALTA — Las direcciones 4, 5 y 6

Acordamos seis direcciones en dos tandas. Entrega las tres restantes con el mismo
nivel de acabado que el batch 1, y que sean **tesis genuinamente distintas**, no
variaciones de las tres primeras.

Las tres ya entregadas ocupan estos territorios:

1. **The Promise** — la garantía de no-depósito como titular.
2. **The Transformation** — el video antes/después como protagonista.
3. **The Concierge** — un coordinador, todos los oficios, con trades board.

Para las tres nuevas busca ángulos que no se solapen. Algunas vetas sin explorar,
por si sirven de disparador — no estás obligado a usarlas:

- **La prueba local**: Ottawa como eje. Barrios reales, casas reales, resultados
  de venta. Confianza por proximidad geográfica.
- **El eje del realtor**: el sitio visto desde el agente inmobiliario, no desde
  el propietario. Velocidad de salida al mercado, listados que cierran antes.
- **El costo de no hacerlo**: qué pierde el propietario que lista sin preparar.
  Enfoque editorial, orientado a datos.
- **La secuencia**: el sitio organizado como una línea de tiempo de la
  preparación, del día 1 al día de la venta.

Cada dirección nueva debe traer, igual que las anteriores: maqueta navegable,
tesis en una frase, **el menú de 9 servicios resuelto de forma propia**,
pros y contras honestos, y el modal de cotización **completamente cableado desde
el principio**.

---

## Al cerrar

- Actualiza el hub para que liste las **seis** direcciones con enlaces que
  funcionen.
- Añade la **tabla comparativa de las seis** y tu **recomendación argumentada**:
  cuál elegirías, por qué, y qué le robarías a las descartadas.
- Actualiza el README para que describa lo que el código hace de verdad. Si algo
  queda deliberadamente sin cablear, dilo explícitamente en vez de afirmar lo
  contrario.

**Antes de entregar, abre cada prototipo y haz clic en cada CTA de cotización,
en cada enlace del hub y en el menú móvil.** Los dos fallos de arriba se
detectan en el primer clic.

Se mantienen todas las restricciones técnicas del brief original: un solo archivo
autocontenido por dirección, sin CDNs ni recursos externos, sin imágenes, copy
real en inglés, responsive y accesible, y la paleta `#0a233c` / `#F9772B` intacta.

═══ FIN DEL PROMPT ═══
