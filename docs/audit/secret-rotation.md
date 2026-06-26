# Rotación de secretos

**Proyecto Vercel:** `alexs-projects-e8bf95b4/trusted-home-services`
**Dónde se gestionan:** Vercel → Project Settings → Environment Variables (Production / Preview / Development)

Verificado en producción (2026-06-26) — variables actualmente configuradas: `TRUSTED_ORIGINS`, `ADMIN_EMAIL`, `RESEND_API_KEY`, `SITE_URL`, `ADMIN_PHONE`, `TWILIO_PHONE_NUMBER`, `TWILIO_AUTH_TOKEN`, `TWILIO_ACCOUNT_SID`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`, `ADMIN_SECRET`.

⚠️ **No configuradas:** `KV_REST_API_URL` / `KV_REST_API_TOKEN` (ver `docs/audit/implementation-status.md` → impacto en rate limiting).

---

## 1. `ADMIN_SECRET`

**Qué firma:** los JWT de sesión admin (`server-lib/auth.js`).
**Impacto de rotarlo:** invalida instantáneamente **todas** las sesiones admin activas (los JWT firmados con el secreto anterior dejan de verificar). No requiere borrar nada más — es el efecto deseado ante sospecha de filtración.

**Procedimiento:**
1. Generar un valor nuevo, aleatorio, ≥32 bytes: `openssl rand -base64 32` (o `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`).
2. Vercel → Environment Variables → `ADMIN_SECRET` → editar → pegar el nuevo valor → guardar en **Production** (y Preview/Development si se usan).
3. Redeploy (Vercel re-despliega automáticamente al cambiar una env var, o forzar `vercel --prod` / redeploy manual desde el dashboard).
4. Avisar a quien use el panel admin que deberá volver a iniciar sesión.

**Cuándo rotar:** ante sospecha de filtración (commit accidental, log expuesto, persona que sale del equipo con acceso), o como práctica preventiva cada 6–12 meses.

---

## 2. `ADMIN_USERNAME` / `ADMIN_PASSWORD`

**Qué protegen:** el login de `/api/admin/login` (comparación constant-time, ver `server-lib/auth.js#safeStringEqual`).
**Impacto de rotarlos:** ninguna sesión activa se cae (el JWT ya emitido sigue siendo válido hasta su expiración de 24h); solo cambia la credencial necesaria para un nuevo login.

**Procedimiento:**
1. Elegir una contraseña nueva (≥16 caracteres, generador aleatorio, sin reutilizar de otros servicios).
2. Vercel → Environment Variables → actualizar `ADMIN_PASSWORD` (y `ADMIN_USERNAME` si aplica).
3. Redeploy.
4. Si se rota por sospecha de compromiso, rotar también `ADMIN_SECRET` en el mismo cambio para cerrar sesiones activas.

**Cuándo rotar:** cada 6–12 meses, o inmediatamente si se comparte por un canal no seguro (email, chat) o cambia quién tiene acceso al panel.

---

## 3. `RESEND_API_KEY`

**Qué protege:** envío de emails de notificación (`server-lib/notifications-sender.js`).
**Impacto de rotarla:** ninguno hacia los usuarios del sitio; solo deja de enviar emails con la clave vieja (que de todas formas se revoca en Resend).

**Procedimiento:**
1. Resend dashboard → API Keys → crear una nueva clave.
2. Vercel → Environment Variables → actualizar `RESEND_API_KEY`.
3. Redeploy.
4. Revocar/eliminar la clave anterior en Resend.
5. Probar: enviar un submission de prueba y confirmar que llega el email a `ADMIN_EMAIL`.

**Cuándo rotar:** si se sospecha filtración, o cada 12 meses como práctica preventiva.

---

## 4. Twilio (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`)

**Qué protege:** envío de SMS de notificación (`server-lib/sms.js`).
**Impacto de rotar `TWILIO_AUTH_TOKEN`:** ninguno hacia los usuarios; Twilio permite tener un *secondary auth token* activo en paralelo durante la transición, evitando downtime.

**Procedimiento:**
1. Twilio Console → Account → API keys & tokens → generar/rotar el *Auth Token* (Twilio soporta token primario + secundario simultáneos).
2. Vercel → Environment Variables → actualizar `TWILIO_AUTH_TOKEN`.
3. Redeploy.
4. Confirmar que un submission de prueba dispara el SMS a `ADMIN_PHONE`.
5. Una vez confirmado, invalidar el token anterior en Twilio.

**Cuándo rotar:** si se sospecha filtración, o cada 12 meses.

---

## 5. `DATABASE_URL` / `POSTGRES_URL` / `PRISMA_DATABASE_URL`

**Qué protegen:** conexión a la base de datos Postgres (Prisma).
**Impacto de rotarlas:** requiere coordinar con el proveedor de la base de datos (rotar la contraseña del usuario de DB) — puede causar un corte breve si el redeploy no es inmediato.

**Procedimiento:**
1. En el proveedor de Postgres (Vercel Postgres / Neon / Supabase, según cuál se use), rotar la contraseña del usuario de conexión o generar una nueva connection string.
2. Actualizar `DATABASE_URL`, `POSTGRES_URL` y `PRISMA_DATABASE_URL` en Vercel con los nuevos valores.
3. Redeploy.
4. Verificar `GET /api/submissions` (con sesión admin) responde correctamente.

**Cuándo rotar:** solo ante sospecha de compromiso — no se recomienda como rutina preventiva por el riesgo de corte, salvo que el proveedor soporte rotación sin downtime.

---

## 6. Checklist general al rotar cualquier secreto

- [ ] Generar el valor nuevo con una fuente aleatoria criptográfica (no reutilizar contraseñas de otros sistemas).
- [ ] Actualizarlo en Vercel → Production (y Preview/Development si corresponde).
- [ ] Forzar/confirmar el redeploy.
- [ ] Probar el flujo afectado (login admin, envío de formulario, email, SMS, según el secreto).
- [ ] Revocar el valor anterior en el proveedor origen cuando aplique (Resend, Twilio).
- [ ] Si el secreto rotado es `ADMIN_SECRET`, avisar que las sesiones admin activas se cerrarán.
