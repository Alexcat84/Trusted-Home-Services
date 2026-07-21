# Prompt completo para Claude Design

Autocontenido. No depende de conversaciones anteriores. Pega todo lo que está
bajo la marca de inicio, y adjunta estos dos archivos:

- `docs/design-handoff/current-home.html` (captura del sitio actual)
- `docs/WEBSITE-RULES.md` (reglas del sitio)

---

=== INICIO DEL PROMPT ===

Eres el director de diseño de un estudio conocido por dar a cada cliente una
identidad propia. Este cliente ya rechazó propuestas que se sentían de plantilla.
Quiere un sitio realmente impactante y profesional, con animación de buen nivel,
y sobre todo que no se sienta repetitivo entre una propuesta y otra.

Te adjunto dos archivos. El primero, `current-home.html`, es una captura real del
sitio actual con el DOM renderizado y la hoja de estilos completa incrustada.
El segundo, `WEBSITE-RULES.md`, contiene las reglas del proyecto y manda sobre
cualquier criterio estético.

## El negocio

Trusted Home Services es una empresa familiar de Ottawa, Ontario (Canadá) que
deja propiedades listas para vender o para mudarse. El valor central es que un
solo coordinador maneja todos los oficios, así el cliente no tiene que contratar
por separado a un pintor, un electricista y una empresa de limpieza.

Datos reales que puedes usar en el copy:

- Teléfono: (613) 204-8000
- Más de 500 casas preparadas en 6 años
- Sin depósito. Se paga al terminar la obra, incluso en proyectos de hasta $50,000
- Cotización gratis dentro de 24 horas
- Dos públicos: propietarios que van a vender, y agentes inmobiliarios que
  preparan sus listados
- Sitio trilingüe: inglés (principal), francés y español

## Regla de lenguaje, la más importante

**Está prohibido el carácter guion largo (el que va entre espacios como
separador de frase).** Ni en el texto visible, ni en el README, ni en comentarios
de código. Tampoco su versión corta usada con la misma función.

Se reemplaza con puntuación normal: punto, coma, dos puntos, punto y coma o
paréntesis. Si una frase parece necesitarlo, casi siempre conviene partirla en
dos frases.

Ejemplos de lo que NO quiero, y su corrección:

```
mal:  No deposit — you pay when the work is done
bien: No deposit. You pay when the work is done.

mal:  Painters, cleaners, inspectors — all handled
bien: Painters, cleaners and inspectors, all handled

mal:  Ottawa — 500+ homes in 6 years
bien: Ottawa, 500+ homes in 6 years
```

El guion corto normal sí se permite donde de verdad corresponde: palabras
compuestas (market-ready), teléfonos, rangos y nombres de archivo.

Además, evita las muletillas típicas de texto generado: frases de relleno,
adjetivos apilados sin contenido ("innovador, robusto y potente"), estructuras de
tres elementos repetidas sin parar, y párrafos que podrían aplicar a cualquier
empresa. Este negocio arregla casas reales en Ottawa. El texto debe sonar a
alguien que conoce el oficio.

Antes de entregar, busca el carácter prohibido en todos los archivos y confirma
que no aparece ninguna vez.

## El logo no se toca

El logo es la marca registrada del cliente y no se modifica jamás. Ni el dibujo,
ni sus colores, ni la tipografía que lo compone, ni sus proporciones.

Como estas maquetas no pueden cargar imágenes, **reserva el espacio del logo con
un marcador neutro** de proporción aproximada 3.6 a 1 (el original se muestra a
76px de alto con ancho automático), rotulado claramente como espacio del logo.

**No inventes un logo sustituto.** En una tanda anterior de prototipos se dibujó
un triángulo naranja con el nombre al lado como reemplazo. Eso no se acepta:
dibujar una marca provisional equivale a cambiar la marca. Un rectángulo neutro
con la palabra "logo" es correcto. Un símbolo geométrico inventado, no.

Diseña la barra de navegación contando con que ahí irá una imagen horizontal
bastante ancha, no un icono cuadrado.

## Identidad visual

La paleta no se cambia. Al cliente le gustan sus colores.

```
--color-primary:      #0a233c    azul marino oscuro (cintas, header, footer)
--color-primary-dark: #0a1e3c    hover y gradientes
--color-accent:       #F9772B    naranja (acciones principales)
--color-accent-hover: #e06a20
--color-text:         #2d3748
--color-text-muted:   #718096
--color-bg-alt:       #f7fafc
```

Tipografías actuales: Outfit para títulos, DM Sans para texto. Puedes proponer
otro emparejamiento si mejora claramente el resultado, siempre que lo justifiques
y respete la restricción técnica de no cargar fuentes externas.

El naranja es un acento, no un color de fondo. Hoy el sitio lo pone en todos los
botones a la vez y por eso pierde fuerza. Resérvalo para la acción principal de
cada zona.

Lo que sí puedes rediseñar sin límite: composición, jerarquía, retícula, escala
tipográfica, densidad, textura, tratamiento fotográfico, movimiento, y la forma
en que se agrupa la información.

## Los nueve servicios

Cada uno tendrá su propia página con URL indexable (`/services/painting`, no
`#painting`).

1. Painting & Coatings
2. Curb Appeal
3. Decluttering & Removal
4. Home Staging
5. Flooring
6. Cleaning
7. Handyman (absorbe drywall, masilla, carpintería menor y luminarias)
8. Electrical (nuevo, debe notarse que es nuevo)
9. Home Inspection (nuevo, debe notarse que es nuevo)

**Los nueve se acceden desde el menú de navegación.** El cuerpo del home NO
lleva una parrilla de tarjetas con los nueve servicios, porque eso es
exactamente lo que existe hoy y lo que el cliente quiere quitar. El home puede
mencionar que son nueve trabajos coordinados por un solo contacto, pero sin
desplegar el catálogo.

Resolver ese menú es una de las decisiones de diseño centrales del encargo.
Nueve destinos tienen que ser navegables sin abrumar.

## El bloque principal (hero)

Aquí está la parte importante del encargo, y viene dividida en dos grupos.

### Grupo A: tres direcciones con la estructura ya decidida

El cliente ya fijó qué va en cada columna del hero. En estas tres direcciones
las ubicaciones no se mueven. Lo único que cambia es cómo se presenta cada zona.

```
IZQUIERDA              CENTRO                      DERECHA
Contacto:              Video de renovación         Testimonios
cotización,            antes y después,            de clientes,
teléfono,              en bucle, sin sonido.       rotativos
sello de calidad,      Debe funcionar en
promesa de             16:9 y en 9:16
cero depósito
```

En móvil el orden vertical es: contacto, video, testimonios.

Estas tres son las candidatas serias a producción, así que quiero ver hasta
dónde se puede llevar la misma estructura con tratamientos visuales muy
distintos entre sí. Que se diferencien por tipografía, color dentro de la
paleta, fondo, densidad, textura, forma de los contenedores y sobre todo por la
animación. No por mover bloques.

### Grupo B: cinco direcciones exploratorias

Aquí sí tienes libertad total sobre la estructura del hero. Son propuestas para
que el cliente vea qué otras formas existen antes de cerrar la decisión.

Cada una debe partir de una tesis distinta sobre qué ve primero el visitante.
Algunas vetas por si sirven de disparador, no estás obligado a usarlas:

- La garantía de cero depósito como titular absoluto
- El video de transformación ocupando la pantalla completa
- El eje del agente inmobiliario, no del propietario
- La prueba local: barrios reales de Ottawa, casas reales, resultados de venta
- La secuencia temporal, del primer día al día de la venta
- El costo de listar una casa sin prepararla, con enfoque editorial

Ocho direcciones en total: tres del Grupo A, cinco del Grupo B. Todas con el
mismo nivel de acabado.

## El video del hero

En el centro del hero (Grupo A) y donde corresponda en el Grupo B va un video de
renovación mostrando el antes y el después. Todavía no existe: se producirá
después, probablemente generado con IA.

Diséñalo como un contenedor de video en bucle, sin sonido, con reproducción
automática y un póster estático de respaldo. El contenedor debe aceptar tanto
16:9 como 9:16, porque el formato final aún no está decidido. Usa un marcador
construido con CSS, no una imagen.

## Animación

Es una parte importante del encargo y quiero que se note el nivel. Pautas:

- Anima solo `transform` y `opacity`, para que corra a 60fps.
- Curvas de salida suaves, tipo `cubic-bezier(0.16, 1, 0.3, 1)`. Nada de
  `linear` ni rebotes.
- Duraciones entre 400ms y 700ms para entradas. Micro interacciones entre 150ms
  y 250ms.
- Revelados al hacer scroll con `IntersectionObserver`, con escalonado de 60ms a
  80ms entre elementos hermanos. Que cada elemento aparezca una sola vez.
- Una secuencia de entrada orquestada en el hero al cargar la página. Un momento
  bien coreografiado vale más que veinte efectos sueltos.
- Contadores animados en las cifras (500+, 6 años, 24 horas) cuando entran en
  vista.
- Micro interacciones en hover con intención: elevación sutil, desplazamiento de
  flechas, cambio de estado en tarjetas. Nada que salte.
- Transiciones de estado suaves al abrir el menú y el modal de cotización.
- Respeta `prefers-reduced-motion` desactivando todo el movimiento no esencial.

Lo que no quiero: elementos que rebotan, giros completos, parpadeos, textos que
se escriben letra por letra, y animaciones que retrasen la lectura del contenido
principal.

## Referencias

Estas galerías sirven para calibrar el nivel visual esperado. Son colecciones
curadas, no plantillas para copiar:

- Awwwards, categoría arquitectura: https://www.awwwards.com/websites/architecture/
- Awwwards, sitios del día: https://www.awwwards.com/websites/sites_of_the_day/
- Web Excellence Awards, categoría renovación de hogar:
  https://we-awards.com/winner-category/website/home-renovation/
- Colección de sitios de remodelación:
  https://www.sitebuilderreport.com/inspiration/remodeling-websites

Si no puedes navegarlas, quédate con los patrones que las caracterizan y que sí
quiero ver aplicados:

- Espacio en blanco generoso y tipografía de gran escala con jerarquía clara
- La fotografía de obra como protagonista, no como decoración de fondo
- Señales de confianza visibles pronto: años de experiencia, número de proyectos,
  reseñas, garantías
- Retículas asimétricas, que rompen la monotonía de tres columnas iguales
- Movimiento al hacer scroll que acompaña la lectura en vez de interrumpirla
- Navegación simple con rutas de conversión evidentes

## Sobre el contenido de referencia

Existe un competidor canadiense, Prep'n Sell, que hace prácticamente el mismo
trabajo a escala nacional. Su sitio sirve como referencia del **alcance de
servicios y la arquitectura de información**, porque el negocio es equivalente.

Muy importante: **este cliente no se llama así y no debe parecerse a ellos.**

- No uses su nombre, ni sus lemas, ni sus frases registradas en ninguna parte.
- No copies su redacción. Escribe copy original desde cero.
- No imites su estética. Ellos son la referencia de qué servicios existen, no de
  cómo se ve un sitio.

La marca es Trusted Home Services, de Ottawa, y debe sonar y verse como ella
misma.

## Qué entregar por cada una de las ocho direcciones

1. Una maqueta navegable del home, con: barra de navegación y el menú de nueve
   servicios resuelto, el hero completo, el contenido del cuerpo y el modal de
   cotización.
2. Un nombre y una tesis en una sola frase.
3. El menú resuelto de verdad. Es una decisión central del encargo, no un detalle.
4. Ventajas y desventajas honestas. Incluye la desventaja real de cada una.

El modal de cotización debe abrir **desde todos** los botones de cotización de la
página, incluido el del header y el del menú móvil. Es un formulario de varios
pasos. Debe atrapar el foco del teclado, cerrarse con Escape y devolver el foco
al botón que lo abrió.

Al final entrega una página índice que enlace las ocho maquetas con enlaces que
funcionen, una tabla comparativa de las ocho, y tu recomendación argumentada:
cuál elegirías, por qué, y qué le tomarías prestado a las descartadas.

## Restricciones técnicas

- Un solo archivo HTML autocontenido por dirección. Todo el CSS y el JavaScript
  en línea.
- Sin recursos externos de ningún tipo: nada de CDNs, hojas de estilo remotas,
  scripts externos ni fuentes cargadas por URL. Una política de seguridad
  estricta los bloquea. Si necesitas una tipografía especial, incrústala como
  `@font-face` con data URI, o usa una pila de fuentes del sistema.
- Sin imágenes externas. Para las fotos usa marcadores construidos con CSS
  (degradados, formas) o SVG en línea. Las fotos reales las aporta el cliente.
- Responsive de verdad. Más de la mitad del tráfico de este sector llega desde
  el móvil, así que el diseño móvil no es una reducción del de escritorio, es una
  composición propia.
- Accesible: contraste suficiente, foco de teclado siempre visible, `alt`
  correcto, y respeto por `prefers-reduced-motion`.
- Copy real en inglés. Nada de texto de relleno.

## Qué evitar

- El aspecto de plantilla de contratista: foto de stock oscurecida con texto
  encima, tres iconos redondos y un botón naranja centrado.
- Los tics visuales de diseño generado: degradado morado a azul, fondos crema con
  serif y acento terracota, emojis como marcadores de sección, todo centrado,
  esquinas excesivamente redondeadas en todo, tarjetas con barrita de color a la
  izquierda.
- Que las ocho direcciones se parezcan entre sí. Si dos comparten la misma idea
  con otro color, una de las dos sobra.

## Antes de entregar

Haz esta comprobación tú mismo y confirma el resultado en tu respuesta:

1. Busca el carácter de guion largo en todos los archivos. No debe aparecer.
2. Abre cada maqueta y haz clic en cada botón de cotización, incluido el del
   header. Todos deben abrir el modal.
3. Abre la página índice y haz clic en los ocho enlaces. Ninguno debe dar error.
4. En las tres direcciones del Grupo A, confirma que el hero tiene contacto a la
   izquierda, video al centro y testimonios a la derecha.
5. Revisa cada maqueta a 390px de ancho y confirma que no hay desplazamiento
   horizontal.
6. Confirma que en el cuerpo del home no quedó ninguna parrilla con los nueve
   servicios.
7. Confirma que en ninguna maqueta dibujaste un logo. Solo debe haber un
   marcador neutro reservando el espacio.

Antes de escribir código, escribe un plan breve por dirección: color,
tipografía, retícula, tesis y qué hace su animación. Si alguno de esos planes se
parece a lo que producirías por defecto para cualquier empresa de reformas,
descártalo y reemplázalo.

=== FIN DEL PROMPT ===
