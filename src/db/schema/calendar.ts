import {
  pgTable,
  serial,
  text,
  timestamp,
  date,
  time,
} from "drizzle-orm/pg-core"

export const calendarTable = pgTable("entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  notes: text("notes"),
  date: date("date").notNull(),
  time: time("time"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
})
