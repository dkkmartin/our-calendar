import { sendNotification } from "@/actions"
import db from "@/db/drizzle"
import { calendarTable } from "@/db/schema/calendar"
import { and, eq } from "drizzle-orm"
import { startOfDay, format } from "date-fns"

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization")
  if (authHeader !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const today = startOfDay(new Date())

  try {
    const entries = await db
      .select()
      .from(calendarTable)
      .where(
        and(
          eq(calendarTable.notificationEnabled, true),
          eq(calendarTable.notificationDate, format(today, "yyyy-MM-dd"))
        )
      )

    const notificationPromises = entries.map((entry) => {
      if (entry.userId && entry.title) {
        return sendNotification(entry.userId, entry.title, entry.notes || "")
      }
    })

    await Promise.all(notificationPromises)

    return Response.json({ message: "Success" })
  } catch (error) {
    console.error("Error sending daily notification:", error)
    return Response.json(
      { error: "Failed to send daily notification" },
      { status: 500 }
    )
  }
}
