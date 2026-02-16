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
   | `ADMIN_SECRET` | Una contraseña larga que solo tú sepas (ej. generada con un gestor de contraseñas). Es la “llave” del panel `/#admin`. |
   | `ONE_SIGNAL_APP_ID` | En OneSignal → tu app → **Settings → Keys & IDs** → **OneSignal App ID** (tipo `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). |
   | `ONE_SIGNAL_API_KEY` | En la misma página → **REST API Key**. |
   | `VITE_ONESIGNAL_APP_ID` | **El mismo** App ID de OneSignal (copia el mismo valor que `ONE_SIGNAL_APP_ID`). |

3. **KV (base de datos)**  
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
ONE_SIGNAL_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ONE_SIGNAL_API_KEY=tu_rest_api_key_de_onesignal
VITE_ONESIGNAL_APP_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

- **No pongas** comillas en los valores.
- **No incluyas** `KV_REST_API_URL` ni `KV_REST_API_TOKEN` aquí; se añaden al crear KV (más abajo).
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

## Alternativa: aviso por email (sin depender de push)

Si las notificaciones push no se registran bien, puedes recibir un **email por cada envío de formulario**:

1. Crea cuenta en [Resend](https://resend.com) y obtén una **API Key** (API Keys).
2. En Vercel → tu proyecto → **Settings → Environment Variables** añade:
   - `RESEND_API_KEY` = tu API key de Resend
   - `ADMIN_EMAIL` = tu correo (donde quieres recibir los avisos)
   - (Opcional) `NOTIFY_FROM_EMAIL` = `"Trusted Home Services <noreply@tudominio.com>"` si tienes dominio verificado en Resend; si no, se usa el remitente de prueba de Resend.
3. **Redeploy**. A partir de ahí, cada vez que alguien envíe el formulario de realtor o cotización, recibirás un email con los datos.

---

## Resumen rápido

| Dónde | Qué hacer |
|-------|-----------|
| **New Project → Environment Variables** | Añadir a mano o pegar .env: `ADMIN_SECRET`, `ONE_SIGNAL_APP_ID`, `ONE_SIGNAL_API_KEY`, `VITE_ONESIGNAL_APP_ID`. |
| **Deploy** | Pulsar Deploy (sin KV el sitio funciona; formularios y panel sin almacenamiento hasta tener KV). |
| **Storage → Create KV → Connect to Project** | Para que se creen `KV_REST_API_URL` y `KV_REST_API_TOKEN`. |
| **Redeploy** | Después de conectar KV, para que el backend use la base. |

Si quieres, el siguiente paso puede ser: “primero deploy sin variables” y luego añadir solo `ADMIN_SECRET` y OneSignal desde **Settings → Environment Variables** y hacer un segundo deploy.
