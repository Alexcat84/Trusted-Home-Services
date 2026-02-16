# Despliegue en Vercel + Formularios + Móvil

## Parte 1: Subir el proyecto a Vercel

### Qué necesitas
- Cuenta en [Vercel](https://vercel.com) (gratis).
- Proyecto en **Git** (recomendado: GitHub, GitLab o Bitbucket) para despliegue automático en cada push.

### Pasos

1. **Inicializar Git y subir a GitHub** (si aún no lo has hecho)
   - Abre terminal en la carpeta del proyecto y ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Trusted Home Services"
   ```
   - Crea un repositorio nuevo en GitHub (sin README, sin .gitignore).
   - Conecta y sube:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git branch -M main
   git push -u origin main
   ```

2. **Conectar el proyecto con Vercel**
   - Entra en [vercel.com](https://vercel.com) e inicia sesión (puedes usar “Continue with GitHub”).
   - Clic en **Add New…** → **Project**.
   - Importa el repositorio de GitHub donde subiste el código.
   - Vercel detectará que es un proyecto **Vite**: el **Build Command** será `npm run build` y el **Output Directory** `dist`. No hace falta cambiar nada si ya tienes `vercel.json` en el proyecto.
   - Clic en **Deploy**. En unos minutos tendrás una URL tipo `https://tu-proyecto.vercel.app`.

3. **Variables de entorno (formularios)**  
   Si configuras Formspree (ver Parte 2), en **Project → Settings → Environment Variables** añade:
   - `VITE_FORMSPREE_REALTOR` = ID del formulario para real estate.
   - `VITE_FORMSPREE_QUOTE` = ID del formulario para free quote.  
   Luego haz un **Redeploy** para que se apliquen.

---

## Parte 2: Almacenar y ver los formularios (Real Estate + Free Quote)

Ahora mismo los formularios **no guardan** los datos en ningún sitio; solo muestran un mensaje de éxito en pantalla. Para almacenarlos y poder verlos (incluso desde el móvil), hay dos caminos:

### Opción A: Formspree (rápido, recomendado para empezar)

- **Qué es:** Servicio que recibe el envío del formulario, lo guarda y te deja ver las respuestas en un panel web (accesible desde el móvil).
- **Pasos:**
  1. Entra en [formspree.io](https://formspree.io) y crea una cuenta.
  2. Crea **dos formularios**:
     - Uno para **Real Estate** (Get in touch – realtor).
     - Otro para **Free Quote** (cotización).
  3. En cada formulario, copia el **Form ID** (la parte final de la URL, ej. `https://formspree.io/f/xyzabc` → ID = `xyzabc`).
  4. En Vercel, en **Settings → Environment Variables**, añade:
     - `VITE_FORMSPREE_REALTOR` = ID del formulario de real estate.
     - `VITE_FORMSPREE_QUOTE` = ID del formulario de free quote.
  5. Redeploy del proyecto en Vercel.
- **Ver envíos:** En Formspree, en “Submissions” verás todos los envíos. Puedes entrar desde el navegador del móvil y consultarlos cuando quieras.

### Opción B: Backend propio (más adelante)

- **Qué es:** Una API (por ejemplo con Vercel Serverless Functions) que guarde en una base de datos (Vercel Postgres, Supabase, etc.) y, si quieres, una pequeña app o panel (web o móvil) que liste los envíos.
- **Cuándo:** Si más adelante necesitas lógica muy específica, integración con CRM o una app móvil nativa que lea solo tus datos.

---

## Parte 3: Optimización para móviles

### Qué ya tienes hecho

- **Viewport:** `index.html` tiene `<meta name="viewport" content="width=device-width, initial-scale=1.0">` ✅  
- **CSS responsive:** Hay media queries para:
  - `max-width: 768px` (tablets y móviles).
  - `max-width: 560px` (móviles pequeños).  
  Navegación, hero, secciones, formularios y footer se adaptan a pantallas pequeñas ✅  
- **Contenedores:** Uso de `max-width`, `min-width` y márgenes para que el contenido no se estire demasiado en pantallas grandes ✅  

Con eso, **la página ya está optimizada para móviles** en cuanto a layout y visual.

### Recomendaciones adicionales (opcional)

1. **Probar en dispositivos reales**  
   Abre la URL de Vercel en el móvil y comprueba: menú, formularios, botones y enlaces.

2. **Tamaño de toques**  
   Los botones y enlaces ya tienen padding suficiente; si algo se siente pequeño al tocar, se puede subir un poco el `min-height` / `padding` en esos elementos.

3. **Formularios en móvil**  
   Los campos son aptos para teclado en pantalla; el flujo del wizard de cotización ya funciona en pantallas pequeñas.

4. **PWA (opcional)**  
   Si más adelante quieres “añadir a la pantalla de inicio” y algo de uso offline, se puede añadir un `manifest.json` y un service worker; no es necesario para el primer despliegue.

---

## Resumen paso a paso

| Paso | Acción |
|------|--------|
| 1 | Crear cuenta en Vercel (y en GitHub si no tienes repo). |
| 2 | `git init` → `git add .` → `git commit` → crear repo en GitHub → `git remote add origin` → `git push`. |
| 3 | En Vercel: Add New → Project → importar repo → Deploy. |
| 4 | (Opcional) Formspree: crear 2 formularios, copiar IDs, añadir `VITE_FORMSPREE_REALTOR` y `VITE_FORMSPREE_QUOTE` en Vercel → Redeploy. |
| 5 | Revisar la web en el móvil usando la URL de Vercel. |

Si quieres, en el siguiente paso podemos configurar juntos los IDs de Formspree en el código o revisar algún punto concreto del despliegue.
