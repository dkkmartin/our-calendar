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
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateEntry(
      id,
      values.title,
      values.notes ? values.notes : "",
      values.time ?? ""
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

          <Button className='w-full' type='submit'>
            Submit
          </Button>
        </form>
      </Form>
    </section>
  )
}
