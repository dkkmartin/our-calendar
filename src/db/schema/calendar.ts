import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const CalendarTable = pgTable('entries', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  notes: text('notes'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
