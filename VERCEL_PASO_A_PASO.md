# Vercel: paso a paso (con variables de entorno)

Sigue estos pasos en orden. Al final tendrás el sitio en vivo, los formularios guardados y notificaciones push cuando lleguen nuevas cotizaciones.

---

## 1. Subir el código a GitHub (si aún no lo has hecho)

En la carpeta del proyecto:

```bash
git add -A
git commit -m "Tu mensaje"
git push origin main
```

Si es la primera vez que conectas el repo:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

---

## 2. Crear proyecto en Vercel

1. Entra en **[vercel.com](https://vercel.com)** e inicia sesión (con GitHub).
2. Clic en **Add New…** → **Project**.
3. **Import** el repositorio de GitHub (Trusted home services).
4. **Configure Project:**
   - **Framework Preset:** Vite (debería detectarse solo).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **No hagas Deploy todavía.** Primero añade las variables de entorno (paso 3).

---

## 3. Variables de entorno en Vercel

En el proyecto de Vercel: **Settings** → **Environment Variables**. Añade estas variables (todas en **Production**, y en **Preview** si quieres probar en cada PR).

### 3.1 Almacenamiento (Vercel KV / Redis)

Para guardar cotizaciones y leads en tiempo real:

| Nombre | Valor | Dónde se obtiene |
|--------|--------|-------------------|
| `KV_REST_API_URL` | (se rellena automático) | Tras crear KV en paso 4 |
| `KV_REST_API_TOKEN` | (se rellena automático) | Tras crear KV en paso 4 |

### 3.2 Panel de administración

Para que solo tú puedas ver los envíos:

| Nombre | Valor | Uso |
|--------|--------|-----|
| `ADMIN_SECRET` | Una contraseña larga y secreta (ej. generada con un gestor de contraseñas) | Protege `GET /api/submissions`. Quien tenga este token puede ver los datos. |

### 3.3 Notificaciones push (OneSignal)

Para recibir notificaciones en el navegador (o móvil) cuando llegue un nuevo lead/cotización:

| Nombre | Valor | Dónde se obtiene |
|--------|--------|-------------------|
| `ONE_SIGNAL_APP_ID` | Tu App ID (ej. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) | OneSignal → Settings → Keys & IDs |
| `ONE_SIGNAL_API_KEY` | Tu REST API Key | OneSignal → Settings → Keys & IDs → REST API Key |

En el **frontend** (para que el panel pueda suscribirse a notificaciones):

| Nombre | Valor | Uso |
|--------|--------|-----|
| `VITE_ONESIGNAL_APP_ID` | El **mismo** App ID de OneSignal | Lo usa la página de admin para activar “Notificaciones push”. |

- **Importante:** Las variables que empiezan por `VITE_` se exponen en el navegador. Solo pon en `VITE_ONESIGNAL_APP_ID` el App ID (público). **Nunca** pongas la API Key en una variable `VITE_`.

---

## 4. Crear la base KV en Vercel

1. En el **mismo proyecto** en Vercel: pestaña **Storage**.
2. **Create Database** → elige **KV** (o **Upstash Redis** si solo ves esa opción).
3. Nombre: por ejemplo `trusted-home-kv`.
4. Crear.
5. En **Connect to Project** enlázalo a tu proyecto.
6. Vercel añadirá automáticamente **`KV_REST_API_URL`** y **`KV_REST_API_TOKEN`** a las variables de entorno. No hace falta copiarlas a mano si ya las ves en **Settings → Environment Variables**.

Si usas Upstash directamente, copia **REST URL** y **REST Token** y créalas en Vercel como `KV_REST_API_URL` y `KV_REST_API_TOKEN`.

---

## 5. Crear la app en OneSignal (notificaciones push)

1. Entra en **[onesignal.com](https://onesignal.com)** y crea cuenta o inicia sesión.
2. **New App/Website** → elige **Web Push**.
3. Configura:
   - **Site URL:** tu dominio de Vercel (ej. `https://tu-proyecto.vercel.app`).
   - **Safari** (opcional): si quieres soporte en Safari.
4. En **Settings → Keys & IDs** copia:
   - **OneSignal App ID** → úsalo en `ONE_SIGNAL_APP_ID` y en `VITE_ONESIGNAL_APP_ID`.
   - **REST API Key** → úsala solo en `ONE_SIGNAL_API_KEY` (backend).

---

## 6. Hacer el primer deploy

1. En Vercel: **Deployments** → **Redeploy** (o lanza el deploy desde la pestaña de Git).
2. Espera a que termine. Tu sitio estará en `https://tu-proyecto.vercel.app`.

---

## 7. Activar notificaciones push y ver datos en tiempo real

1. Abre tu sitio y ve al **panel de administración**: **`https://tu-dominio.vercel.app/#admin`**
2. En el campo **Access token** pega el valor de `ADMIN_SECRET` (el panel lo recuerda en la sesión).
3. Verás la tabla de **Leads y cotizaciones**; se actualiza sola **cada 5 segundos**. Pulsa **“Activar notificaciones push”** (o similar) y acepta los permisos en el navegador.
4. Pulsa **"Enable push notifications"** y acepta los permisos del navegador.
5. Cuando alguien envíe **Real Estate** o **Free Quote**, recibirás una **notificación push** y los nuevos envíos aparecerán en la tabla.

---

## Resumen de variables

| Variable | Obligatoria para… | Descripción |
|----------|-------------------|-------------|
| `KV_REST_API_URL` | Guardar envíos + panel | URL de tu KV (Vercel/Upstash). |
| `KV_REST_API_TOKEN` | Guardar envíos + panel | Token del KV. |
| `ADMIN_SECRET` | Ver lista de envíos | Token para acceder a `GET /api/submissions`. |
| `ONE_SIGNAL_APP_ID` | Enviar push desde el servidor | App ID de OneSignal. |
| `ONE_SIGNAL_API_KEY` | Enviar push desde el servidor | REST API Key de OneSignal. |
| `VITE_ONESIGNAL_APP_ID` | Botón “Activar notificaciones” en el panel | Mismo App ID (solo frontend). |

Sin KV: los formularios no se guardan en nuestro backend (puedes usar Formspree como respaldo).  
Sin OneSignal: no habrá notificaciones push, pero el panel seguirá mostrando los datos en tiempo real si usas KV.  
**Panel admin:** `https://tu-dominio.vercel.app/#admin` — no lo enlaces desde el sitio; solo tú debes conocer esta URL y `ADMIN_SECRET`.

Cuando tengas todo configurado, haz un **Redeploy** para que las nuevas variables se apliquen.
