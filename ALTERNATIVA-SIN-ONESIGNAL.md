# Alternativa sin OneSignal (ya aplicada)

OneSignal fue eliminado. Ahora: formularios en Prisma o KV, avisos por email (Resend), admin instalable como PWA.

---

## 1. Lo más rápido: solo email (ya está en el código)

- **Formularios** → se guardan en **Vercel KV** (como ahora) y se listan en `/#admin`.
- **Avisos** → solo por **email** con Resend.
- En Vercel añades: `RESEND_API_KEY`, `ADMIN_EMAIL`. Redeploy.
- Cada envío de formulario te llega por correo. Abres el admin en el celular cuando quieras para ver la lista. **Cero tiempo más de desarrollo.**

---

## 2. Base de datos con Prisma (como en tu otra web)

- Sustituir (o complementar) **KV** por una base **Postgres**.
- Opciones gratuitas: **Vercel Postgres** o **Supabase**.
- Con **Prisma** te conectas igual que en tu otro proyecto: mismo flujo, otro sitio.
- El API `POST /api/submit` guarda en Postgres en vez de en KV. El `GET /api/submissions` lee de Postgres. El admin sigue igual.
- Las notificaciones siguen siendo por **email** (Resend). Nada de push por ahora.

**Resumen técnico:**  
- Añadir Prisma + `schema.prisma` con un modelo `Submission`.  
- Variables de entorno: `DATABASE_URL` (Vercel Postgres o Supabase).  
- Reescribir en el backend: leer/escribir con Prisma en lugar de KV.

---

## 3. “App” en el celular para ver formularios y (opcional) notificaciones

Tres formas, de más simple a más app “de verdad”:

### A) Admin como PWA (instalable en el celular)

- La página `/#admin` se convierte en **PWA**: se puede “instalar” en la pantalla de inicio del móvil.
- Abres el “icono” y entras al mismo admin en el navegador (lista de formularios, token, etc.).
- **Notificaciones:** se pueden añadir después con **Firebase Cloud Messaging (FCM)** para Web Push (más estable que OneSignal en muchos casos). Requiere un proyecto en Firebase y cambiar el código de push a FCM.

### B) App nativa con Expo (React Native)

- Una app que instalas en el celular (Android/iOS).
- Pantalla de login (token o usuario/contraseña) y pantalla con la **lista de envíos** (llamando a tu mismo `GET /api/submissions`).
- **Notificaciones push** con **Firebase (FCM)** en la app. Cuando alguien envía un formulario, tu API llama a FCM y tú recibes la notificación en el móvil.
- Mismo backend: formularios en KV o en Postgres (Prisma). Solo cambia el cliente (app en vez de solo web).

### C) Servicio tipo “formularios + notificaciones”

- Usar algo como **Formspree** o **Tally** para los formularios: ellos envían email (y a veces notificaciones) por cada envío. Tu sitio solo enlaza el formulario a su URL o embed.
- Menos control sobre el diseño y el flujo; a cambio, no mantienes backend de envíos ni push.

---

## Recomendación práctica

1. **Ya:** Quitar la dependencia de OneSignal en la cabeza y usar solo **email (Resend)** para avisos. Configurar `RESEND_API_KEY` y `ADMIN_EMAIL` en Vercel.
2. **Si quieres base de datos “de verdad”:** Migrar a **Prisma + Postgres** (Vercel o Supabase) para los envíos; el admin y la API siguen igual, solo cambia el almacenamiento.
3. **Si quieres “app en el celular”:**  
   - Opción rápida: **PWA** del admin (instalable, sin notificaciones o con FCM después).  
   - Opción “app de verdad”: **Expo + FCM** para lista de formularios y notificaciones push fiables.

Si me dices por dónde quieres seguir (solo email, Prisma, PWA o Expo), en el siguiente paso te dejo los cambios concretos en el repo (qué archivos tocar y qué variables usar).
