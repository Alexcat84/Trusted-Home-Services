# Paquete: diez versiones de la página principal

Todo lo necesario para pedirle a Claude Code diez versiones de la portada, cada
una con su SEO, y poder compararlas.

## Cómo usarlo

1. Abre una sesión de Claude Code en la carpeta del proyecto.
2. Copia el contenido de `PROMPT.md`, desde la marca de inicio hasta la de fin,
   y pégalo.
3. Deja esta carpeta accesible para que pueda leer los demás archivos, o
   adjúntalos.

## Qué hay aquí

| Archivo | Para qué sirve |
|---|---|
| `PROMPT.md` | El encargo. Es lo único que se pega. |
| `ESTADO-ACTUAL.md` | Qué existe hoy: arquitectura, mapa de archivos, paleta, huecos de SEO y avisos sobre el CSS. |
| `REGLAS-DEL-SITIO.md` | Las reglas del proyecto, copia de `docs/WEBSITE-RULES.md`. |
| `estado-home.html` | La portada actual renderizada, en un archivo que se abre solo. Trae el DOM y toda la hoja de estilos. |
| `estado-pagina-servicio.html` | Una de las nueve páginas de servicio, igual de autónoma. |
| `captura-home-inicio.png` | La portada actual, primer pantallazo. |
| `captura-home-completa.png` | La portada actual entera. |
| `captura-pagina-servicio.png` | Una página de servicio, que no se toca. |
| `captura-menu-servicios.png` | El panel de servicios abierto, difícil de ver en una captura normal. |

Los dos `.html` son instantáneas del sitio funcionando, no el código. Sirven para
ver el resultado sin levantar el proyecto, y para inspeccionar el marcado y los
estilos ya calculados. El código de verdad está en `src/`.

## Lo que el encargo pide

Diez versiones de la portada, cada una en su ruta de `/v1` a `/v10`, más una
página índice en `/versiones` para compararlas. Cada versión con su título,
descripción, Open Graph, canonical, hreflang y datos estructurados.

## Lo que el encargo protege

Cinco cosas quedan fijas en las diez versiones, porque ya están decididas:

- El hero de tres columnas: contacto, video, testimonios.
- Los servicios se acceden desde el menú, cada uno con su página.
- El logo no se redibuja.
- La cotización es un diálogo flotante.
- Las nueve páginas de servicio no se tocan.

## Nota sobre el SEO

El sitio actual va corto en esto, y es donde más se puede ganar. No hay Open
Graph, ni canonical, ni datos estructurados, y el sitemap sigue apuntando a
direcciones con `#` sin incluir las nueve páginas de servicio. El encargo pide
cubrir todo eso.
