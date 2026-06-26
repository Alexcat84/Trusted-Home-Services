# Estado de implementación — seguimiento del 2026-06-26

Basado en: [auditoria-2026-06-26.md](./auditoria-2026-06-26.md)

## Aplicado en este ciclo (sin intervención del usuario)

| # | Acción | Archivos | Estado |
|---|--------|----------|--------|
| 1 | Documentar rotación de secretos (`ADMIN_SECRET`, credenciales admin, Resend, Twilio, DB) | `docs/audit/secret-rotation.md` | ✅ |
| 2 | Actualizar dependencias patch/minor: `vite@8.1.0`, `@vitejs/plugin-react@6.0.3`, `prisma`/`@prisma/client@6.19.3`, `animejs@4.5.0` | `package.json`, `package-lock.json` | ✅ — build verificado (`npm run build` OK, `npm audit` 0 vulnerabilidades) |
| 3 | Rate limit (60 req/60s por IP) en endpoints admin como defensa en profundidad ante un token filtrado | `api/submissions.js`, `api/notification-settings.js`, `api/push-subscribe.js` | ✅ — sintaxis verificada |
| 4 | Vincular el repo local al proyecto Vercel (`vercel link`) para poder auditar variables de entorno | `.vercel/` (gitignorado) | ✅ |
| 5 | Verificar variables de entorno reales en producción | — | ✅ ver hallazgo abajo |

## Hallazgo confirmado durante este ciclo

### KV de Vercel no configurado en producción

Verificado con `vercel env ls production`: **no existen** `KV_REST_API_URL` ni `KV_REST_API_TOKEN`.

**Impacto:** `server-lib/rate-limit.js` cae siempre al *fallback* en memoria (`globalThis.__THS_MEMORY_RATE_LIMIT__`), que **no se comparte entre instancias serverless**. En la práctica, el rate limit de `/api/submit` (30/60s), `/api/admin/login` (5/900s) y el nuevo rate limit admin (60/60s) son más débiles de lo que aparentan bajo carga real con múltiples instancias frías — cada instancia cuenta por separado.

**No se modificó nada** porque provisionar un almacén KV en Vercel implica una decisión del usuario (alta de un recurso, posible costo, elegir región) — ver sección "qué necesito de ti" más abajo.

### Confirmado: `TRUSTED_ORIGINS` ya está listo para el dominio custom

`TRUSTED_ORIGINS=https://trustedhomeservices.ca` ya está configurado en producción. En cuanto se resuelva la Fase A/B del dominio (plan A→Z), el CORS público de `/api/submit` funcionará sin cambios adicionales.

## Actualización — mismo día, segunda parte

El usuario aprobó los 3 puntos pendientes. Quedaron resueltos en [migraciones-2026-06-26.md](./migraciones-2026-06-26.md):

| # | Acción | Estado |
|---|--------|--------|
| 2 | Provisionar Vercel KV | ✅ Hecho — Upstash for Redis, plan Free |
| 3 | Migración mayor React 19 / Prisma 7 / Framer Motion 12 / retiro de `@vercel/kv` | ✅ Hecho y verificado contra BD/KV reales + navegador |
| 4 | Lint (`eslint`) / suite de tests (`vitest`) | ✅ Hecho — 0 errores de lint, 16/16 tests OK |

## No aplicado (sigue dependiendo del usuario o de terceros)

| # | Acción | Por qué no se aplicó |
|---|--------|------------------------|
| 1 | Conectar `trustedhomeservices.ca` a Vercel | Depende de acceso DNS/transferencia gestionado por la agencia anterior (Fase A/B del plan) |
