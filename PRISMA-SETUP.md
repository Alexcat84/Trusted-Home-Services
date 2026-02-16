# Configurar base de datos con Prisma

Los formularios se pueden guardar en **Postgres** (Prisma) en lugar de (o además de) KV.

## 1. Crear la base de datos

**Opción A – Vercel Postgres**

1. En el dashboard de Vercel → tu proyecto → **Storage** → **Create Database** → **Postgres**.
2. Conecta la base al proyecto. Vercel añadirá `DATABASE_URL` a las variables de entorno.

**Opción B – Supabase**

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Settings → Database** copia la **Connection string** (URI).
3. En Vercel → **Settings → Environment Variables** añade `DATABASE_URL` con esa URI (modo **Transaction** si Supabase lo pide).

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

- `DATABASE_URL`: la URL de Postgres (Vercel la añade si usas Vercel Postgres; si usas Supabase, pégala a mano).
- Si `DATABASE_URL` está definida, el API usa Prisma para guardar y listar envíos. Si no, usa KV (si está configurado) o solo envía el email.

## 4. Redeploy

Después de añadir o cambiar `DATABASE_URL`, haz **Redeploy** en Vercel para que el API use la base.
