# Informe de auditoría de seguridad

**Proyecto:** Trusted Home Services  
**Fecha:** 2026-06-22  
**Alcance:** Frontend (React/Vite), API serverless (Vercel), Prisma/Postgres, PWA admin, headers HTTP, CORS, CSP/nonces  
**Deploy verificado:** `https://trusted-home-services.vercel.app`

---

## 1. Resumen ejecutivo

No se identificaron vulnerabilidades **críticas** para un sitio de captación de leads con panel admin interno. La postura general es **aceptable** con mejoras recomendadas en **CSP/nonces**, **autenticación admin** y **endurecimiento de headers**.

| Área | Calificación | Notas |
|------|--------------|-------|
| API pública (`POST /api/submit`) | ✅ Buena | Rate limit, validación, CORS restrictivo |
| API admin | ⚠️ Aceptable | JWT + rate limit; bypass con `ADMIN_SECRET` |
| Headers HTTP | ✅ Buena | HSTS, nosniff, frame options, referrer policy |
| CSP / nonces | ❌ Insuficiente | Solo Report-Only; sin nonces; `unsafe-inline`/`unsafe-eval` |
| XSS | ✅ Baja exposición | React escapa output; sin `dangerouslySetInnerHTML` |
| Secretos en repo | ✅ Correcto | `.env` en `.gitignore` |
| Almacenamiento de sesión admin | ⚠️ Mejorable | JWT en `localStorage` |

---

## 2. Metodología

1. **Revisión estática** de código fuente: `api/`, `server-lib/`, `src/`, `vercel.json`, `public/sw.js`.
2. **Verificación en producción** de headers HTTP y respuestas de API.
3. **Pruebas manuales básicas:**
   - `GET /api/submissions` sin token → `401`
   - `POST /api/admin/login` credenciales inválidas → `401`
   - `OPTIONS /api/submit` con `Origin: https://evil.example` → sin `Access-Control-Allow-Origin`

No se realizó pentest externo ni fuzzing automatizado en esta fase.

---

## 3. Arquitectura relevante para seguridad

```
Browser (SPA React)
    │
    ├── GET /*           → Vercel static (dist/)
    ├── POST /api/submit → publicCors + rate limit (público)
    └── /api/admin/*     → adminCors + JWT/ADMIN_SECRET (privado)
                              │
                              └── Prisma → Postgres
```

- **Admin UI:** ruta cliente `/#admin` (no oculta la API; la protección real está en el backend).
- **Auth:** login → JWT firmado con `ADMIN_SECRET` (HS256, implementación propia en `server-lib/auth.js`).
- **PWA:** service worker sin listener `fetch` → no intercepta ni cachea API.

---

## 4. Controles existentes (positivos)

### 4.1 Autenticación y autorización

| Control | Ubicación | Detalle |
|---------|-----------|---------|
| JWT HS256 | `server-lib/auth.js` | Firma HMAC-SHA256; verificación con `timingSafeEqual` |
| Expiración JWT | `signJWT()` | 7 días (`exp` validado en `verifyJWT`) |
| Rate limit login | `api/admin/login.js` | 5 intentos / 900 s por IP |
| Rate limit submit | `api/submit.js` | 30 req / 60 s por IP |
| Auth en endpoints admin | `submissions`, `notification-settings`, `push-subscribe` | Bearer obligatorio |

### 4.2 Validación de entrada (formularios)

- Tipos permitidos: `quote`, `realtor`, `partner`, `franchise`.
- Límites de longitud por campo (`name` 200, `message` 5000, etc.).
- Trim y rechazo si falta `name`.
- Prisma ORM (sin SQL raw) → bajo riesgo de inyección SQL.

### 4.3 CORS

**Público (`publicCors`):** solo same-origin, localhost o orígenes en `TRUSTED_ORIGINS`.

**Admin (`adminCors`):** lista fija + fallback a `https://trustedhomeservices.ca`.

### 4.4 Headers HTTP (producción, verificado 2026-06-22)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=()
Content-Security-Policy-Report-Only: ... (ver sección 5)
```

### 4.5 XSS

- Sin `dangerouslySetInnerHTML` ni asignación a `innerHTML`.
- Datos de submissions en tabla admin renderizados como nodos de texto React.
- Email HTML en Resend escapa `&` y `<` en líneas de texto.

### 4.6 Privacidad / cookies

- Google Analytics solo tras consentimiento (`CookieConsent.jsx`).
- GA ID: `G-C4H7QVDMLH`.

### 4.7 Secretos

- `.env`, `.env.local`, `.env.production` en `.gitignore`.
- `GET /api/notifications-config` expone solo flags booleanos (no claves API).

---

## 5. CSP y nonces (hallazgo principal)

### 5.1 Estado actual

Definido en `vercel.json`:

```json
"Content-Security-Policy-Report-Only": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; ..."
```

| Aspecto | Estado |
|---------|--------|
| Nonces | **No implementados** |
| Modo | **Report-Only** (no bloquea violaciones) |
| Endpoint de reporte CSP | **No configurado** |
| `unsafe-inline` | Presente (requerido hoy por bootstrap inline de GA) |
| `unsafe-eval` | Presente (innecesario en build de producción Vite) |
| `img-src` | `https:` (muy permisivo) |

### 5.2 Por qué no hay nonces

1. **SPA estática:** `index.html` se genera en build; no hay inyección por request.
2. **Scripts principales:** bundles externos (`./assets/index-*.js`) → cubiertos por `'self'`.
3. **Google Analytics:** `CookieConsent.jsx` crea función inline `window.gtag = function...` → requiere `'unsafe-inline'` **o** nonce dinámico por request.

### 5.3 Build de producción (`dist/index.html`)

- Un `<script type="module">` externo + CSS externo.
- Sin scripts inline en el HTML servido.
- El riesgo CSP real está en **runtime** (GA) y en políticas demasiado permisivas.

### 5.4 Requisitos para nonces reales

1. **Vercel Edge Middleware** que genere nonce único por request.
2. Reescritura de `index.html` (o SSR) para añadir `nonce="..."` a scripts inline.
3. Header CSP: `script-src 'self' 'nonce-{valor}' https://www.googletagmanager.com` (sin `'unsafe-inline'`).
4. Refactor de GA para usar el nonce o cargar solo scripts externos taggeados.

---

## 6. Hallazgos

### 6.1 Severidad media

#### M-01: `ADMIN_SECRET` aceptado como Bearer directo

**Archivos:** `api/submissions.js`, `api/notification-settings.js`, `api/push-subscribe.js`

```javascript
if (token === secret) return true;
```

**Riesgo:** filtración de `ADMIN_SECRET` (env, logs, backup) = acceso admin completo sin JWT.

**Recomendación:** eliminar bypass; solo JWT válido con claim `admin: true`.

---

#### M-02: JWT almacenado en `localStorage`

**Archivo:** `src/App.jsx` — clave `th_admin_token`

**Riesgo:** cualquier XSS futuro permite robo de token. React mitiga XSS hoy, pero `localStorage` es persistente ante scripts maliciosos.

**Recomendación:** cookie `HttpOnly; Secure; SameSite=Strict` emitida por `/api/admin/login`.

---

#### M-03: CSP no enforced

**Archivo:** `vercel.json`

**Riesgo:** política actual es informativa; no reduce superficie de XSS real.

**Recomendación:** migrar a `Content-Security-Policy` en fases (ver plan de remediación).

---

#### M-04: Login sin comparación constant-time

**Archivo:** `api/admin/login.js`

```javascript
if (u !== username || p !== password) {
```

**Riesgo:** timing attack teórico sobre password. Mitigado parcialmente por rate limit (5/15 min).

**Recomendación:** `crypto.timingSafeEqual` sobre buffers de longitud fija o hash comparado en constant-time.

---

#### M-05: `adminCors` no incluye URL de Vercel

**Archivo:** `server-lib/cors.js`

Lista fija: `trustedhomeservices.ca`, localhost. No incluye `trusted-home-services.vercel.app`.

**Impacto actual:** bajo — admin y API son same-origin en Vercel. Relevante si en el futuro el frontend y API están en dominios distintos.

**Recomendación:** añadir deploy URL vía `TRUSTED_ORIGINS` en env de Vercel.

---

### 6.2 Severidad baja

#### L-01: Admin descubrible en `/#admin`

Ruta solo cliente; API sí exige auth. Seguridad por oscuridad débil.

**Recomendación:** opcional — path menos obvio o gate adicional; no sustituye auth en API.

---

#### L-02: JWT sin revocación

Expira a los 7 días; no hay blacklist ni refresh rotativo.

**Recomendación:** acortar TTL + re-login; o tabla de sesiones si crece el uso.

---

#### L-03: `img-src https:` permisivo en CSP

Permite cargar imágenes desde cualquier HTTPS.

**Recomendación:** restringir a `'self'`, `data:`, dominios conocidos (Google Fonts no aplica a img).

---

#### L-04: CSV export — formula injection

Export CSV desde admin; campos que empiezan con `=`, `+`, `-`, `@` pueden ejecutar fórmulas en Excel.

**Recomendación:** prefijar celdas sensibles con `'` o tab en export.

---

#### L-05: Texto UI desactualizado en admin

Mensaje "Updates every 5 seconds" — polling cambió a 30 s (cosmético, no seguridad).

---

### 6.3 Sin hallazgo (verificado)

| Prueba | Resultado |
|--------|-----------|
| API admin sin auth | 401 |
| Login inválido | 401 |
| CORS submit origen malicioso | Sin header ACAO |
| Secretos en repo | No commiteados |
| SQL injection vía Prisma | No hay raw queries |
| `dangerouslySetInnerHTML` | No usado |

---

## 7. Matriz de riesgo

| ID | Hallazgo | Probabilidad | Impacto | Prioridad |
|----|----------|--------------|---------|-----------|
| M-01 | Bypass ADMIN_SECRET | Baja | Alto | P1 |
| M-02 | JWT en localStorage | Baja | Alto | P2 |
| M-03 | CSP Report-Only | Media | Medio | P2 |
| M-04 | Login timing | Baja | Bajo | P3 |
| M-05 | adminCors Vercel URL | Baja | Bajo | P3 |
| L-01 | /#admin visible | Alta | Bajo | P4 |
| L-02 | Sin revocación JWT | Baja | Medio | P4 |
| L-03 | img-src permisivo | Baja | Bajo | P4 |
| L-04 | CSV formula injection | Baja | Bajo | P4 |

---

## 8. Referencias de código

| Tema | Archivo |
|------|---------|
| JWT sign/verify | `server-lib/auth.js` |
| Login | `api/admin/login.js` |
| Auth admin API | `api/submissions.js` |
| CORS | `server-lib/cors.js` |
| Rate limit | `server-lib/rate-limit.js` |
| Submit público | `api/submit.js` |
| CSP headers | `vercel.json` |
| GA + cookies | `src/components/CookieConsent.jsx` |
| Token admin UI | `src/App.jsx` |
| Service worker | `public/sw.js` |

---

## 9. Próxima revisión sugerida

- Tras liberar dominio `trustedhomeservices.ca` y conectarlo a Vercel.
- Tras implementar Fase 1–2 del [plan de remediación](./remediation-plan.md).
- Cadencia recomendada: **cada 6 meses** o ante cambios mayores (auth, pagos, datos PII adicionales).
