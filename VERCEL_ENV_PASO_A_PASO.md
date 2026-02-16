# Variables de entorno en Vercel – paso a paso

Tienes dos formas de añadirlas: **una por una** en la pantalla de “New Project” (o después en Settings), o **pegando el contenido de un .env**. Aquí va todo al detalle.

---

## Opción A: Añadir variables una por una (recomendado la primera vez)

### 1. En la pantalla "New Project" (donde estás ahora)

1. **Quita la variable de ejemplo**  
   Borra `EXAMPLE_NAME` / `I9JU23NF394R6HH` (el botón "-" al lado del valor).

2. **Pulsa "+ Add More"** y añade cada variable con su valor:

   | Key | Value (tú lo rellenas) |
   |-----|------------------------|
   | `ADMIN_SECRET` | Una contraseña larga que solo tú sepas. Es la “llave” del panel `/#admin`. |
   | `DATABASE_URL` | (Opcional) Si usas Prisma: URL de Postgres (Vercel Postgres o Supabase). Sin esto, puedes usar KV. |
   | `RESEND_API_KEY` | (Opcional) Para recibir un email por cada envío. Crea la key en [resend.com](https://resend.com/api-keys). |
   | `ADMIN_EMAIL` | (Opcional) Tu correo donde recibir los avisos de envíos. |

3. **KV (si no usas DATABASE_URL)**  
   `KV_REST_API_URL` y `KV_REST_API_TOKEN` **no** las pongas todavía en esta pantalla.  
   Las añadirá Vercel solo cuando crees la base KV y la conectes al proyecto (pasos más abajo).

4. **Deploy**  
   Pulsa **Deploy**. El sitio saldrá a producción; los formularios y el panel admin funcionarán cuando añadas KV (y, si quieres, Formspree como respaldo).

---

## Opción B: Pegar el contenido de un .env

Sirve si ya tienes todos los valores y quieres pegarlos de una vez.

### 1. Crear el .env solo en tu PC (nunca subirlo a Git)

En la carpeta del proyecto (junto a `package.json`) crea un archivo llamado **`.env`** (con el punto delante) y pon algo así, **sustituyendo los valores** por los tuyos:

```env
ADMIN_SECRET=tu_contraseña_secreta_larga
DATABASE_URL=postgresql://...   # si usas Prisma (Vercel Postgres o Supabase)
RESEND_API_KEY=re_...           # opcional: aviso por email
ADMIN_EMAIL=tu@email.com        # opcional
```

- **No pongas** comillas en los valores.
- Si no usas base de datos con Prisma, puedes crear KV en Vercel Storage y conectar el proyecto (se añaden `KV_REST_API_URL` y `KV_REST_API_TOKEN`).
- Si más adelante tienes Formspree:  
  `VITE_FORMSPREE_REALTOR=id1`  
  `VITE_FORMSPREE_QUOTE=id2`

Importante: **no hagas commit de `.env`**. Debe estar en `.gitignore` (en proyectos Vite suele estarlo). Si no, no ejecutes `git add .env`.

### 2. En Vercel

1. Abre el archivo `.env` en tu editor, **selecciona todo** (Ctrl+A) y **cópialo** (Ctrl+C).
2. En la pantalla de **New Project** de Vercel, en la sección **Environment Variables**:
   - Pulsa **"Import .env"** o donde diga **"paste the .env contents"**.
   - Pega el contenido (Ctrl+V).
3. Revisa que aparezcan las claves sin valores raros o líneas de comentario que den error.
4. Pulsa **Deploy**.

Así Vercel crea una variable por cada línea `KEY=valor`. Los valores quedan guardados de forma segura en Vercel, no en GitHub.

---

## Después del primer deploy: añadir la base KV

Para que los formularios se guarden y el panel `/#admin` muestre datos en tiempo real:

1. En Vercel abre tu proyecto **Trusted Home Services**.
2. Arriba, pestaña **Storage**.
3. **Create Database** → elige **KV** (o **Upstash Redis** si solo ves esa opción).
4. Nombre, por ejemplo: `trusted-home-kv` → Crear.
5. En la base recién creada: **Connect to Project** → elige **trusted-home-services**.
6. Vercel añadirá solo a ese proyecto las variables **`KV_REST_API_URL`** y **`KV_REST_API_TOKEN`** (no tienes que copiarlas a mano).
7. Ve a **Deployments** → en el último deploy, menú **⋯** → **Redeploy** para que el proyecto use ya las variables de KV.

---

## Aviso por email y app instalable

- **Email:** Añade `RESEND_API_KEY` y `ADMIN_EMAIL` en Vercel para recibir un correo por cada envío de formulario.
- **App web instalable (PWA):** En el móvil, abre tu sitio, entra en `/#admin` si quieres, y en el menú del navegador elige **«Añadir a la pantalla de inicio»** o **«Instalar»**. La web se abre como app.

---

## Resumen rápido

| Dónde | Qué hacer |
|-------|-----------|
| **New Project → Environment Variables** | Añadir a mano o pegar .env: `ADMIN_SECRET`, `ONE_SIGNAL_APP_ID`, `ONE_SIGNAL_API_KEY`, `VITE_ONESIGNAL_APP_ID`. |
| **Deploy** | Pulsar Deploy (sin KV el sitio funciona; formularios y panel sin almacenamiento hasta tener KV). |
| **Storage → Create KV → Connect to Project** | Para que se creen `KV_REST_API_URL` y `KV_REST_API_TOKEN`. |
| **Redeploy** | Después de conectar KV, para que el backend use la base. |

Si quieres, el siguiente paso puede ser: “primero deploy sin variables” y luego añadir solo `ADMIN_SECRET` y OneSignal desde **Settings → Environment Variables** y hacer un segundo deploy.
