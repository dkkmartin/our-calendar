import db from "@/db/drizzle"
import { calendarTable } from "@/db/schema/calendar"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Get all entries from db
export const getEntries = async () => {
  const data = await db
    .select()
    .from(calendarTable)
    .orderBy(asc(calendarTable.date))

  return data
}

// Create new calendar entry to db
export const createEntry = async (title: string, notes: string, date: Date) => {
  await db.insert(calendarTable).values({
    title: title,
    notes: notes,
    date: date.toISOString(),
  })
  revalidatePath("/")
}

// Update entry from calendar
export const updateEntry = async (
  id: number,
  title: string,
  notes: string,
  date: Date
) => {
  await db
    .update(calendarTable)
    .set({
      title: title,
      notes: notes,
      date: date.toISOString(),
    })
    .where(eq(calendarTable.id, id))
  revalidatePath("/")
}

// Delete entry from calendar
export const deleteEntry = async (id: number) => {
  await db.delete(calendarTable).where(eq(calendarTable.id, id))
  revalidatePath("/")
}
