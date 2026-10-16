# Prompt para Claude Design: página nueva en formato extraíble

Antes de pegarlo, rellena el bloque `LA PÁGINA` con qué página quieres y qué debe
contener. Todo lo demás ya está verificado contra el código y no hay que tocarlo.

Por qué este prompt insiste tanto en el formato: la entrega anterior vino como
archivos `.dc.html` con un runtime propio, sintaxis de plantilla y estilos en
línea en cada elemento. Se veía bien en el navegador, pero pasar eso al proyecto
significaba reescribirlo entero. Lo de abajo pide el mismo diseño en una forma
que se puede levantar tal cual.

---

=== INICIO DEL PROMPT ===

Eres un diseñador web senior. Vas a entregar el diseño de una página para
Trusted Home Services, una empresa familiar de Ottawa que deja propiedades
listas para vender o para habitar.

Lo importante de este encargo es tan formato como diseño. El resultado lo va a
tomar un desarrollador para integrarlo en un proyecto React existente, así que
tiene que poder levantarse sin reescribirlo. Las reglas de entrega al final no
son sugerencias.

## LA PÁGINA

<!-- RELLENA ESTO -->
Página: [nombre de la página]
Para qué sirve: [qué debe lograr, a quién va dirigida]
Debe contener: [secciones o elementos obligatorios]
<!-- FIN DE LO QUE RELLENAS -->

## El proyecto donde va a vivir

Estos datos están verificados contra el código, úsalos tal cual.

**Stack:** React 19 con Vite 8 y CSS plano. Sin Tailwind, sin Next.js, sin
librerías de componentes. La animación disponible es Framer Motion 12 y anime.js.

**Tokens de color**, ya definidos en `:root`. Úsalos por nombre en tu CSS, no
escribas los hexadecimales sueltos:

```
--color-primary:      #0a233c   azul marino: cintas, encabezado, pie, títulos
--color-primary-dark: #0a1e3c   hover y degradados
--color-accent:       #F9772B   naranja: solo la acción principal de cada zona
--color-accent-hover: #e06a20
--color-text:         #2d3748
--color-text-muted:   #718096
--color-bg:           #ffffff
--color-bg-alt:       #f7fafc
--color-border:       #e2e8f0
--radius: 12px
--radius-lg: 20px
--shadow:    0 4px 24px rgba(10, 35, 60, 0.08)
--shadow-lg: 0 12px 48px rgba(10, 35, 60, 0.12)
--transition: 0.3s ease
```

El naranja es acento, no fondo. Resérvalo para el llamado a la acción principal
de cada zona. Si todos los botones son naranjas, deja de destacar el que importa.

**Tipografías ya cargadas:** Outfit para títulos, DM Sans para texto. No propongas
otras familias.

**Clases que ya existen y conviene reutilizar** en lugar de inventar equivalentes:
`.container` (ancho máximo 1120px, `.container--wide` 1280px), `.section`,
`.section-title`, `.section-intro`, `.btn`, `.btn-primary`, `.btn-secondary`.

**Navegación actual:** Home, Our Services (panel con nueve servicios), How We
Work, Our Projects, Work With Us (panel con For Realtors y Become a Partner),
Free Quote. El botón de cotización abre un diálogo flotante, no baja a ninguna
sección.

**Idiomas:** el sitio es trilingüe, inglés principal más francés y español. Tú
escribes el contenido en inglés canadiense, pero además lo entregas separado
según las reglas de abajo, porque tiene que acabar en el sistema de traducción.

**Datos reales del negocio:** teléfono (613) 204-8000, más de 500 casas
preparadas en seis años, sin depósito (se paga al terminar la obra, incluso en
proyectos de hasta $50,000), cotización dentro de 24 horas, cobertura Ottawa.

## Reglas de contenido

**Prohibido el guion largo.** Ese carácter que se usa como separador de frases
está vetado en todo lo que entregues: texto visible, comentarios y notas. Usa
punto, coma, dos puntos o paréntesis. Si una frase parece necesitarlo, casi
siempre conviene partirla en dos.

Evita también las muletillas de texto generado: frases de relleno, adjetivos
apilados sin contenido, estructuras de tres elementos repetidas sin parar, y
párrafos que podrían aplicar a cualquier empresa. El texto debe sonar a alguien
que conoce el oficio en Ottawa.

**El logo no se dibuja.** Es marca registrada del cliente. Reserva su espacio con
un rectángulo neutro rotulado, de proporción aproximada 3.6 a 1. No inventes un
símbolo sustituto.

**Sin fotografías.** Donde vaya una imagen, deja un marcador construido con CSS
(un degradado o una forma) con una nota de qué foto va ahí y en qué proporción.

## Cómo tiene que venir la entrega

Esta parte es la que decide si el trabajo sirve o hay que rehacerlo.

**Un solo archivo `.html`**, que se abra en el navegador dando doble clic y se
vea terminado. Nada de formatos de componente propios, ni runtimes, ni archivos
de apoyo, ni sintaxis de plantilla tipo llaves dobles o etiquetas de bucle.

**Todo el CSS en un único bloque `<style>`** en el `<head>`, escrito con clases
con nombre. **Cero atributos `style=` en el HTML.** Esta es la regla más
importante de todas: los estilos en línea no se pueden pasar a la hoja del
proyecto y obligan a reescribir el diseño entero. Si un elemento necesita un
estilo, dale una clase.

**Nombres de clase en minúscula con guiones**, agrupados por sección y siguiendo
la convención del proyecto, por ejemplo `.about-hero`, `.about-hero-inner`,
`.about-team-card`. Nada de nombres tipo utilidad como `.mt-4` o `.flex-center`.

**HTML semántico:** `header`, `main`, `section`, `article`, `nav`, `h1` a `h3` en
orden correcto, listas de verdad para lo que es una lista.

**Si hace falta interacción**, JavaScript plano en un único bloque `<script>` al
final del `<body>`, escrito de forma directa y con nombres claros. Sin librerías.
Descríbeme en un comentario qué hace, para poder pasarlo a React.

**Sin recursos externos de ningún tipo:** ni CDNs, ni fuentes por URL, ni scripts,
ni imágenes remotas. Una política de seguridad estricta los bloquea. Para las
tipografías usa una pila del sistema y anota cuáles son las reales.

**Responsive de verdad**, con las consultas de medios agrupadas al final del
bloque de estilos. Más de la mitad del tráfico llega desde el móvil.

**Accesible:** contraste suficiente, foco de teclado visible, `alt` correcto y
respeto por `prefers-reduced-motion`.

## Dos bloques extra al final del archivo

Después del `</html>`, en comentarios, incluye estas dos cosas.

**1. Mapa de la página.** Una lista de las secciones en orden, con la clase raíz
de cada una y una línea de qué hace. Ejemplo:

```
about-hero          Título, entradilla y foto. La foto va a la derecha en escritorio.
about-story         Dos columnas de texto sobre el origen del negocio.
about-team          Rejilla de tarjetas, una por persona.
```

**2. Todos los textos visibles**, listados como pares de clave y valor listos
para el sistema de traducción, agrupados por sección y en inglés. Ejemplo:

```
about.hero.title        We started with one van and a ladder
about.hero.intro        Six years later we have prepared more than 500 homes.
about.team.title        The people who show up
```

No hace falta que traduzcas al francés ni al español, de eso me encargo yo. Solo
necesito los textos separados del maquetado.

## Antes de entregar, comprueba

1. Busca en el archivo el carácter de guion largo. No debe aparecer ninguna vez.
2. Busca `style=` en el HTML. No debe aparecer ninguna vez.
3. Abre el archivo en el navegador y confirma que se ve terminado sin conexión.
4. Redúcelo a 390 px de ancho y confirma que no hay desplazamiento horizontal.
5. Confirma que no dibujaste ningún logo ni usaste ninguna imagen externa.
6. Confirma que los colores salen de los tokens y no hay hexadecimales sueltos
   fuera del bloque `:root`.

Antes de escribir código, describe en pocas líneas el planteamiento visual de la
página. Si se parece a lo que producirías por defecto para cualquier empresa de
reformas, deséchalo y propón otra cosa.

=== FIN DEL PROMPT ===
