"use client"

import { createEntry } from "@/actions"
import { formSchema } from "@/validations/newCalendarEntry"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Switch } from "../ui/switch"
import { DatePicker } from "./datePicker"
import { format } from "date-fns"
import { toast } from "sonner"

export default function NewEvent({ date }: { date: string }) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      notes: "",
      date: new Date(date),
      time: "",
      notificationEnabled: false,
      notificationDate: undefined,
    },
  })
  const { user } = useUser()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedDate = format(values.date, "yyyy-MM-dd")
    const formattedNotificationDate = values.notificationDate
      ? format(values.notificationDate, "yyyy-MM-dd")
      : null
    const res = await createEntry(
      values.title,
      values.notes ?? "",
      formattedDate,
      values.time ?? "",
      formattedNotificationDate,
      values.notificationEnabled,
      user?.id ?? "",
      user?.fullName ?? "",
      user?.imageUrl ?? ""
    )
    if (res.success) {
      router.push("/calendar")
      toast.success("Event created successfully")
    } else {
      toast.error("Failed to create event")
    }
  }

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create new event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>The title of the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>Any notes for the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} type='time' value={field.value || ""} />
                </FormControl>
                <FormDescription>The time of the event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='notificationEnabled'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>
                    Enable Notification
                  </FormLabel>
                  <FormDescription>
                    Receive a notification for this event
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("notificationEnabled") && (
            <FormField
              control={form.control}
              name='notificationDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Notification Date</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormDescription>
                    Choose when to receive the notification
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button className='w-full' type='submit'>
            Submit
          </Button>
        </form>
      </Form>
    </section>
  )
}
