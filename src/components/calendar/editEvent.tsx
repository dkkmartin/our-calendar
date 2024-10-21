"use client"

import { updateEntry } from "@/actions"
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
import { entryType } from "@/types/entryType"
import { DatePicker } from "./datePicker"
import { Switch } from "../ui/switch"

export default function EditEvent({
  id,
  event,
}: {
  id: number
  event: entryType
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title,
      notes: event.notes ?? "",
      date: new Date(event.date),
      time: event.time ?? "",
      notificationEnabled: event.notificationEnabled ?? false,
      notificationDate: event.notificationDate
        ? new Date(event.notificationDate)
        : undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateEntry(
      id,
      values.title,
      values.notes ? values.notes : "",
      values.time ?? "",
      values.notificationDate ?? null,
      values.notificationEnabled
    )
    form.reset({
      title: "",
      notes: "",
      time: "",
    })
    router.push("/calendar")
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
                  <Input {...field} type='time' />
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
