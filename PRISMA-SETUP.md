# Configurar base de datos con Prisma

Los formularios se guardan en **PostgreSQL** con **Prisma**, usando la misma idea que en tu proyecto [GemSpots](https://github.com/Alexcat84/GemStoneNFTManager-PC): una sola variable **`DATABASE_URL`** y conexión SSL. Ahí usas el cliente `pg` (Pool); aquí usamos Prisma, pero la URL y el proveedor son los mismos.

## 1. Crear la base de datos

**Misma configuración que GemSpots:** Postgres + `DATABASE_URL` en Vercel (formato `postgresql://user:password@host:port/database?sslmode=require`).

**Opción A – Vercel Postgres (recomendado, como en GemSpots)**

1. En Vercel → proyecto **Trusted Home Services** → **Storage** → **Create Database** → **Postgres**.
2. Conecta la base al proyecto. Vercel añadirá `DATABASE_URL` automáticamente.
3. (Opcional) Si ya tienes una base en la misma cuenta Vercel, puedes crear una **nueva** base para este sitio para no mezclar tablas con GemSpots.)

**Opción B – Supabase u otro Postgres**

1. Crea un proyecto en [supabase.com](https://supabase.com) (o usa el mismo que tengas para otros proyectos).
2. En **Settings → Database** copia la **Connection string** (URI). Suele incluir `?sslmode=require` o parámetros SSL.
3. En Vercel → **Settings → Environment Variables** añade `DATABASE_URL` con esa URI.

## 2. Aplicar el esquema

En tu PC (con `DATABASE_URL` en `.env` o en Vercel):

```bash
npx prisma db push
```

O, si quieres usar migraciones:

```bash
npx prisma migrate dev --name init
```

Para producción (tras el primer deploy), en Vercel ya se ejecuta `prisma generate` en el build. La tabla se crea la primera vez que uses `db push` o `migrate deploy` contra esa base.

## 3. Variables en Vercel

- Al **conectar** la base Prisma Postgres al proyecto, Vercel inyecta **`POSTGRES_URL`** (y a veces `PRISMA_DATABASE_URL`). El código usa **`POSTGRES_URL`** para Prisma; si no está, prueba **`DATABASE_URL`**.
- No hace falta crear a mano la variable de la base si ya conectaste el Storage al proyecto.
- Otras variables que sí debes tener: **`ADMIN_SECRET`** (para el panel `/#admin`). Opcionales: `RESEND_API_KEY`, `ADMIN_EMAIL` (aviso por email), o KV si no usas Postgres.

## 4. Redeploy

Después de añadir o cambiar `DATABASE_URL`, haz **Redeploy** en Vercel para que el API use la base.
