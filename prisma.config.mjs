import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Plain process.env access (not the `env()` helper): `prisma generate` (run in CI
// and in `postinstall`, with no .env file and no DB secret available) doesn't need
// a resolvable connection string, only `migrate`/`db push`/`studio` do.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  },
});
