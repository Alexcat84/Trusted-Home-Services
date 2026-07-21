# Corrección del Grupo A y solicitud del Grupo B

Pega todo lo que está bajo la marca de inicio en la misma conversación donde
entregaron `a1-blueprint.html`, `a2-spotlight.html` y `a3-daylight.html`.

Verificación previa: los tres archivos se renderizaron en Chrome headless
(Playwright) a 1440x1000 y a 390x844, con clic aislado en carga limpia sobre
cada botón de cotización, y midiendo la geometría real de los elementos.

---

=== INICIO DEL PROMPT ===

Verifiqué las tres direcciones del Grupo A renderizándolas en Chrome, midiendo la
geometría de los elementos y haciendo clic sobre cada control. El trabajo está
muy bien. Hay un solo defecto real, y falta el Grupo B.

## Lo que quedó correcto en las tres

No toques nada de esto:

- Cero apariciones del guion largo en los tres archivos.
- El logo se resolvió exactamente como se pidió: un marcador neutro rotulado con
  su proporción, sin inventar ningún símbolo. Perfecto, mantén ese criterio.
- El hero respeta la estructura fija: contacto a la izquierda, video al centro,
  reseñas a la derecha.
- Los nueve servicios están solo en el menú. En el cuerpo del home no aparece
  ninguno. Correcto.
- El modal de cotización abre desde los cinco botones en las tres direcciones.
- A 390px de ancho no hay desplazamiento horizontal en ninguna.
- Sin recursos externos y sin errores de JavaScript.

## El defecto: en a3-daylight el titular está colapsado

El H1 del hero se parte en una palabra por línea y ocupa 890px de alto, lo que
empuja las tres columnas muy por debajo del pliegue y estira la página a 4750px.

La causa está en la línea 72 de `a3-daylight.html`:

```css
.hero-head { max-width: 20ch; }
```

La unidad `ch` se resuelve contra la fuente **del elemento donde se declara**.
Ese contenedor hereda los 16px del cuerpo, así que `20ch` da 173px. El H1 que va
dentro usa `clamp(2.7rem, 7vw, 5.4rem)`, que a 1440px son 86.4px. La intención
era limitar el titular a unos 20 caracteres de la fuente grande, no de la chica.

Medido antes y después de mover la propiedad al propio H1:

| | Ahora | Con el arreglo |
|---|---|---|
| Ancho del H1 | 173 px | 1035 px |
| Alto del H1 | 890 px | 267 px |
| Alto de la página | 4750 px | 3835 px |

El arreglo:

```css
.hero-head    { max-width: none; }
h1.hero-title { max-width: 20ch; }
```

Aplícalo y revisa el resto de los tres archivos buscando el mismo patrón:
cualquier `max-width` o `width` en unidades `ch` o `em` declarado en un
contenedor cuya fuente sea distinta a la del texto que realmente debe limitar.
En a1 y a2 el titular mide 518px y 535px, que son valores sanos, pero conviene
confirmar que no haya otros casos latentes en secciones más abajo.

## Lo que falta: las cinco direcciones del Grupo B

Acordamos ocho direcciones en total. Faltan las cinco exploratorias. Nómbralas
`b1-` a `b5-` siguiendo la convención de archivo que ya usaste.

En el Grupo B tienes libertad total sobre la estructura del hero. Son propuestas
para que el cliente vea qué otras formas existen antes de cerrar la decisión.
Cada una debe partir de una tesis distinta sobre qué ve primero el visitante.

Vetas por si sirven de disparador, no estás obligado a usarlas:

- La garantía de cero depósito como titular absoluto de la página
- El video de transformación ocupando la pantalla completa
- El eje del agente inmobiliario en lugar del propietario
- La prueba local: barrios reales de Ottawa, casas reales, resultados de venta
- La secuencia temporal, del primer día al día de la venta
- El costo de listar una casa sin prepararla, con enfoque editorial

Si dos direcciones comparten la misma idea con otro color, una de las dos sobra.

## Reglas que siguen aplicando al Grupo B

Todo lo que ya resolviste bien en el Grupo A se mantiene:

**Lenguaje.** Prohibido el guion largo, en el texto visible, en el README y en
los comentarios de código. Se reemplaza con punto, coma, dos puntos o paréntesis.
Evita también las muletillas de texto generado: frases de relleno, adjetivos
apilados y párrafos que podrían aplicar a cualquier empresa.

**Logo.** Es la marca registrada del cliente y no se dibuja jamás. Reserva el
espacio con el mismo marcador neutro de proporción 3.6 a 1 que ya usaste. Nada
de símbolos geométricos inventados.

**Servicios.** Los nueve se acceden desde el menú de navegación, cada uno con su
página propia. El cuerpo del home no lleva parrilla de tarjetas ni ninguna otra
enumeración de los nueve. Resolver ese menú sigue siendo una decisión central, y
en el Grupo B puede resolverse distinto que en el Grupo A.

Los nueve: Painting & Coatings, Curb Appeal, Decluttering & Removal, Home
Staging, Flooring, Cleaning, Handyman, Electrical (nuevo) y Home Inspection
(nuevo).

**Paleta.** No se cambia.

```
--color-primary:      #0a233c
--color-primary-dark: #0a1e3c
--color-accent:       #F9772B
--color-accent-hover: #e06a20
--color-text:         #2d3748
--color-text-muted:   #718096
--color-bg-alt:       #f7fafc
```

El naranja es acento, no fondo. Resérvalo para la acción principal de cada zona.

**Contenido obligatorio.** La promesa de cero depósito con peso real (se paga al
terminar, incluso en proyectos de hasta $50,000), las más de 500 casas en 6 años,
el teléfono (613) 204-8000 accesible sin scroll, el selector EN / FR / ES en la
navegación, y recorridos claros para propietarios y para agentes inmobiliarios.

**Cotización.** Modal flotante de varios pasos que abre desde todos los botones
de cotización de la página, incluido el del header y el del menú móvil. Atrapa el
foco del teclado, cierra con Escape y devuelve el foco al botón que lo abrió.

**Video.** Contenedor en bucle, sin sonido, con póster de respaldo, que acepte
tanto 16:9 como 9:16. Marcador construido con CSS, no imagen.

**Animación.** Mismo nivel que en el Grupo A. Solo `transform` y `opacity`.
Curvas suaves tipo `cubic-bezier(0.16, 1, 0.3, 1)`. Entradas de 400 a 700ms,
micro interacciones de 150 a 250ms. Revelados con `IntersectionObserver`
escalonados de 60 a 80ms, una sola vez por elemento. Una secuencia de entrada
orquestada en el hero. Contadores animados en las cifras. Respeto por
`prefers-reduced-motion`. Nada de rebotes, giros completos ni texto que se
escribe letra por letra.

**Técnico.** Un archivo HTML autocontenido por dirección, con todo el CSS y el
JavaScript en línea. Sin CDNs, sin fuentes remotas, sin scripts externos y sin
imágenes. Responsive real, con el móvil como composición propia y no como una
reducción del escritorio. Accesible. Copy real en inglés.

**Referencias de nivel visual**, por si puedes consultarlas:

- https://www.awwwards.com/websites/architecture/
- https://www.awwwards.com/websites/sites_of_the_day/
- https://we-awards.com/winner-category/website/home-renovation/

Si no puedes navegarlas, aplica los patrones que las caracterizan: espacio en
blanco generoso, tipografía de gran escala con jerarquía clara, la fotografía de
obra como protagonista, señales de confianza visibles pronto, retículas
asimétricas, y movimiento que acompaña la lectura en vez de interrumpirla.

## Al cerrar

Entrega una página índice que enlace las **ocho** direcciones con enlaces que
funcionen, más una tabla comparativa de las ocho y tu recomendación argumentada:
cuál elegirías, por qué, y qué le tomarías prestado a las descartadas.

## Antes de entregar, comprueba esto y confirma el resultado

1. Busca el guion largo en todos los archivos. No debe aparecer ninguna vez.
2. Abre `a3-daylight.html` a 1440px y confirma que el titular ocupa unas tres
   líneas, no una palabra por línea.
3. Busca en los ocho archivos cualquier `max-width` o `width` en `ch` o `em`
   declarado sobre un contenedor cuya fuente difiera de la del texto que limita.
4. Abre cada una de las ocho maquetas y haz clic en cada botón de cotización,
   incluido el del header. Todos deben abrir el modal.
5. Abre la página índice y haz clic en los ocho enlaces. Ninguno debe fallar.
6. Revisa las ocho a 390px de ancho y confirma que no hay desplazamiento
   horizontal.
7. Confirma que en el cuerpo del home de las ocho no quedó ninguna enumeración de
   los nueve servicios.
8. Confirma que en ninguna maqueta dibujaste un logo. Solo el marcador neutro.

=== FIN DEL PROMPT ===
