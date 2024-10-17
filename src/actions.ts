"use server"

import db from "@/db/drizzle"
import { calendarTable } from "@/db/schema/calendar"
import { asc, eq } from "drizzle-orm"

// Get all entries from db
export const getAllEntries = async () => {
  const data = await db
    .select()
    .from(calendarTable)
    .orderBy(asc(calendarTable.date))
  return data
}

// Get specific entries from db
export const getSpecificEntries = async (date: string) => {
  const data = await db
    .select()
    .from(calendarTable)
    .where(eq(calendarTable.date, date))
  return data
}

// Get specific entry from db
export const getSpecificEntry = async (id: number) => {
  const data = await db
    .select()
    .from(calendarTable)
    .where(eq(calendarTable.id, id))
  return data
}

// Create new calendar entry to db
export const createEntry = async (
  title: string,
  notes: string,
  date: Date,
  time: string,
  userId: string,
  userName: string,
  userImage: string | null
) => {
  await db.insert(calendarTable).values({
    title: title,
    notes: notes,
    date: date.toISOString(),
    time: time || null,
    userId: userId,
    userName: userName,
    userImage: userImage || "",
  })
}

// Update entry from calendar
export const updateEntry = async (
  id: number,
  title: string,
  notes: string,
  time: string
) => {
  await db
    .update(calendarTable)
    .set({
      title: title,
      notes: notes,
      time: time || null,
    })
    .where(eq(calendarTable.id, id))
}

// Delete entry from calendar
export const deleteEntry = async (id: number) => {
  await db.delete(calendarTable).where(eq(calendarTable.id, id))
}
