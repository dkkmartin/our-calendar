"use client"

import {
  checkUserSubscription,
  subscribeUser,
  unsubscribeUser,
} from "@/actions"
import { urlBase64ToUint8Array } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type PushNotificationManagerProps = {
  onClick?: () => void
}

function PushNotificationManager({ onClick }: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const checkSubscriptionStatus = useCallback(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    })
    const browserSub = await registration.pushManager.getSubscription()

    if (user) {
      const dbSub = await checkUserSubscription(user.id)

      if (browserSub && dbSub) {
        // Both browser and DB have a subscription
        setSubscription(browserSub)
      } else if (browserSub && !dbSub) {
        // Browser has subscription but DB doesn't
        if (user && user.fullName) {
          await subscribeUser(user.id, user.fullName, browserSub)
        }
        setSubscription(browserSub)
      } else if (!browserSub && dbSub) {
        // DB has subscription but browser doesn't
        await unsubscribeUser(user.id, dbSub[0].endpoint)
        setSubscription(null)
      } else {
        // Neither has a subscription
        setSubscription(null)
      }
    }
  }, [user, setSubscription])

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscriptionStatus()
    }
  }, [checkSubscriptionStatus])

  async function subscribeToPush() {
    setLoading(true)
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    if (user && user.fullName) {
      const res = await subscribeUser(user.id, user.fullName, sub)
      if (res.success) {
        toast.success("Subscribed successfully")
      } else {
        toast.error("Failed to subscribe")
      }
    }
    setLoading(false)
  }

  async function unsubscribeFromPush() {
    setLoading(true)
    await subscription?.unsubscribe()
    setSubscription(null)

    const res = await unsubscribeUser(
      user?.id ?? "",
      subscription?.endpoint ?? ""
    )
    if (res.success) {
      toast.success("Unsubscribed successfully")
    } else {
      toast.error("Failed to unsubscribe")
    }
    setLoading(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className='bg-white dark:bg-inherit dark:border shadow-lg rounded-lg p-4 max-w-sm w-full'>
      <h3 className='text-lg font-semibold mb-2'>Push Notifications</h3>
      {subscription ? (
        <div className='space-y-2'>
          <p className='text-sm text-gray-600'>
            You are subscribed to push notifications.
          </p>
          {loading ? (
            <Button className='w-full' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button className='w-full' onClick={unsubscribeFromPush}>
              Unsubscribe
            </Button>
          )}
        </div>
      ) : (
        <div className='space-y-2'>
          <p className='text-sm text-gray-600'>
            You are not subscribed to push notifications.
          </p>
          {loading ? (
            <Button className='w-full' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button className='w-full' onClick={subscribeToPush}>
              Subscribe
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default PushNotificationManager
