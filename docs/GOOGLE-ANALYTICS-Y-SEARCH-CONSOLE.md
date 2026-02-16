# Google Analytics (GA4) y Google Search Console

## Diferencia entre los dos

| | **Google Analytics (GA4)** | **Google Search Console** |
|---|---------------------------|----------------------------|
| **Para qué** | Ver qué hace la gente en tu web (visitas, páginas, tiempo, conversiones). | Ver cómo te encuentra Google (búsquedas, clics, indexación). |
| **Dónde** | [analytics.google.com](https://analytics.google.com) | [search.google.com/search-console](https://search.google.com/search-console) |
| **Ejemplo** | “100 visitas hoy, 30 en la página de cotización.” | “Apareces en 50 búsquedas, 10 clics desde Google.” |

Son complementarios: Analytics = comportamiento en el sitio. Search Console = visibilidad en Google.

---

## 1. Google Analytics (GA4)

### Crear la propiedad
1. Entra en [analytics.google.com](https://analytics.google.com).
2. Crea una cuenta (o usa una existente) y una **propiedad** tipo “Web”.
3. Copia el **ID de medición** (formato `G-XXXXXXXXXX`).

### Añadirlo a tu sitio
En este proyecto ya está preparado el hueco en `index.html`. Solo tienes que:

1. Sustituir `G-XXXXXXXXXX` por tu ID real en `index.html` (busca ese texto).
2. Desplegar de nuevo en Vercel.

Con eso se medirán:
- Visitas y páginas vistas.
- Navegación (incluido `/#admin` si alguien entra al admin).
- Dispositivo y país (aproximado).

Si quieres **no** medir las visitas al admin (solo la web pública), se puede añadir una condición para no enviar datos cuando la URL lleve `#admin`.

---

## 2. Google Search Console

### Verificar el sitio
1. Entra en [search.google.com/search-console](https://search.google.com/search-console).
2. “Añadir propiedad” → URL del sitio (con dominio propio cuando lo tengas, ej. `https://tudominio.com`).
3. Verificación:
   - **Recomendado:** Método “Etiqueta HTML” (te dan un meta tag). Lo añades en el `<head>` de `index.html`, publicas y pulsas “Comprobar” en Search Console.
   - Alternativa: verificación por **DNS** en el registrador del dominio (TXT o CNAME que te indique Google).

### Después de verificar
- Envía el sitemap si tienes uno (ej. `https://tudominio.com/sitemap.xml`).
- Revisa “Rendimiento” para ver búsquedas, clics e impresiones.
- Opcional: en la misma cuenta de Google puedes tener Analytics y Search Console; no es obligatorio “enlazarlos” para que funcionen, pero en Search Console puedes vincular la propiedad de GA4 para ver datos de Analytics desde ahí.

---

## 3. Dominio propio (ej. Documino) y admin

Cuando compres el dominio y lo conectes en Vercel:

- **Web principal:** `https://tudominio.com`
- **Admin:** `https://tudominio.com/#admin`

El admin funciona igual: misma app, misma seguridad (token ADMIN_SECRET). Solo cambia la URL. No hace falta configuración extra para usar el admin con el dominio propio.

En Analytics y Search Console usarás la URL del dominio (ej. `https://tudominio.com`) como propiedad/URL del sitio.
