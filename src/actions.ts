"use server"

import db from "@/db/drizzle"
import { calendarTable } from "@/db/schema/calendar"
import { and, asc, eq } from "drizzle-orm"
import { parseISO, startOfDay, format } from "date-fns"
import webpush from "web-push"
import { notificationTable } from "./db/schema/notification"

webpush.setVapidDetails(
  "mailto:martin@martinbruun.dk",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Get all entries from db
export const getAllEntries = async () => {
  try {
    const data = await db
      .select()
      .from(calendarTable)
      .orderBy(asc(calendarTable.date))
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching all entries:", error)
    return { success: false, error: "Failed to fetch entries" }
  }
}

// Get specific entries from db
export const getSpecificEntries = async (date: string) => {
  try {
    const data = await db
      .select()
      .from(calendarTable)
      .where(eq(calendarTable.date, date))
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching specific entries:", error)
    return {
      success: false,
      error: "Failed to fetch entries for the specified date",
    }
  }
}

// Get specific entry from db
export const getSpecificEntry = async (id: number) => {
  try {
    const data = await db
      .select()
      .from(calendarTable)
      .where(eq(calendarTable.id, id))
    return { success: true, data }
  } catch (error) {
    console.error("Error fetching specific entry:", error)
    return { success: false, error: "Failed to fetch the specified entry" }
  }
}

// Create new calendar entry to db
export const createEntry = async (
  title: string,
  notes: string,
  date: string,
  time: string,
  notificationDate: string | null,
  notificationEnabled: boolean,
  userId: string,
  userName: string,
  userImage: string | null
) => {
  try {
    const utcDate = startOfDay(date)
    const utcNotificationDate = notificationDate
      ? startOfDay(notificationDate)
      : null
    await db.insert(calendarTable).values({
      title: title,
      notes: notes,
      date: format(utcDate, "yyyy-MM-dd"),
      time: time || null,
      notificationDate: utcNotificationDate
        ? format(utcNotificationDate, "yyyy-MM-dd")
        : null,
      notificationEnabled: notificationEnabled,
      userId: userId,
      userName: userName,
      userImage: userImage || "",
    })
    return { success: true }
  } catch (error) {
    console.error("Error creating calendar entry:", error)
    return { success: false, error: "Failed to create calendar entry" }
  }
}

// Update entry from calendar
export const updateEntry = async (
  id: number,
  title: string,
  notes: string,
  time: string,
  notificationDate: string | null,
  notificationEnabled: boolean
) => {
  try {
    const utcNotificationDate = notificationDate
      ? startOfDay(notificationDate)
      : null

    await db
      .update(calendarTable)
      .set({
        title: title,
        notes: notes,
        time: time || null,
        notificationDate: utcNotificationDate
          ? format(utcNotificationDate, "yyyy-MM-dd")
          : null,
        notificationEnabled: notificationEnabled,
      })
      .where(eq(calendarTable.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error updating calendar entry:", error)
    return { success: false, error: "Failed to update calendar entry" }
  }
}

// Delete entry from calendar
export const deleteEntry = async (id: number) => {
  try {
    await db.delete(calendarTable).where(eq(calendarTable.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting calendar entry:", error)
    return { success: false, error: "Failed to delete calendar entry" }
  }
}

/*
------------------------------
Web push notifications actions
------------------------------
*/

export async function subscribeUser(
  userId: string,
  userName: string,
  sub: PushSubscription
) {
  try {
    if (!sub || !sub.endpoint) {
      throw new Error("Invalid subscription object")
    }

    const subscription = {
      endpoint: sub.endpoint,
      expirationTime: sub.expirationTime?.toString() || null,
      keys: (sub as any).keys
        ? {
            p256dh: (sub as any).keys.p256dh,
            auth: (sub as any).keys.auth,
          }
        : undefined,
    }

    // Check if this exact subscription already exists
    const existingSub = await db
      .select()
      .from(notificationTable)
      .where(
        and(
          eq(notificationTable.userId, userId),
          eq(notificationTable.endpoint, subscription.endpoint)
        )
      )
      .limit(1)

    if (existingSub.length === 0) {
      // Only insert if no existing subscription found
      await db.insert(notificationTable).values({
        userId,
        userName,
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys ? JSON.stringify(subscription.keys) : null,
      })
    } else {
      // Optionally update the existing subscription if needed
      await db
        .update(notificationTable)
        .set({
          userName,
          expirationTime: subscription.expirationTime,
          keys: subscription.keys ? JSON.stringify(subscription.keys) : null,
        })
        .where(
          and(
            eq(notificationTable.userId, userId),
            eq(notificationTable.endpoint, subscription.endpoint)
          )
        )
    }
    return { success: true }
  } catch (error) {
    console.error("Error subscribing user:", error)
    return { success: false, error: "Failed to subscribe user" }
  }
}

export async function unsubscribeUser(userId: string, endpoint: string) {
  try {
    await db
      .delete(notificationTable)
      .where(
        and(
          eq(notificationTable.userId, userId),
          eq(notificationTable.endpoint, endpoint)
        )
      )
    return { success: true }
  } catch (error) {
    console.error("Error unsubscribing user:", error)
    return { success: false, error: "Failed to unsubscribe user" }
  }
}

export async function getSubscription(userId: string) {
  try {
    const subscriptions = await db
      .select()
      .from(notificationTable)
      .where(eq(notificationTable.userId, userId))
    if (subscriptions.length === 0) return null

    return subscriptions.map((sub) => ({
      endpoint: sub.endpoint,
      expirationTime: sub.expirationTime ? Number(sub.expirationTime) : null,
      keys: sub.keys
        ? typeof sub.keys === "string"
          ? JSON.parse(sub.keys)
          : sub.keys
        : undefined,
    }))
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}

export async function checkUserSubscription(userId: string) {
  try {
    const subscription = await getSubscription(userId)
    if (subscription) {
      return subscription
    } else {
      return false
    }
  } catch (error) {
    console.error("Error checking user subscription:", error)
    return null
  }
}

export async function sendNotification(
  userId: string,
  title: string,
  message: string
) {
  const subscriptions = await getSubscription(userId)
  if (!subscriptions || subscriptions.length === 0) {
    console.error("No subscriptions found for user:", userId)
    return { success: false, error: "No subscription available" }
  }

  const results = await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        if (
          !subscription.keys ||
          !subscription.keys.auth ||
          !subscription.keys.p256dh
        ) {
          console.error("Invalid subscription keys:", subscription.keys)
          return {
            success: false,
            error: "Subscription is missing required keys",
          }
        }

        await webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: title,
            body: message,
            icon: "/favicon-48x48.png",
          })
        )
        return { success: true }
      } catch (error) {
        console.error("Error sending push notification:", error)
        return { success: false, error: "Failed to send notification" }
      }
    })
  )

  return results
}
