# Migraciones y hardening adicional — 2026-06-26 (segunda parte)

Continuación de [implementation-status-2026-06-26.md](./implementation-status-2026-06-26.md). Cubre: aprovisionamiento de Vercel KV, migraciones mayores (Prisma 7, React 19, Framer Motion 12, retiro de `@vercel/kv`), lint, tests y CI. Todo lo de este documento se hizo **sin intervención del usuario** y **sin tocar el dominio**.

---

## 1. Vercel KV (free tier)

- Producto **Vercel KV clásico está descontinuado** (confirmado vía `npm view @vercel/kv deprecated`: *"Vercel KV is deprecated... install a Redis integration from Vercel Marketplace"*).
- Se instaló la integración de marketplace **Upstash for Redis** (`vercel integration add upstash/upstash-kv`) sin especificar plan de pago → quedó en el plan **Free** (no pidió tarjeta ni confirmación de costo).
- Recurso creado: `upstash-kv-celeste-forest`, conectado al proyecto `trusted-home-services`.
- Variables añadidas automáticamente en Production/Preview/Development: `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL`, `REDIS_URL`.
- Estas son **exactamente los nombres que el código ya esperaba** (`server-lib/rate-limit.js`), así que el rate limiting ahora es efectivo entre invocaciones serverless (antes caía siempre al fallback en memoria, más débil — ver auditoría del 26-06).

**Verificado:** `kv.incr()` / `kv.expire()` / `kv.ttl()` reales contra la instancia Upstash, desde Node directo.

---

## 2. Retiro de `@vercel/kv` → `@upstash/redis`

`@vercel/kv` está deprecado (mismo aviso que arriba). Se reemplazó en todo el código por `@upstash/redis`, que es el cliente que `@vercel/kv` envolvía internamente.

- Nuevo archivo `server-lib/kv.js`: instancia única `Redis.fromEnv()` (lee `KV_REST_API_URL`/`KV_REST_API_TOKEN`, mismas variables de siempre).
- Actualizados todos los `await import('@vercel/kv')` → `await import('./kv.js')` o `'../server-lib/kv.js'` en: `api/submit.js`, `api/submissions.js`, `api/notification-settings.js`, `api/push-subscribe.js`, `server-lib/rate-limit.js`, `server-lib/push.js`, `server-lib/notifications-sender.js`.
- `@vercel/kv` desinstalado del `package.json`.

**Verificado:** llamadas reales `get`/`set`/`incr`/`expire` contra la base Upstash de producción.

---

## 3. Prisma 6 → 7

Migración con más cambios de arquitectura de las cuatro. Cambios reales encontrados al ejecutar el CLI (no solo documentación, que en algunos puntos estaba desactualizada respecto al comportamiento real de `7.8.0`):

| Antes (v6) | Ahora (v7) |
|---|---|
| `generator client { provider = "prisma-client-js" }` | `provider = "prisma-client"`, `output = "../generated/prisma"`, `moduleFormat = "esm"`, `generatedFileExtension = "ts"`, `importFileExtension = "ts"` |
| `datasource db { url = env("POSTGRES_URL") directUrl = env(...) }` | `url`/`directUrl` **ya no se permiten** en `schema.prisma` (error de validación real del CLI) — se movieron a `prisma.config.mjs` |
| Cliente generado dentro de `node_modules/@prisma/client` | Cliente generado en `./generated/prisma/` (carpeta del proyecto, gitignored, se regenera con `prisma generate`) |
| `new PrismaClient()` sin adapter | Requiere **driver adapter** — se instaló `@prisma/adapter-pg`; `server-lib/prisma.js` ahora hace `new PrismaPg({ connectionString })` + `new PrismaClient({ adapter })` |
| Sin `prisma.config.*` | Nuevo `prisma.config.mjs` en la raíz (`datasource.url` vía `env('POSTGRES_URL')`, cargado con `dotenv/config` para uso local) |

### Detalle importante: `generatedFileExtension`

La documentación pública sugiere que sólo `"ts"/"mts"/"cts"` son válidos para esta opción y que `"js"` no es viable en un proyecto sin TypeScript. **Se probó empíricamente:**
- Con `"js"` literal: el CLI genera un *warning* pero igual escribe los archivos — y estos contienen sintaxis TypeScript real (`export type ...`, `import type * as ...`) que **no es JavaScript válido**; Node falla al importarlos.
- Con `"ts"`: Node 24 (el runtime usado tanto en local como en Vercel) **ejecuta estos `.ts` directamente sin flags ni paso de build**, porque son TypeScript "erasable" (solo tipos, sin sintaxis no-erasable) y Node 22.6+/24 tiene *type-stripping* nativo. Confirmado con `node` plano, sin `--experimental-strip-types`.

Por eso la configuración final usa `"ts"` (no `"js"`), y funciona sin ningún paso de compilación adicional en este proyecto 100% JavaScript.

### Vulnerabilidad transitiva detectada y corregida

`prisma@7.8.0` trae `@prisma/dev@0.24.3` (herramienta de desarrollo local), que depende de una versión vulnerable de `@hono/node-server` (GHSA-92pp-h63x-v22m, bypass de middleware vía slashes repetidos). No es código que se ejecute en producción (es tooling de desarrollo), pero se corrigió igual:
```json
"overrides": { "@prisma/dev": "0.24.14" }
```
`@prisma/dev@0.24.14` ya no depende de `@hono/node-server`. `npm audit` quedó en 0 vulnerabilidades.

### Verificación end-to-end (no solo build)

```
node -e "... prisma.submission.count() ..."        → OK, count = 4 (datos reales)
node -e "... prisma.submission.findMany() ..."      → OK
node -e "... prisma.notificationSettings.findUnique() ..." → OK
node -e "... prisma.pushSubscription.findMany() ..." → OK
```

Las cuatro consultas se probaron contra la base Postgres real de producción (Prisma Postgres en Vercel), no contra una base de prueba.

**Nota menor (no bloqueante):** `pg` emite un warning de deprecación sobre el modo SSL `require` en la connection string (cambiará en pg v9). No afecta el funcionamiento actual; queda como mejora futura opcional (especificar `sslmode=verify-full` explícitamente).

---

## 4. React 18 → 19

- Revisado el código antes de migrar: sin `ReactDOM.render` legado, sin `PropTypes`/`defaultProps` en componentes función, sin refs de cadena, ya usa `react-dom/client` con `createRoot`. Migración de bajo riesgo confirmada antes de tocar nada.
- `react@19.2.7` + `react-dom@19.2.7`.
- **Verificado en navegador real** (Chrome vía Playwright, `npm run dev`): homepage renderiza completa (hero, header, footer, cookie banner), formulario de cotización multi-paso abre y los radio buttons responden correctamente. Sin errores de React en consola.

---

## 5. Framer Motion 11 → 12

- Confirmado que **v12 no tiene breaking changes** respecto a v11 para la API de React (los breaking changes reales ocurrieron en la v11). El proyecto fue renombrado a "Motion" pero `framer-motion` sigue publicándose en paralelo en la versión `12.42.0` con el mismo nombre de import — se hizo un bump directo sin tocar imports.
- **No se migró** al paquete `motion` (el nuevo nombre): habría sido un cambio de imports en todo el código sin beneficio funcional inmediato. Si en el futuro se quiere seguir el camino "oficial" de largo plazo, es un cambio mecánico de bajo riesgo (`framer-motion` → `motion/react`).
- Verificado junto con React 19 en el smoke test de navegador (las animaciones del hero y las transiciones del formulario dependen de Framer Motion).

---

## 6. ESLint

- `eslint@10` (flat config), `eslint-plugin-react-hooks@7`, `eslint-plugin-react-refresh`, `globals`.
- Archivo nuevo: `eslint.config.js`. Reglas Node para `api/**` y `server-lib/**`; reglas browser + hooks para `src/**`.
- `eslint-plugin-react-hooks@7` trae por defecto el set de reglas orientado al futuro React Compiler (`refs`, `set-state-in-effect`, `purity`, etc.), mucho más estricto que lo que este código (preexistente, funcionando en producción) cumple. Se mantuvo `rules-of-hooks` como `error` (la regla clásica e innegociable) y se bajó el resto a `warn` — para no bloquear el lint exigiendo un refactor de comportamiento no solicitado, pero dejando la señal visible para limpieza futura.
- Arreglado en el camino (cero riesgo): imports `React` no usados (3 archivos), 5 bloques `catch {}` vacíos (ahora con comentario explicando por qué se ignora el error), una asignación inicial marcada como "inútil" en `server-lib/push.js` (es un valor por defecto intencional, se documentó con un disable puntual).
- **Resultado:** `npm run lint` → 0 errores, 24 warnings (limpieza incremental opcional, sin urgencia).

---

## 7. Tests (Vitest)

- `vitest@4`, script `npm test`.
- Cobertura inicial enfocada en lo que la auditoría señaló como crítico para seguridad:
  - `server-lib/__tests__/auth.test.js`: firma/verificación de JWT (round-trip, secreto incorrecto, payload alterado, token expirado, tokens malformados), `safeStringEqual` (constant-time compare).
  - `server-lib/__tests__/cors.test.js`: `publicCors` (same-origin, `TRUSTED_ORIGINS`, localhost, origen no confiable sin `Access-Control-Allow-Origin`, nunca `*`), `adminCors` (origen conocido reflejado, fallback a dominio de producción).
- **16/16 tests pasan.**

---

## 8. CI y Dependabot

- `.github/workflows/security-audit.yml` (job renombrado a `CI`): ahora corre `npm audit --audit-level=high` **+ `npm run lint` + `npm test` + `npm run build`** en cada push/PR a `main` (antes solo auditaba dependencias).
- Confirmado que `npm run build` (y por tanto `prisma generate`) **no necesita** `POSTGRES_URL` en CI — se probó explícitamente sin la variable y generó el cliente igual. No se añadió ningún secreto de base de datos a GitHub Actions.
- `.github/dependabot.yml`: se quitó el bloque `ignore` de mayores (Prisma, React, react-dom, framer-motion, `@vercel/kv`) porque ya están migrados / `@vercel/kv` ya no se usa. Si en el futuro otra mayor necesita ventana dedicada, se documenta ahí mismo.

---

## 9. Verificación final ejecutada

```
npm audit --audit-level=high   → 0 vulnerabilidades
npm run lint                   → 0 errores, 24 warnings
npm test                       → 16/16 tests OK
npm run build                  → OK (prisma generate + vite build)
```

Más las pruebas end-to-end ya descritas arriba (DB real, KV real, navegador real).

**Nota sobre `vercel dev`:** se intentó usar `vercel dev` localmente para una verificación adicional de las funciones serverless reales, pero falla (`FUNCTION_INVOCATION_FAILED` / `ETIMEDOUT`) incluso en endpoints **no tocados hoy** (`api/admin/logout.js`) — es un problema preexistente de la herramienta en este entorno Windows (probablemente por la ruta del proyecto con espacios, o por cómo `vercel dev` maneja los `await import()` dinámicos en modo dev local), no una regresión de estas migraciones. La verificación real se hizo contra la base de datos y el KV de producción directamente, y contra el navegador con `npm run dev` + Playwright.

---

## 10. Limpieza de los 24 warnings de lint (mismo día, a petición del usuario)

| Categoría | Cantidad | Tratamiento |
|---|---|---|
| `no-unused-vars` | 13 | Borrados — verificado con `grep` en todo el repo que cada función/variable no se usaba en ningún otro lugar antes de eliminarla. Incluye 5 componentes muertos (`Typewriter`, `Section`, `HomeStatsBlock`, `ServiceModal`, `Realtors` — todos reemplazados en su momento por otras versiones, p. ej. `RealtorsPage`), `submitToFormspree` (fallback ya retirado), variables `canSubmit`/`handlePrev` calculadas pero nunca conectadas a la UI, y un parámetro `i` sin uso |
| `react-refresh/only-export-components` | 1 | `LangContext.jsx` exportaba el provider, el hook `useLang` y el objeto de contexto desde un mismo archivo. Se separaron en `langContextInstance.js` (el `createContext`), `useLang.js` (el hook) y `LangContext.jsx` (solo el componente `LangProvider`). Se actualizaron los 4 imports afectados |
| `react-hooks/set-state-in-effect` | 3 | **2 arreglados de verdad:** `CookieConsent` y el enrutado por hash (`legalPage`/`subPage`) leían `localStorage`/`location.hash` en un efecto y llamaban `setState` de forma síncrona — se cambiaron a inicializadores **lazy** de `useState` (el patrón que React recomienda para "calcular el estado inicial a partir de algo síncrono"), sin cambiar el comportamiento. **1 suprimido con justificación:** el polling de notificaciones (`fetchNotificationSettings()`/`fetchList()`) son funciones `async` que solo hacen `setState` después de un `await fetch(...)` — es el patrón oficial de React para "fetch on mount"; la regla (experimental, pensada para React Compiler) lo marca igual. Se documentó con `eslint-disable-next-line` explicando por qué |
| `react-hooks/refs` | 6 | **Suprimidos con justificación**, no reescritos. Es la lógica que decide si saltar la animación de entrada del hero al volver de una subpágina (`wasOnSubOrLegal`/`skipHeroAnimation`), leyendo refs durante el render. El historial de git (`f5d5e61`, `2c37807`, `5c94276`) muestra que la alternativa "correcta" (effect + state) **ya se probó y se revirtió** porque causaba un parpadeo de pantalla blanca en la primera carga. Reescribirlo para complacer una regla experimental habría arriesgado reintroducir ese bug ya resuelto — se dejó el código y se documentó la razón en el propio archivo |

**Verificación tras la limpieza:**
- `npm run lint` → **0 errores, 0 warnings**
- `npm test` → 16/16
- `npm run build` → OK
- Navegador real (Playwright/Chrome): home con hero, navegación a subpágina y vuelta a home (sin parpadeo), página legal (`#privacy`), banner de cookies (aparece en visita nueva, se oculta al aceptar) — todo verificado con capturas de pantalla, sin errores de consola relacionados.

## 11. Qué falta (no se tocó, fuera de alcance de hoy)

| Punto | Motivo |
|---|---|
| Dominio `trustedhomeservices.ca` | Depende de la agencia anterior / decisión del cliente (ver plan A→Z) |
| Renombrar `framer-motion` → `motion` | Cosmético/mecánico, sin urgencia, cero breaking changes pendientes |
| Ajustar `sslmode` en la connection string de Postgres | Warning de deprecación de `pg`, no afecta hoy |
| Botón "atrás" en el formulario de cotización multi-paso | Se encontró `handlePrev` definido pero nunca conectado a ningún botón (se eliminó como código muerto) — si se quiere un botón de retroceso real en el step-form, es una decisión de producto, no de este cleanup |
