import '@/db/envConfig';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*',
  dialect: 'postgresql',
  out: './src/db',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
