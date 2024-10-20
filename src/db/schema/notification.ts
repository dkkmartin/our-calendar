import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core"

export const notificationTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  userName: text("userName").notNull(),
  endpoint: text("endpoint").notNull(),
  expirationTime: text("expiration_time"),
  keys: jsonb("keys").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
