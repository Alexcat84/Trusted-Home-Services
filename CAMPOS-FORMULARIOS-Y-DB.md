# Campos de formularios y base de datos

## Cómo se guardan los envíos

Los dos formularios (**Realtor / Agente** y **Free Quote**) envían a **`/api/submit`**. El API guarda un registro en la tabla **`Submission`** (Prisma/Postgres) o en KV si no hay base Postgres.

## Correspondencia formulario → base de datos

### Formulario Realtor (agente)

| Campo en el formulario | Campo en DB (Prisma) | Tipo   |
|------------------------|----------------------|--------|
| Nombre                 | `name`               | string |
| Email                  | `email`              | string (opcional) |
| Teléfono               | `phone`              | string (opcional) |
| Mensaje / qué necesita | `message`            | string (opcional) |
| (tipo fijo)            | `type`               | `"realtor"` |

### Formulario Free Quote (cotización)

| Campo en el formulario | Campo en DB (Prisma) | Tipo   |
|------------------------|----------------------|--------|
| Nombre                 | `name`               | string |
| Email                  | `email`              | string |
| Teléfono               | `phone`              | string |
| Tipo de trabajo       | `work`               | string (ej. painting, cleaning) |
| Áreas / habitaciones  | `areas`              | string |
| Tipo de propiedad     | `propertyType`       | string (ej. condo, townhouse) |
| Tamaño (dormitorios)  | `size`               | string |
| Mensaje adicional     | `message`            | string (opcional) |
| (tipo fijo)            | `type`               | `"quote"` |

Todos los envíos tienen además **`createdAt`** (fecha/hora) y **`id`** (identificador único).

## Dónde se consultan

- **Panel admin:** `/#admin` (con token ADMIN_SECRET). La tabla se actualiza cada 5 segundos y muestra: Date, Type (Realtor/Quote), Name, Contact (email · teléfono), Details (mensaje o work/areas/propertyType/size).
- **API:** `GET /api/submissions?token=ADMIN_SECRET` devuelve el listado en JSON para integraciones o scripts.

## Añadir o cambiar campos

1. **Prisma:** Edita `prisma/schema.prisma`, añade el campo al modelo `Submission` (ej. `extraField String?`).
2. **Migrar:** `npx prisma db push` (o `npx prisma migrate dev` si usas migraciones).
3. **API:** En `api/submit.js`, en el `prisma.submission.create`, añade el nuevo campo en `data: { ... }` (ej. `extraField: body.extraField ?? null`).
4. **Frontend:** Añade el campo al formulario en `App.jsx` y envíalo en el payload a `/api/submit`.
5. **Admin:** Si quieres mostrarlo en la tabla, en `App.jsx` en la columna "Details" (o una nueva) incluye `s.extraField`.
