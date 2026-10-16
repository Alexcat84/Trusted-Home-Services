# Corrección de la entrega de las diez versiones

Pega todo lo que está bajo la marca de inicio en la misma conversación que
entregó las diez páginas.

Contexto de la verificación: las diez se renderizaron en Chrome headless a
1440x1000 y a 390x844, y se midieron el marcado, los encabezados y el reparto
entre el bloque de estilos y los atributos en línea.

---

=== INICIO DEL PROMPT ===

Verifiqué las diez versiones renderizándolas y midiendo el marcado. El diseño y
el SEO están bien. El formato de entrega no sirve para integrarlas, y hay un
defecto de marcado que contradice el objetivo del encargo. Hay que rehacer la
entrega, no el diseño.

## Lo que está bien y no hay que rehacer

Conserva esto tal cual:

- **Las diez propuestas visuales.** Se ven bien y se diferencian entre sí.
- **La cabeza de SEO.** Los títulos miden entre 51 y 59 caracteres, que es el
  rango correcto. Están el canonical, los `hreflang` en-ca, fr-ca y x-default,
  el Open Graph completo y el JSON-LD. Eso está bien resuelto.
- **El sitemap**, con `hreflang` por dirección.
- **Sin guion largo, sin emoji, sin recursos externos** aparte de las fuentes.
- **Sin desplazamiento horizontal a 390 px.**
- La lista de lo que hay que sustituir al integrar. Es útil y correcta.

## Defecto 1: no hay encabezados

Este es el más grave, porque el encargo era optimizar para buscadores y el
marcado dice lo contrario.

Medido en las diez: **ninguna tiene un solo `<h1>`**. Los titulares están
escritos como `div` con un tamaño de fuente grande. Peor todavía en algunos
casos:

```
v1-reposo        1 <h2>, 1 <h3>, ningún <h1>
v5-fichas        1 <h3>, ningún <h1>, ningún <h2>
v8-prueba        1 <h2>, 1 <h3>, ningún <h1>
```

Una página cuya promesa es posicionar no puede empezar su jerarquía en `h3`. Un
buscador lee la estructura de encabezados para entender de qué trata la página,
y aquí no hay estructura que leer.

Corrige en las diez:

- Un `<h1>` y solo uno, que sea el titular principal del hero.
- Cada sección abre con un `<h2>`. Las subdivisiones dentro de una sección usan
  `<h3>`.
- La jerarquía no salta niveles.
- Los nombres de los nueve servicios en las tarjetas son encabezados, no `div`.
- El tamaño visual se controla con CSS. El nivel del encabezado lo decide el
  significado, no la apariencia.

Mientras estás ahí: usa `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>` y
`<article>` donde corresponda. Ahora mismo casi todo son `div`.

## Defecto 2: el diseño vive en atributos style

Medido por archivo: el bloque `<style>` ocupa 1.114 caracteres, y son el mismo
reset repetido en las diez. Los atributos `style=` de las etiquetas suman entre
5.200 y 6.000 caracteres por archivo, con entre 66 y 90 apariciones.

Es decir, prácticamente todo el diseño está en línea. Eso no se puede llevar a la
hoja de estilos del proyecto: obliga a reescribir cada página a mano, que es
justo lo que la entrega debería evitar.

Corrige en las diez:

- **Cero atributos `style=` en el HTML.** Sin excepciones.
- Todo el CSS en un único bloque `<style>` en el `<head>`, con clases con nombre.
- Nombres en minúscula con guiones, agrupados por sección, del estilo
  `.v3-hero`, `.v3-hero-inner`, `.v3-service-card`. Nada de nombres de utilidad
  tipo `.mt-4` ni `.flex-center`.
- **Prefija las clases de cada versión con su número**, para que las diez puedan
  convivir en un mismo proyecto sin pisarse.
- Usa variables CSS para los colores, declaradas una vez en `:root`, en lugar de
  repetir el hexadecimal en cada regla:

```css
:root {
  --color-primary: #0a233c;
  --color-primary-dark: #0a1e3c;
  --color-accent: #F9772B;
  --color-accent-hover: #e06a20;
  --color-text: #2d3748;
  --color-text-muted: #718096;
  --color-bg: #ffffff;
  --color-bg-alt: #f7fafc;
  --color-border: #e2e8f0;
}
```

- Las consultas de medios, agrupadas al final del bloque.

## Defecto 3: falta el mapa para integrarlas

Añade al final de cada archivo, después de `</html>` y dentro de un comentario,
dos bloques.

**Uno.** Las secciones en orden, con su clase raíz y una línea de qué hace cada
una:

```
v3-hero            Hero de tres columnas: contacto, video, testimonios.
v3-services        Rejilla de nueve tarjetas que enlazan a cada servicio.
v3-process         Los tres pasos del proceso.
```

**Dos.** Todos los textos visibles como pares de clave y valor, agrupados por
sección y en inglés, listos para el sistema de traducción:

```
v3.hero.title        Your listing, market ready
v3.hero.subtitle     Smart fixes, clean execution, a smoother sale.
v3.services.title    Everything your home needs before it sells
```

No traduzcas al francés, de eso me encargo yo. Solo necesito los textos
separados del maquetado.

## Lo que no cambia

Sigue valiendo todo lo del encargo original:

- El hero de tres columnas no se mueve: contacto izquierda, video centro,
  testimonios derecha. En móvil, ese mismo orden en vertical.
- Los nueve servicios se acceden desde el menú y cada uno tiene su página. La
  portada solo da acceso.
- El logo no se redibuja. Rectángulo punteado con proporción 3.6 a 1.
- La cotización es un diálogo flotante. Los enlaces pueden seguir apuntando a
  `#quote`, se conectan al integrar.
- Paleta canónica: marino y naranja, sin un tercer color de marca. El naranja se
  usa una vez por zona, para la acción principal.
- Outfit para títulos, DM Sans para texto.
- Sin guion largo, sin emoji.
- Un archivo autónomo por versión, sin recursos externos aparte de las fuentes.

## Antes de entregar, comprueba y dime el resultado

1. `grep -c "style=" archivo` en cada uno. Debe dar cero.
2. Cuenta los `<h1>` de cada página. Debe dar exactamente uno.
3. Recorre los encabezados de cada página en orden y confirma que no saltan
   niveles.
4. Busca el guion largo en los diez. No debe aparecer.
5. Abre cada archivo en el navegador y confirma que se ve igual que antes de
   mover los estilos. El aspecto no debe cambiar: esto es una corrección de
   marcado, no un rediseño.
6. Redúcelos a 390 px y confirma que no hay desplazamiento horizontal.
7. Confirma que los colores salen de las variables y no quedan hexadecimales
   sueltos fuera de `:root`.

=== FIN DEL PROMPT ===
