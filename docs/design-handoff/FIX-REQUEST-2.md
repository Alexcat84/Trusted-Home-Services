# Corrección del batch 2

Pega todo lo que está bajo la marca de inicio en la misma conversación del batch 2.
Adjunta también el archivo `docs/WEBSITE-RULES.md`.

Verificación previa: los seis prototipos se renderizaron en Chrome headless
(Playwright) a 1440x1000, con clic aislado en carga limpia sobre cada botón de
cotización y sobre los enlaces del hub.

---

=== INICIO DEL PROMPT ===

Verifiqué el batch 2 renderizando los seis prototipos en Chrome y haciendo clic
sobre cada control. Adjunto el documento de reglas del sitio. A partir de ahora
ese documento manda sobre cualquier criterio de diseño.

## Lo que sí quedó corregido

- Los enlaces del hub ya apuntan a los archivos reales y no dan 404.
- El modal de cotización abre desde todos los botones en las seis direcciones
  (verificado uno por uno: 4/4, 4/4, 5/5, 2/2, 2/2, 4/4).
- Las seis direcciones están entregadas y son tesis distintas entre sí.

Nada de eso hay que tocarlo.

## Fallo 1: el guion medio está por todas partes

El documento de reglas adjunto lo prohíbe en su primera regla, que es la más
importante para este cliente. Conteo actual del carácter `—` en el batch 2:

```
README.md ........................ 37
00-directions-hub.dc.html ........ 17
06-the-local.dc.html ............. 13
04-two-doors.dc.html .............. 8
05-the-sequence.dc.html ........... 8
02-the-transformation.dc.html ..... 7
03-the-concierge.dc.html .......... 6
01-the-promise.dc.html ............ 3
```

De esos, entre 5 y 8 por página son texto visible en pantalla. Ejemplos reales
tomados de los prototipos:

- "No deposit — you pay when it's complete"
- "Painters, cleaners, inspectors — all handled"
- "We prep, stage and verify your listings fast — reliable work, one invoice"
- "same nine trades, same no-deposit promise" precedido de guion medio

Elimina el carácter `—` de todos los archivos, incluido el README. Reescribe esas
frases con puntuación normal: punto, coma, dos puntos o paréntesis. No lo
sustituyas por `–` ni por ` - `, que es el mismo problema disfrazado. En varios
casos la frase mejora si se parte en dos.

Revisa también el resto del texto buscando muletillas de IA: frases de relleno,
adjetivos apilados sin contenido, y estructuras de tres elementos repetidas. El
texto tiene que sonar a alguien que conoce el oficio en Ottawa.

## Fallo 2: cinco de seis direcciones rompen la estructura del hero

Esta era una restricción del brief original y no es negociable. El cliente ya
decidió qué va en cada columna. Lo único que se propone es cómo se presenta, no
dónde va.

```
IZQUIERDA          CENTRO                    DERECHA
contacto:          video antes y después     testimonios
cotización,        en bucle, sin sonido,     rotativos
teléfono,          16:9 y 9:16
sello y
cero depósito
```

Estado real de cada dirección:

| Dirección | Cumple | Qué hace en su lugar |
|---|---|---|
| 01 The Promise | no | Dos columnas. Titular a la izquierda, video a la derecha, testimonio flotando encima del video |
| 02 The Transformation | **sí** | Contacto izquierda, video centro, testimonios derecha. Es la referencia correcta |
| 03 The Concierge | no | Dos columnas. Titular izquierda, video derecha. Sin testimonios en el hero |
| 04 Two Doors | no | Dos tarjetas grandes. Sin video y sin testimonios en el hero |
| 05 The Sequence | no | Dos columnas, sin testimonios en el hero |
| 06 The Local | no | Dos columnas, sin testimonios en el hero |

Toma la distribución de **02 The Transformation** como el patrón obligatorio y
aplícala a las seis. La identidad de cada dirección se expresa con tipografía,
color dentro de la paleta, fondo, jerarquía, densidad, forma de las tarjetas y
animación de entrada. No moviendo los bloques de sitio.

En móvil el orden vertical es contacto, video, testimonios.

## Fallo 3: los servicios siguen apareciendo como tarjetas en el home

En las seis direcciones los nueve servicios están listados en el cuerpo de la
página. Eso es exactamente lo que se quiere quitar, porque es lo que ya existe
hoy y el cliente pidió cambiarlo.

Los nueve servicios se acceden **desde el menú de navegación**, cada uno con su
propia página. El home puede decir que son nueve trabajos coordinados por un solo
contacto, pero sin desplegar el catálogo.

Quita del cuerpo del home las parrillas de tarjetas, el trades board de
Concierge, los listados por etapa y cualquier otra enumeración de los nueve. Todo
eso se resuelve dentro del menú, que ya está bien construido en las seis
direcciones y es donde debe vivir.

El espacio que se libera es una oportunidad: úsalo para lo que sí diferencia a
cada dirección (proyectos reales, proceso, prueba social, cobertura en Ottawa).

## Al cerrar

- Actualiza el README para que refleje lo que el código hace de verdad, y sin el
  carácter prohibido.
- Mantén la tabla comparativa de las seis y tu recomendación.
- Antes de entregar, ejecuta esta comprobación y confirma que no devuelve nada:

```bash
grep -rn "—" .
```

- Vuelve a abrir cada prototipo y confirma a ojo que las tres columnas del hero
  están en su sitio y que en el cuerpo del home ya no hay listados de servicios.

Se mantienen las restricciones técnicas: un archivo autocontenido por dirección,
sin recursos externos, sin imágenes, copy real en inglés, responsive, accesible,
y la paleta `#0a233c` con acento `#F9772B` intacta.

=== FIN DEL PROMPT ===
