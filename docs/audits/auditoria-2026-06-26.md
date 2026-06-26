# Auditoría completa — Trusted Home Services

**Fecha:** 2026-06-26
**Alcance:** Dependencias y vulnerabilidades, autenticación/sesión admin, CSP y nonces, CORS, rate limiting, validación de inputs, manejo de secretos, headers HTTP en producción, privacidad/cookies, PWA/service worker, CI/CD.
**Entornos verificados en vivo:** `https://trusted-home-services.vercel.app` y `https://trustedhomeservices.ca`
**Auditoría previa de referencia:** [`docs/audit/security-audit.md`](../audit/security-audit.md) (2026-06-22)

---

## 1. Resumen ejecutivo

El código (rama `main`) tiene una postura de seguridad **buena** y ha corregido, de forma verificable, **todos los hallazgos de severidad media** de la auditoría del 22 de junio (bypass de `ADMIN_SECRET`, CSP en modo informativo, JWT en `localStorage`, timing attack en login, CORS admin incompleto). `npm audit` no reporta vulnerabilidades.

Sin embargo, hay **un hallazgo crítico de tipo operativo, no de código**: el dominio del cliente **`trustedhomeservices.ca` no apunta al sitio real**. Sirve la página por defecto de GoDaddy Website Builder, no el sitio en Vercel. Esto significa que, a día de hoy, cualquier visitante o buscador que llegue al dominio del cliente **no ve el sitio que se ha auditado y construido**, y ninguno de los headers de seguridad/CSP aquí descritos se aplica a ese dominio.

| Área | Estado | Cambio vs. auditoría anterior |
|------|--------|--------------------------------|
| Dominio de producción (`trustedhomeservices.ca`) | 🔴 **Crítico** — sirve sitio GoDaddy, no Vercel | Sin cambios (ya señalado el 22-06, sigue abierto) |
| `npm audit` (vulnerabilidades conocidas) | ✅ 0 vulnerabilidades | Igual |
| Dependencias desactualizadas | ⚠️ Menores pendientes, mayores bloqueadas a propósito | Vite 5→8 ya migrado |
| Auth admin (bypass `ADMIN_SECRET`) | ✅ Corregido | Antes: M-01 abierto |
| JWT / sesión admin | ✅ Cookie `HttpOnly`, 24h, sin `localStorage` | Antes: M-02 abierto |
| CSP | ✅ Enforced, sin `unsafe-eval`/`unsafe-inline` en scripts | Antes: Report-Only (M-03) |
| Nonces CSP | ⚪ No implementados, **no son necesarios hoy** | Igual, justificado abajo |
| Login timing attack | ✅ Corregido (`timingSafeEqual`) | Antes: M-04 abierto |
| CORS admin (URL Vercel) | ✅ Incluida | Antes: M-05 abierto |
| CSV formula injection | ✅ Corregido | Antes: L-04 abierto |
| `img-src` CSP permisivo | ✅ Restringido a `'self' data:` | Antes: L-03 abierto |
| Secretos en repo / git history | ✅ Sin secretos commiteados | Igual |
| Rotación de secretos documentada | ❌ No existe el documento previsto | Pendiente desde Fase 0 |
| Rate limiting en endpoints admin | ⚠️ Solo protegidos por auth, sin throttle propio | Nuevo hallazgo (bajo) |
| Tests / lint automatizados | ⚠️ No configurados | Nuevo hallazgo (bajo, calidad) |

---

## 2. Metodología

1. Revisión estática de código: `api/`, `server-lib/`, `src/`, `prisma/schema.prisma`, `vercel.json`, `public/sw.js`, `vite.config.js`, `.github/`.
2. `npm audit` y `npm outdated` sobre el lockfile actual.
3. Verificación en vivo de headers HTTP y DNS de **ambos** dominios (`vercel.app` y dominio custom).
4. Búsqueda de secretos hardcodeados y de archivos `.env*` en el repositorio y en el historial de git.
5. Comparación punto por punto con los hallazgos M-01…M-05 y L-01…L-05 de la auditoría del 22-06-2026.

No se realizó pentest externo, fuzzing ni escaneo SAST/DAST de terceros.

---

## 3. Hallazgo crítico: dominio de producción no conectado a Vercel

### 3.1 Evidencia

```
$ curl -sI https://trustedhomeservices.ca/
HTTP/1.1 200 OK
Server: DPS/2.0.0+sha-00fa3cb
X-SiteId: us-east-1
Set-Cookie: dps_site_id=us-east-1; path=/; secure
Content-Security-Policy: frame-ancestors 'self' godaddy.com *.godaddy.com ...
```

```
$ curl -s https://trustedhomeservices.ca/ | head
<meta name="generator" content="Starfield Technologies; Go Daddy Website Builder 8.0.0000"/>
```

```
$ nslookup trustedhomeservices.ca
Addresses: 76.223.105.230, 13.248.243.5   ← IPs de GoDaddy/parking, no de Vercel
```

```
$ curl -sI https://trusted-home-services.vercel.app/
Server: Vercel
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com ...
```

### 3.2 Impacto

- El sitio real (React/Vite + API en Vercel) **solo es accesible vía `*.vercel.app`**. El dominio comercial del cliente muestra una plantilla genérica de GoDaddy.
- `sitemap.xml`, `robots.txt` y las metaetiquetas `og:url` ya están configurados apuntando a `trustedhomeservices.ca`, por lo que cualquier indexación de buscadores o compartido en redes hoy referencia un dominio que no sirve el sitio.
- Todos los controles de seguridad auditados en este informe (CSP, HSTS, cookies, CORS) **no protegen al dominio que verá el cliente final**, porque ese dominio ni siquiera ejecuta la aplicación.
- Esto ya se había detectado el 22-06-2026 (nota en `docs/audit/README.md`) y permanece sin resolver 4 días después.

### 3.3 Recomendación

1. En el panel de Vercel del proyecto, añadir `trustedhomeservices.ca` y `www.trustedhomeservices.ca` como dominios.
2. En el DNS del dominio (actualmente gestionado por GoDaddy, dado el `Server: DPS` y las IPs), actualizar los registros `A`/`ALIAS`/`CNAME` apuntando a Vercel según las instrucciones que el propio dashboard de Vercel entrega al añadir el dominio.
3. Verificar que GoDaddy Website Builder esté desactivado para este dominio (si sigue activo, puede volver a tomar el tráfico tras el cambio de DNS).
4. Tras el corte, repetir la verificación de headers (`curl -sI https://trustedhomeservices.ca/`) y confirmar que el `Server` sea `Vercel` y el `Content-Security-Policy` sea el de la aplicación, no el de GoDaddy.
5. Verificar Search Console / sitemap solo después del corte (coincide con el backlog ya anotado en `implementation-status.md`).

**Prioridad: P0 — bloqueante de negocio.** No es una vulnerabilidad de código, pero es el hallazgo de mayor impacto de esta auditoría: el cliente no está sirviendo su sitio en su propio dominio.

---

## 4. Dependencias y vulnerabilidades conocidas

### 4.1 `npm audit`

```
0 vulnerabilities (info/low/moderate/high/critical)
111 dependencias totales (66 prod, 46 dev, 32 optional)
```

CI ya ejecuta `npm audit --audit-level=high` en cada push/PR a `main` (`.github/workflows/security-audit.yml`), y Dependabot está configurado con actualizaciones semanales agrupadas (`.github/dependabot.yml`).

### 4.2 Paquetes desactualizados (`npm outdated`)

| Paquete | Actual | Última | Tipo |
|---------|--------|--------|------|
| `vite` | 8.0.16 | 8.1.0 | Patch — bajo riesgo |
| `@vitejs/plugin-react` | 6.0.2 | 6.0.3 | Patch — bajo riesgo |
| `@prisma/client` / `prisma` | 6.19.2/6.19.3 | 6.19.3 (luego 7.8.0) | Patch dentro de v6; v7 es mayor |
| `animejs` | 4.3.6 | 4.5.0 | Minor — bajo riesgo |
| `framer-motion` | 11.18.2 | 12.42.0 (mayor) | Mayor — requiere migración |
| `react` / `react-dom` | 18.3.1 | 19.2.7 (mayor) | Mayor — requiere migración |
| `@vercel/kv` | 2.0.0 | 3.0.0 (mayor) | Mayor — requiere migración |

Las actualizaciones **mayores** (Prisma 7, React 19, Framer Motion 12, `@vercel/kv` 3) están **deliberadamente excluidas** en `dependabot.yml` con el comentario *"Major bumps need manual migration"*. Es una decisión razonable, pero conviene revisarla cada 2–3 meses para no acumular demasiada deuda — React 18 y Prisma 6 seguirán recibiendo seguridad, pero no indefinidamente.

**Recomendación:**
- Aplicar las actualizaciones *patch/minor* pendientes (Vite, plugin-react, Prisma client, animejs) en un PR de mantenimiento rutinario.
- Planificar una ventana dedicada para evaluar React 19 y Prisma 7 (no urgente, sin CVEs detrás de estas versiones actuales).

### 4.3 Toolchain / Node

- CI usa Node 24 (`actions/setup-node`), entorno local usa Node v24.5.0 — consistente.
- `package.json` no define `engines`, lo cual es aceptable para un proyecto desplegado solo en Vercel (usa su propia detección de runtime).

---

## 5. Autenticación y sesión admin

Verificado en `server-lib/auth.js`, `server-lib/admin-auth.js`, `server-lib/cookies.js`, `api/admin/login.js`, `api/admin/session.js`, `api/admin/logout.js`:

- JWT HS256 propio (sin librerías externas), firma y verificación con `crypto.timingSafeEqual` — correcto.
- Login compara usuario/password con `safeStringEqual` (constant-time) — **corrige M-04**.
- Sin bypass de `Authorization: Bearer <ADMIN_SECRET>` en ningún endpoint admin (`submissions.js`, `notification-settings.js`, `push-subscribe.js`, `session.js`) — **corrige M-01**. Verificado por inspección de los 4 archivos: todos exigen `verifyAdminRequest` → JWT válido con `payload.admin === true`.
- Sesión: cookie `th_admin` con `HttpOnly; SameSite=Strict; Secure` (en producción) y TTL de **24 horas** (`ADMIN_SESSION_TTL_SECONDS`) — **corrige M-02** y reduce el riesgo de L-02 (antes 7 días).
- Frontend (`src/App.jsx`) usa `credentials: 'include'`; no quedan referencias a `localStorage` para el token admin.
- Rate limit de login: 5 intentos / 900 s por IP (`api/admin/login.js`).
- `AdminPage` inyecta `<meta name="robots" content="noindex, nofollow">` — mitiga L-01 (descubrimiento por buscadores), aunque la ruta `/#admin` sigue siendo de cliente y no oculta per se; la protección real sigue residiendo en la API, que es donde corresponde.

**Pendiente (bajo, no bloqueante):** no hay revocación de sesión activa antes de las 24h (sin blacklist), y los endpoints admin (`submissions`, `notification-settings`, `push-subscribe`) no tienen rate limit propio más allá de exigir un JWT válido — un token filtrado podría usarse sin límite de frecuencia hasta su expiración. Recomendado como mejora futura (no crítico, dado que requiere ya tener el token).

---

## 6. CSP y nonces

### 6.1 Estado verificado en producción (Vercel)

```
Content-Security-Policy: default-src 'self';
  script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
  img-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;
  base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none';
  upgrade-insecure-requests; report-uri /api/csp-report;
```

- Header es `Content-Security-Policy` (enforced), ya no `-Report-Only` — **corrige M-03**.
- `script-src` **sin** `'unsafe-inline'` ni `'unsafe-eval'`.
- `img-src` restringido a `'self' data:` — **corrige L-03**.
- `report-uri /api/csp-report` activo; el endpoint (`api/csp-report.js`) registra un resumen truncado (500 chars) en logs sin persistir el payload completo — correcto.

### 6.2 ¿Por qué no hay nonces, y por qué no son necesarios hoy?

- El bootstrap de Google Analytics (antes inline en `CookieConsent.jsx`, requería `'unsafe-inline'`) se movió a un archivo externo `public/ga-init.js` cargado vía `<script src="/ga-init.js" data-ga-id="...">`. Confirmado por lectura de código: cero `<script>` inline en el flujo de consentimiento de cookies.
- El build de Vite genera `dist/index.html` con un único `<script type="module" src="...">` externo — sin scripts inline.
- **Conclusión:** al no haber ningún script inline en la aplicación, los nonces no aportan valor adicional de seguridad sobre la política actual (que ya excluye `'unsafe-inline'` en `script-src`). Los nonces solo serían necesarios si en el futuro se introduce un script inline (p. ej. un bootstrap de analítica de terceros que lo requiera) — en ese caso, sí haría falta el middleware de Vercel Edge descrito en el plan de remediación original (`docs/audit/remediation-plan.md`, Fase 3).
- `style-src` mantiene `'unsafe-inline'`, común en SPAs React por estilos inline de librerías (`framer-motion`, `animejs`). Riesgo bajo: XSS vía CSS inline es mucho más limitado que vía JS.

**Veredicto: arquitectura actual logra el mismo objetivo de seguridad que los nonces (cero JS inline confiando en `'unsafe-inline'`) por una vía más simple. No se recomienda invertir en el middleware de nonces salvo que se introduzca un script inline real.**

---

## 7. CORS

- `server-lib/cors.js`: `adminCors` usa allowlist fija (`trustedhomeservices.ca`, `trusted-home-services.vercel.app`, localhosts de desarrollo) + `Access-Control-Allow-Credentials: true` — correcto, incluye ya la URL de Vercel (**corrige M-05**).
- `publicCors` (usado por `/api/submit`): solo permite same-origin real (calculado desde `Host`/`X-Forwarded-Proto`), `TRUSTED_ORIGINS` (env) o `localhost`/`127.0.0.1` — sin wildcard `*`. Correcto y restrictivo.
- **Nota:** dado el hallazgo de la sección 3, conviene verificar que `TRUSTED_ORIGINS` en Vercel ya incluya el dominio custom una vez esté conectado, para que los formularios funcionen desde `https://trustedhomeservices.ca` sin depender solo de la detección same-origin.

---

## 8. Rate limiting

- `server-lib/rate-limit.js`: usa Vercel KV si está configurado; si no, fallback en memoria por proceso (`globalThis.__THS_MEMORY_RATE_LIMIT__`).
- `/api/submit`: 30 req/60s por IP.
- `/api/admin/login`: 5 intentos/900s por IP.
- **Limitación conocida:** el fallback en memoria no es compartido entre instancias serverless (cada invocación fría tiene su propio estado), por lo que en ausencia de KV el rate limit es más débil de lo que aparenta — peor caso, no falla en abierto (deniega si la única protección falla), lo cual es la postura correcta (*fail-closed* declarado en el comentario del propio archivo).
- **Recomendación:** confirmar en Vercel que `KV_REST_API_URL`/`KV_REST_API_TOKEN` están configurados en producción para que el rate limit sea efectivo entre invocaciones.

---

## 9. Validación de inputs / base de datos

- `api/submit.js`: tipos restringidos a enum (`quote|realtor|partner|franchise`), límites de longitud por campo, `trim()`, rechazo si falta `name`. Correcto.
- Persistencia vía Prisma ORM (`prisma/schema.prisma`) — sin SQL raw en ningún archivo revisado → riesgo de inyección SQL nulo.
- `api/submissions.js` (PATCH/DELETE): valida `status` contra enum cerrado (`VALID_STATUSES`) antes de escribir en BD — correcto.
- `api/push-subscribe.js`: valida `endpoint` como URL HTTPS, `p256dh`/`auth` como base64url no vacíos, límite de longitud — buena validación defensiva para evitar abusos del endpoint de push.
- Email saliente (`server-lib/notifications-sender.js`): el HTML del correo escapa `&` y `<` de los campos de usuario antes de interpolar — evita inyección HTML en el correo recibido por el admin.

Sin hallazgos de severidad relevante en esta área.

---

## 10. Manejo de secretos

- `.env`, `.env.local`, `.env.*.local`, `.env.development`, `.env.production` están en `.gitignore`; `.env` local existe en disco pero **no está trackeado por git** (confirmado con `git ls-files` y `git check-ignore -v`).
- `.env.example` sí está versionado (sin valores reales) — buena práctica para onboarding.
- Búsqueda de patrones de secretos hardcodeados (`api[_-]?key|secret|password|token` seguido de valor literal) en el código trackeado: **sin resultados**.
- `GET /api/notifications-config` expone únicamente flags booleanos de qué canales están configurados, no las claves — correcto.

**Hallazgo abierto (bajo):** la tarea 0.4 del plan de remediación anterior ("Documentar rotación de secretos: `ADMIN_SECRET`, Resend, Twilio") **no se encuentra implementada** — no existe ningún documento de rotación de secretos en `docs/`. Recomendado crear un procedimiento corto (qué secretos rotar, con qué frecuencia, cómo invalidar sesiones tras rotar `ADMIN_SECRET`).

---

## 11. Headers HTTP en producción (verificado en vivo, 2026-06-26)

**`trusted-home-services.vercel.app` (el deploy real):**

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=()
Content-Security-Policy: (ver sección 6)
```

Todos presentes y consistentes con `vercel.json`. Sin regresiones respecto a la auditoría anterior.

**`trustedhomeservices.ca` (dominio del cliente):** ver sección 3 — headers de GoDaddy, no de la aplicación. **No aplica ninguno de los controles anteriores.**

---

## 12. Privacidad y cookies

- Google Analytics (`G-C4H7QVDMLH`) solo se carga tras aceptar el banner de `CookieConsent.jsx`; el rechazo no carga ningún script de terceros. Consentimiento guardado en `localStorage` (`trusted_cookie_consent`), no en cookie — funcionalmente correcto, aunque significa que el consentimiento es por navegador/dispositivo, no compartido entre dominios (irrelevante mientras solo haya un dominio activo).
- No se detectó ningún otro tracker o pixel de terceros en el código revisado.

---

## 13. Service worker / PWA

- `public/sw.js`: sin listener `fetch` (comentario explícito: deja pasar todo a la red, incluido `POST /api/submit`) — evita cacheo accidental de respuestas de API o interferencia con el envío de formularios.
- Listeners de `push`/`notificationclick` correctos; usa `event.data.json()` con `try/catch` y *fallback* a texto — no hay ejecución de contenido no confiable (no usa `innerHTML` ni `eval`).

Sin hallazgos.

---

## 14. CI/CD y calidad

- `.github/workflows/security-audit.yml`: ejecuta `npm audit --audit-level=high` en cada push/PR a `main`. Correcto como red de seguridad básica, aunque solo cubre vulnerabilidades de dependencias, no SAST de código propio.
- `.github/dependabot.yml`: actualizaciones semanales agrupadas por tipo (prod/dev), con exclusión explícita de mayores en paquetes que requieren migración manual — política razonable.
- **Hallazgo (bajo, calidad):** `package.json` no define scripts `test` ni `lint`. No hay suite de tests automatizados ni linting en CI. Para un sitio de captación de leads con panel admin esto es aceptable a corto plazo, pero limita la capacidad de detectar regresiones automáticamente a medida que crece el código (ya señalado indirectamente por lo grande que es `src/App.jsx`, con más de 2000 líneas).

---

## 15. Exportación CSV (admin)

- `escapeCsvCell` en `src/App.jsx` antepone `'` a celdas que empiezan con `=, +, -, @, \t, \r` y escapa comillas/comas/saltos de línea — **corrige L-04** (formula injection en Excel/Sheets al abrir el export).

---

## 16. Matriz de riesgo actualizada

| ID | Hallazgo | Severidad | Estado |
|----|----------|-----------|--------|
| C-01 | Dominio `trustedhomeservices.ca` no apunta a Vercel | **Crítico (operativo)** | 🔴 Abierto |
| M-01 | Bypass `ADMIN_SECRET` | Media | ✅ Corregido |
| M-02 | JWT en `localStorage` | Media | ✅ Corregido |
| M-03 | CSP en Report-Only | Media | ✅ Corregido |
| M-04 | Login sin constant-time | Media | ✅ Corregido |
| M-05 | `adminCors` sin URL Vercel | Media | ✅ Corregido |
| L-01 | `/#admin` descubrible | Baja | ⚪ Aceptado (mitigado con `noindex`) |
| L-02 | JWT sin revocación | Baja | ⚠️ Mejorado (TTL 24h), sin blacklist |
| L-03 | `img-src` permisivo | Baja | ✅ Corregido |
| L-04 | CSV formula injection | Baja | ✅ Corregido |
| N-01 | Sin documento de rotación de secretos | Baja | 🔴 Abierto (pendiente desde Fase 0) |
| N-02 | Endpoints admin sin rate limit propio | Baja | 🆕 Nuevo, abierto |
| N-03 | Sin tests/lint automatizados | Baja (calidad) | 🆕 Nuevo, abierto |
| N-04 | Dependencias patch/minor desactualizadas | Informativo | 🆕 Nuevo, abierto |

---

## 17. Recomendaciones priorizadas

1. **P0 — Conectar `trustedhomeservices.ca` a Vercel** (sección 3). Es el único bloqueante real para que el cliente tenga su sitio en producción bajo su propio dominio.
2. **P2 —** Documentar rotación de secretos (`ADMIN_SECRET`, `RESEND_API_KEY`, credenciales Twilio) en `docs/`.
3. **P2 —** Confirmar `KV_REST_API_URL`/`KV_REST_API_TOKEN` en Vercel producción para que el rate limiting sea efectivo entre invocaciones serverless.
4. **P3 —** Aplicar actualizaciones patch/minor pendientes (Vite 8.1.0, plugin-react 6.0.3, Prisma 6.19.3, animejs 4.5.0).
5. **P3 —** Añadir rate limit ligero a los endpoints admin (`submissions`, `notification-settings`, `push-subscribe`) como defensa en profundidad ante un token filtrado.
6. **P4 —** Planificar ventana de migración para React 19 / Prisma 7 (sin urgencia de seguridad, solo mantenimiento).
7. **P4 —** Evaluar incorporar lint (`eslint`) y un mínimo de tests (al menos sobre `server-lib/auth.js`, validaciones de `api/submit.js`) dado el tamaño creciente del proyecto.

No se requieren cambios adicionales en CSP/nonces (sección 6) salvo que se introduzca un script inline en el futuro.

---

## 18. Próxima revisión sugerida

- Inmediatamente después de conectar el dominio custom (repetir sección 3 y 11 contra `trustedhomeservices.ca`).
- Revisión completa de seguimiento: **cada 6 meses** o ante cambios mayores (nuevas integraciones de pago, PII adicional, migración React 19/Prisma 7).
