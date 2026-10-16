# Correcciones y verificación para fable

Envía este documento a fable junto con tu prompt de diseño. Corrige datos
equivocados del prompt y le exige leer el código real antes de proponer nada.

Regla de redacción para todo lo que fable devuelva: prohibido el carácter de
guion largo. Se reemplaza con punto, coma, dos puntos o paréntesis.

---

## Mandato: lee el código, no confíes en valores dichos

El repositorio es público. Antes de proponer diseño, lee estos archivos de la
rama `main` y extrae los datos reales. No uses los valores que aparezcan en
ningún prompt sin verificarlos aquí primero.

Repositorio: `https://github.com/Alexcat84/Trusted-Home-Services` (rama `main`)

Archivos crudos que debes leer:

```
https://raw.githubusercontent.com/Alexcat84/Trusted-Home-Services/main/src/index.css
https://raw.githubusercontent.com/Alexcat84/Trusted-Home-Services/main/index.html
https://raw.githubusercontent.com/Alexcat84/Trusted-Home-Services/main/package.json
https://raw.githubusercontent.com/Alexcat84/Trusted-Home-Services/main/src/translations.js
https://raw.githubusercontent.com/Alexcat84/Trusted-Home-Services/main/src/App.jsx
```

De cada archivo extrae:

- `src/index.css`: los tokens de color reales (bloque `:root`), tipografías y la
  estructura del hero (`.hero-content--split` y las columnas `.hero-col`).
- `index.html`: la etiqueta `<meta name="theme-color">` y las fuentes cargadas.
- `package.json`: el stack real (framework, librerías, versiones).
- `src/translations.js`: el conjunto real de servicios y su copy en EN, FR y ES.
- `src/App.jsx`: cómo está armada hoy la homepage (hero, tarjetas de servicio,
  flujo de cotización, testimonios).

---

## Correcciones al prompt

El prompt que acompaña este documento contiene datos incorrectos. Estos son los
valores buenos, cada uno verificable en el archivo indicado.

### 1. Paleta

El prompt dice que el color primario es el naranja `#EA580C`. Es incorrecto en
dos cosas.

- El primario real es el **navy `#0a233c`**. El naranja es **acento**, no
  primario. Verifícalo en `src/index.css`, bloque `:root`:
  `--color-primary: #0a233c` y `--color-accent: #F9772B`.
- El naranja de marca es **`#F9772B`**, no `#EA580C`. El valor `#EA580C` es solo
  la etiqueta `theme-color` del `<meta>` en `index.html` (color de la barra del
  navegador en móvil), no el color de la marca. No lo uses como acento.

Paleta correcta a respetar:

```
--color-primary:      #0a233c   navy, cintas, header, footer, títulos
--color-primary-dark: #0a1e3c   hover y gradientes
--color-accent:       #F9772B   naranja, solo para la acción principal de cada zona
--color-accent-hover: #e06a20
--color-text:         #2d3748
--color-text-muted:   #718096
--color-bg-alt:       #f7fafc
```

El dueño quiere que el naranja se note, pero como acento con disciplina, no como
fondo. Hoy el sitio lo pone en todos los botones a la vez y por eso pierde
fuerza. Resérvalo para el llamado a la acción principal.

### 2. Stack técnico

El prompt dice "Next.js + Tailwind". Es incorrecto. Verifica `package.json`: el
sitio es **React 19 + Vite 8 + CSS plano**, con **Framer Motion** para animación.
No hay Next.js ni Tailwind. Diseña pensando en ese stack, porque el resultado se
implementa dentro de ese código.

### 3. Lista de servicios

La lista buena es la nuestra, no la del prompt. Son nueve:

1. Painting & Coatings
2. Curb Appeal
3. Decluttering & Removal
4. Home Staging
5. Flooring
6. Cleaning
7. Handyman (absorbe drywall, masilla, carpintería menor y luminarias)
8. Electrical (nuevo)
9. Home Inspection (nuevo)

Al leer `src/translations.js` vas a encontrar ocho claves actuales: `paint`,
`repair`, `curb`, `declutter`, `staging`, `flooring`, `clean`, `handyman`.
Reconcílialo así:

- `repair` ("Repairs & preparation") **desaparece como tarjeta propia**: su
  contenido se absorbe dentro de Handyman. No lo trates como servicio separado.
- `Electrical` y `Home Inspection` son **nuevos**, todavía no están en el código.
  Créalos siguiendo el mismo patrón de los demás.
- Los otros siete ya existen: usa su copy EN, FR y ES de `translations.js` como
  base y mejóralo, no lo reinventes desde cero.

### 4. El logo no se toca

El logo es la marca registrada del cliente. No lo redibujes, no lo simplifiques
a un icono, no inventes un símbolo. El archivo oficial está en el repo:
`public/images/Logo v4.0 Inverted.jpg`, y se usa a 76px de alto con ancho
automático. En las maquetas, donde no puedas cargar imágenes, reserva su espacio
con un marcador neutro rotulado, de proporción aproximada 3.6 a 1. Nunca dibujes
un logo sustituto.

---

## Preguntas que debes responder leyendo el código

Antes de proponer las tres opciones, responde estas preguntas citando lo que
encontraste en el código. No las respondas de memoria ni desde el prompt.

1. **Hero.** ¿Cómo está estructurado hoy el hero en `src/index.css` y
   `src/App.jsx`? Describe las columnas de `.hero-content--split` y qué va en
   cada una. Tu diseño debe conservar esa estructura de tres zonas (contacto,
   pieza visual central, testimonios), no inventar otra.

2. **Pieza central.** ¿Qué hay reservado hoy en la columna central del hero?
   El cliente aún no decidió si será un video de renovación o un antes y después
   interactivo con revelado tipo brochazo. Diseña el contenedor central para que
   soporte ambos: un slot de video en bucle sin sonido, o una máscara de brocha
   que revela el "after". Debe funcionar en 16:9 y en 9:16.

3. **Servicios.** ¿Cómo se muestran hoy los servicios en `src/App.jsx`?
   El modelo objetivo es: cada servicio tiene su propia página dedicada, y la
   homepage muestra tarjetas de preview que enlazan a esas páginas. Propón la
   plantilla única de la página de servicio (hero propio, qué incluye, antes y
   después, beneficios, mini proceso, FAQ corta, CTA).

4. **Cotización.** ¿Cómo funciona hoy el envío de cotización en `src/App.jsx`
   (formulario, pasos, modal)? El CTA "Get a Free Quote" debe abrir un modal
   flotante desde cualquier botón de la página, incluido el del header. Nunca un
   ancla al final de la página. El modal atrapa el foco, cierra con Escape y
   devuelve el foco al botón que lo abrió.

5. **Idiomas.** El sitio es trilingüe (EN principal, FR, ES). Confirma en
   `translations.js` cómo está organizado el copy y respeta ese sistema. No
   escribas cadenas sueltas fuera de él.

---

## Lo que sí decide el prompt (no está en el código)

Estas son decisiones de dirección del prompt, no de código, y están bien:

- Tres opciones de homepage distintas entre sí (Editorial Premium, Bold Local
  Pro, Split Interactive).
- Copy en inglés canadiense, audiencia doble (homeowners y realtors).
- La estructura conceptual inspirada en el competidor, parafraseada, nunca
  copiada, y sin usar su nombre ni sus textos.
- Trust signals visibles: 500+ homes prepared, free quote, no deposit, cobertura
  Ottawa, teléfono (613) 204-8000.
- Proceso en tres pasos.

## Antes de entregar

- Confirma que ningún archivo contiene el carácter de guion largo.
- Confirma que la paleta que usaste es navy primario `#0a233c` y naranja acento
  `#F9772B`, no `#EA580C`.
- Confirma que no dibujaste ningún logo, solo el marcador neutro.
- Cita, al inicio de tu respuesta, los valores reales que extrajiste del código
  (paleta, stack, servicios), para dejar claro que los verificaste.
