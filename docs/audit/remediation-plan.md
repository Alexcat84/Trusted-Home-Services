# Plan de remediación — seguridad

**Basado en:** [security-audit.md](./security-audit.md)  
**Fecha:** 2026-06-22  
**Objetivo:** cerrar hallazgos M-01 a M-05 y preparar CSP con nonces sin romper GA ni el panel admin.

---

## Visión general por fases

```
Fase 0 ──► Quick wins (1–2 h)     ──► sin cambio de arquitectura
Fase 1 ──► Auth endurecida (4–6 h) ──► eliminar vectores admin
Fase 2 ──► CSP enforced básica (2–4 h) ──► sin nonces aún
Fase 3 ──► Nonces + middleware (1–2 días) ──► CSP estricta
Fase 4 ──► Hardening opcional (backlog)
```

---

## Fase 0 — Quick wins

**Esfuerzo:** 1–2 horas  
**Riesgo de regresión:** bajo  
**Deploy:** un commit, sin migraciones

| # | Tarea | Hallazgo | Archivos | Criterio de done |
|---|-------|----------|----------|------------------|
| 0.1 | Añadir `https://trusted-home-services.vercel.app` a `TRUSTED_ORIGINS` en Vercel env | M-05 | Vercel dashboard | Variable definida en Production + Preview |
| 0.2 | Corregir texto admin "Updates every 5 seconds" → "30 seconds" | L-05 | `src/App.jsx` | UI coherente con polling actual |
| 0.3 | Sanitizar export CSV (prefijo `'` en celdas que empiezan con `=`, `+`, `-`, `@`, `\t`) | L-04 | `src/App.jsx` `downloadCsv` | Abrir CSV en Excel no ejecuta fórmulas |
| 0.4 | Documentar rotación de secretos (`ADMIN_SECRET`, Resend, Twilio) | — | `docs/audit/` o `.env.example` | Procedimiento escrito |

**Checklist post-deploy Fase 0:**

- [ ] Login admin funciona en Vercel URL
- [ ] Submit de formulario quote/realtor OK
- [ ] CSV descarga sin errores

---

## Fase 1 — Autenticación admin

**Esfuerzo:** 4–6 horas  
**Riesgo de regresión:** medio (afecta panel admin)  
**Dependencias:** ninguna

### 1.1 Eliminar bypass `ADMIN_SECRET` como Bearer

| Paso | Acción |
|------|--------|
| 1 | En `api/submissions.js`, `api/notification-settings.js`, `api/push-subscribe.js`: quitar `if (token === secret) return true` |
| 2 | Mantener solo `verifyJWT(token, secret)` con check `payload.admin === true` |
| 3 | Buscar otros usos de bypass en repo (`grep ADMIN_SECRET`) |
| 4 | Si usabas el secret manualmente en Postman, migrar a login → JWT |

**Criterio de done:** `Authorization: Bearer {ADMIN_SECRET}` → **401**. Solo JWT post-login → **200**.

---

### 1.2 Comparación constant-time en login

| Paso | Acción |
|------|--------|
| 1 | Crear helper `safeEqual(a, b)` con `crypto.timingSafeEqual` sobre buffers UTF-8 de igual longitud (pad o hash previo) |
| 2 | Reemplazar `u !== username \|\| p !== password` en `api/admin/login.js` |
| 3 | Mantener rate limit existente |

**Alternativa simple:** comparar `SHA256(username+password)` con valores pre-hasheados en env (más trabajo de migración).

**Criterio de done:** login sigue funcionando; tests manuales login ok/fail.

---

### 1.3 (Opcional recomendado) Cookie HttpOnly en lugar de localStorage

| Paso | Acción |
|------|--------|
| 1 | `POST /api/admin/login`: además de JSON `{ token }`, emitir `Set-Cookie: th_admin=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800` |
| 2 | API admin: leer token de cookie **o** header `Authorization` (transición) |
| 3 | Frontend: quitar `localStorage`; usar `credentials: 'include'` en fetch admin |
| 4 | Logout: endpoint `POST /api/admin/logout` que borre cookie |

**Nota:** requiere que admin y API sigan same-site (mismo dominio). OK en Vercel actual.

**Criterio de done:** token no visible en DevTools → Application → Local Storage; sí en cookie HttpOnly.

---

## Fase 2 — CSP enforced (sin nonces)

**Esfuerzo:** 2–4 horas  
**Riesgo de regresión:** medio (GA puede romperse si CSP mal configurada)  
**Dependencias:** Fase 0 desplegada

### 2.1 Endurecer política manteniendo GA

Cambiar en `vercel.json`:

| Directiva | Actual | Objetivo Fase 2 |
|-----------|--------|-----------------|
| Header key | `Content-Security-Policy-Report-Only` | `Content-Security-Policy` |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval' gtm ga` | `'self' 'unsafe-inline' gtm ga` (**quitar unsafe-eval**) |
| `connect-src` | self + GA | añadir `https://vitals.vercel-insights.com` si usas Analytics Vercel |
| `img-src` | `'self' data: https:` | `'self' data:` (ajustar si hay imágenes hotlink externas) |

### 2.2 Procedimiento de despliegue seguro

```
1. Deploy con CSP-Report-Only actualizado (sin unsafe-eval) → monitor 48 h
2. Si no hay violaciones en consola del navegador → cambiar a Content-Security-Policy
3. Probar: home, formularios, admin login, cookie consent → GA carga
```

**Checklist manual post-CSP:**

- [ ] Home carga sin errores CSP en consola
- [ ] Aceptar cookies → GA script carga
- [ ] Formulario submit OK
- [ ] Admin login + listado submissions OK
- [ ] Fuentes Google Fonts cargan

---

## Fase 3 — Nonces con Edge Middleware

**Esfuerzo:** 1–2 días  
**Riesgo de regresión:** alto  
**Dependencias:** Fase 2 estable en producción

### 3.1 Arquitectura objetivo

```
Request → middleware.ts (Edge)
            ├── genera nonce = crypto.randomUUID()
            ├── inyecta nonce en CSP header
            └── reescribe index.html: nonce en <script> si hay inline

Response ← HTML + Content-Security-Policy: script-src 'self' 'nonce-{n}' https://www.googletagmanager.com ...
```

### 3.2 Tareas técnicas

| # | Tarea | Detalle |
|---|-------|---------|
| 3.1 | Crear `middleware.ts` en raíz del proyecto | Matcher: `/((?!api|assets|images|sw.js|manifest.json).*)` |
| 3.2 | Generar nonce por request | `const nonce = Buffer.from(crypto.randomUUID()).toString('base64')` |
| 3.3 | Set header CSP dinámico | Eliminar CSP estática de `vercel.json` para rutas HTML |
| 3.4 | Inyectar nonce en HTML | Leer `dist/index.html` template o usar `@vercel/edge` rewrite |
| 3.5 | Refactor `CookieConsent.jsx` | Opción A: mover gtag bootstrap a script externo `/ga-bootstrap.js`. Opción B: pasar nonce vía meta tag `<meta name="csp-nonce" content="...">` leído en runtime |
| 3.6 | Quitar `'unsafe-inline'` de script-src | Solo `'nonce-...'` + `'self'` + dominios GA |

### 3.3 CSP objetivo (Fase 3)

```
default-src 'self';
script-src 'self' 'nonce-{NONCE}' https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;
base-uri 'self';
form-action 'self';
frame-ancestors 'self';
object-src 'none';
upgrade-insecure-requests;
```

**Nota:** `style-src 'unsafe-inline'` suele mantenerse en SPAs React (estilos inline de librerías). Endurecer estilos es fase posterior.

### 3.4 Criterios de done Fase 3

- [ ] CSP en modo enforce sin `'unsafe-inline'` en scripts
- [ ] GA funciona tras aceptar cookies
- [ ] Lighthouse / consola sin violaciones CSP en flujos principales
- [ ] Documentar nonce flow en `docs/audit/csp-nonces.md` (opcional)

---

## Fase 4 — Backlog / hardening opcional

| # | Tarea | Hallazgo | Esfuerzo |
|---|-------|----------|----------|
| 4.1 | Acortar JWT a 24 h + refresh opcional | L-02 | 2–3 h |
| 4.2 | Endpoint CSP report (`report-uri` / `report-to`) | M-03 | 2 h + servicio (report-uri.com o endpoint propio) |
| 4.3 | Ocultar o renombrar ruta admin | L-01 | 1 h |
| 4.4 | Añadir `X-Robots-Tag: noindex` en `/#admin` vía meta o middleware | L-01 | 30 min |
| 4.5 | Dependabot / `npm audit` en CI | — | 1 h |
| 4.6 | Snyk o similar en pipeline | — | 2 h |
| 4.7 | Restringir `img-src` tras inventario de imágenes externas | L-03 | 1 h |

---

## Cronograma sugerido

| Semana | Fase | Entregable |
|--------|------|------------|
| 1 | Fase 0 + Fase 1.1–1.2 | Bypass secret eliminado; login constant-time |
| 2 | Fase 2 | CSP enforced sin unsafe-eval |
| 3–4 | Fase 3 | Middleware + nonces (si se prioriza CSP estricta) |
| Backlog | Fase 1.3 + Fase 4 | Cookie HttpOnly; mejoras menores |

**Mínimo viable de seguridad (MVP):** completar **Fase 0 + Fase 1.1 + Fase 2** antes de conectar dominio custom.

---

## Orden de implementación recomendado

```
P1 ─ M-01  Eliminar bypass ADMIN_SECRET
P2 ─ M-03  CSP enforced (Fase 2)
P2 ─ M-02  Cookie HttpOnly (Fase 1.3)
P3 ─ M-04  Login constant-time
P3 ─ M-05  TRUSTED_ORIGINS en Vercel
P4 ─ Fase 3 Nonces (cuando haya tiempo)
P4 ─ L-01–L-04 backlog
```

---

## Riesgos del plan

| Riesgo | Mitigación |
|--------|------------|
| CSP rompe GA | Desplegar Report-Only primero; probar consent flow |
| Cookie HttpOnly rompe admin en dev local | Mantener fallback Bearer solo en `NODE_ENV=development` |
| Middleware aumenta latencia | Edge middleware en Vercel es ~ms; acceptable |
| Eliminar ADMIN_SECRET bypass rompe scripts internos | Documentar flujo login → JWT antes de deploy |

---

## Verificación post-remediación

Ejecutar tras cada fase:

```bash
# Build limpio
npm run build

# Headers (producción)
curl -sI https://trusted-home-services.vercel.app/ | grep -i content-security

# API sin auth
curl -s -o /dev/null -w "%{http_code}" https://trusted-home-services.vercel.app/api/submissions
# Esperado: 401

# CORS malicioso
curl -sI -X OPTIONS https://trusted-home-services.vercel.app/api/submit \
  -H "Origin: https://evil.example" \
  -H "Access-Control-Request-Method: POST"
# Esperado: sin Access-Control-Allow-Origin
```

**Pruebas manuales:**

1. Login admin → ver submissions → cambiar status → logout  
2. Enviar formulario quote desde home  
3. Cookie consent → verificar GA en Network tab  
4. Consola del navegador sin errores CSP  

---

## Responsables y seguimiento

| Rol | Acción |
|-----|--------|
| Dev | Implementar fases 0–3 en repo |
| DevOps / Vercel | Variables `TRUSTED_ORIGINS`, rotación secretos |
| Cliente / negocio | N/A en fases técnicas actuales |

**Actualizar este plan** cuando se complete cada fase (marcar checkboxes y fecha en commit o PR).

---

## Referencias

- [MDN — CSP nonce](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonces)
- [Vercel Edge Middleware](https://vercel.com/docs/functions/edge-middleware)
- [OWASP — JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- Informe base: [security-audit.md](./security-audit.md)
