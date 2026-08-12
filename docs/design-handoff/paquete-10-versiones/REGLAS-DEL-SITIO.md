# Reglas del sitio Trusted Home Services

Documento de referencia obligatorio. Aplica a todo el que trabaje en este sitio:
personas, herramientas de diseño y asistentes de IA. Cualquier propuesta que
incumpla una de estas reglas se devuelve sin revisar el resto.

Última actualización: 20 de julio de 2026

---

## 1. Lenguaje natural, cero rastros de IA

**Regla número uno y la más importante.**

### Prohibido el guion medio (—)

No se usa el carácter `—` (guion largo o "em dash") en ningún texto visible del
sitio, ni en documentación, ni en comentarios de código, ni en textos de commits.
Tampoco el guion medio corto `–` ("en dash") como separador de frases.

En su lugar se usan recursos normales de puntuación: coma, punto, dos puntos,
punto y coma, o paréntesis. Si una frase necesita un guion largo para funcionar,
casi siempre significa que conviene partirla en dos frases.

| En vez de esto | Escribir esto |
|---|---|
| Sin depósito — pagas al terminar | Sin depósito. Pagas al terminar. |
| Nueve servicios — un solo contacto | Nueve servicios con un solo contacto |
| Ottawa — 500+ casas en 6 años | Ottawa, 500+ casas en 6 años |

El guion corto normal (`-`) sí se permite donde corresponde de verdad: palabras
compuestas (market-ready), números de teléfono, rangos, y nombres de archivo.

> Nota: este archivo es el único del proyecto donde el carácter prohibido aparece
> a propósito, porque no se puede enunciar la regla sin mostrarlo. Las cinco
> apariciones están en el título de esta sección, en la frase que lo define y en
> la columna de ejemplos incorrectos de la tabla de arriba.

Para revisar el resto del proyecto antes de publicar:

```bash
grep -rn "—" src/ docs/ public/ --include="*.jsx" --include="*.js" \
  --include="*.css" --include="*.md" --include="*.html"
```

Lo esperado es que no devuelva nada.

### Otros rastros de IA que no queremos

- Frases de relleno tipo "en el mundo actual", "no es solo X, es Y",
  "sumérgete en", "desbloquea el potencial", "eleva tu".
- Estructuras de tres elementos repetidas hasta el cansancio.
- Emojis usados como viñetas o marcadores de sección.
- Adjetivos vacíos apilados: "innovador, robusto y potente".
- Texto que suena a folleto corporativo genérico y podría aplicar a cualquier
  empresa. Si el texto no menciona algo concreto de este negocio, sobra.

El sitio vende trabajo manual real en casas reales de Ottawa. El texto debe sonar
a una persona que conoce el oficio, no a un generador de contenido.

---

## 2. La estructura del hero está cerrada

El bloque principal (hero) tiene tres columnas con contenido y posición ya
decididos por el cliente. **Las ubicaciones no se mueven.** Lo único que se
puede proponer es cómo se ven, no dónde van.

| Columna | Contenido fijo |
|---|---|
| **Izquierda** | Contacto: botón de cotización, teléfono (613) 204-8000, sello de garantía de calidad y la promesa de cero depósito |
| **Centro** | Video de renovación antes y después, en bucle, sin sonido, con póster de respaldo. Debe funcionar en horizontal (16:9) y en vertical (9:16) |
| **Derecha** | Testimonios de clientes, rotativos |

Se puede cambiar libremente: tipografía, colores dentro de la paleta, tamaños,
espaciados, bordes, sombras, fondo, animación de entrada, y cómo se agrupa el
contenido dentro de cada columna.

No se puede: mover el video a un lado, poner los testimonios flotando sobre el
video, convertirlo en dos columnas, ni eliminar ninguna de las tres zonas.

En móvil el orden vertical es: contacto, video, testimonios.

---

## 3. Los servicios viven en el menú, no en el home

Los nueve servicios tienen cada uno su propia página con URL indexable
(`/services/painting`, no `#painting`). Se llega a ellos **desde el menú de
navegación**.

El home **no** lleva una parrilla de tarjetas con los nueve servicios. Eso es lo
que había antes y es justo lo que se quiere quitar. El home puede mencionar que
existen nueve servicios y que todo se coordina desde un solo contacto, pero sin
convertirse en un catálogo.

Los nueve servicios:

1. Painting & Coatings
2. Curb Appeal
3. Decluttering & Removal
4. Home Staging
5. Flooring
6. Cleaning
7. Handyman (absorbe drywall, masilla, carpintería menor y luminarias)
8. Electrical (nuevo)
9. Home Inspection (nuevo)

La categoría antigua "Repairs & preparation" queda eliminada por ser redundante
con Handyman.

---

## 4. El logo es intocable

El logo es la marca y no se modifica nunca. Ni el dibujo, ni los colores, ni la
tipografía que lo compone, ni las proporciones.

Archivo oficial: `public/images/Logo v4.0 Inverted.jpg`, usado a 76px de alto con
ancho automático en el encabezado.

No se permite: redibujarlo, simplificarlo a un icono, sustituirlo por un
símbolo geométrico, separar el texto del emblema, recolorearlo, aplicarle
degradados, sombras, contornos ni animaciones que lo deformen.

En maquetas donde no se puedan cargar imágenes, se reserva el espacio con un
marcador neutro de las proporciones correctas, identificado como logo. **No se
inventa un logo sustituto.** Dibujar una marca provisional es lo mismo que
cambiar la marca, y ya ocurrió una vez: una tanda de prototipos reemplazó el
logo por un triángulo naranja con texto al lado. Eso no se acepta.

Lo único ajustable es el tamaño al que se muestra, siempre conservando la
proporción original y respetando un área de respeto libre a su alrededor.

---

## 5. Identidad visual

La paleta no se cambia. Al cliente le gustan sus colores.

```
--color-primary:      #0a233c   azul marino oscuro, cintas, header, footer
--color-primary-dark: #0a1e3c   hover y gradientes
--color-accent:       #F9772B   naranja, CTAs y acentos
--color-accent-hover: #e06a20
--color-text:         #2d3748
--color-text-muted:   #718096
--color-bg-alt:       #f7fafc
```

Tipografías actuales: Outfit para títulos, DM Sans para texto.

El naranja es un acento, no un color de fondo. Si todos los botones de la
pantalla son naranjas, deja de destacar el que importa. Se reserva para la acción
principal de cada zona.

---

## 6. Contenido que siempre debe estar presente

- La promesa de cero depósito, con peso real. Es el diferenciador más fuerte del
  negocio: se paga al terminar, incluso en proyectos de hasta $50,000.
- El dato de más de 500 casas preparadas en 6 años.
- El teléfono (613) 204-8000, accesible sin hacer scroll.
- El selector de idioma EN / FR / ES en la navegación.
- Recorridos claros para los dos públicos: propietarios que venden, y agentes
  inmobiliarios.

---

## 7. Idiomas

El sitio es trilingüe: inglés (principal), francés y español. Todo texto visible
pasa por el sistema de traducción. No se escriben cadenas sueltas dentro de los
componentes.

El esquema de i18n sigue el modelo modular: un archivo por superficie, con
funciones tipo `getXxxUiMessages(locale)` y respaldo al idioma por defecto.

---

## 8. Rendimiento

Las imágenes se sirven optimizadas. A la fecha de este documento hay archivos de
5.8 MB en `public/images`, lo cual es inaceptable: más de la mitad del tráfico de
este sector llega desde el móvil.

Regla práctica: ninguna imagen del sitio supera los 300 KB. Formato WebP o AVIF,
redimensionada al tamaño real en que se muestra.

---

## 9. Accesibilidad

- Contraste suficiente en texto y controles.
- Foco de teclado siempre visible.
- El modal de cotización atrapa el foco, se cierra con Escape y devuelve el foco
  al botón que lo abrió.
- Se respeta `prefers-reduced-motion`.
- Toda imagen decorativa lleva `alt` vacío. Toda imagen informativa lleva
  descripción real.

---

## 10. Comportamiento de la cotización

El botón de cotización abre un modal flotante sobre el contenido, desde cualquier
punto del sitio. No lleva al usuario al final de la página.

Todos los botones de cotización de la página deben abrir ese mismo modal. Si un
botón dice "cotización" y no hace nada, es un error, no una decisión de diseño.

---

## 11. Sobre la documentación

Cualquier documento que describa lo que hace el código debe describir lo que el
código hace de verdad. Si algo queda sin implementar a propósito, se dice
explícitamente. No se documenta como funcional algo que no se probó.
