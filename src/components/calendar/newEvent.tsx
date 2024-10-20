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

export default function NewEvent({ date }: { date: string }) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      notes: "",
      date: new Date(date),
      time: "",
    },
  })
  const { user } = useUser()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createEntry(
      values.title,
      values.notes ?? "",
      values.date,
      values.time ?? "",
      user?.primaryEmailAddressId ?? "",
      user?.fullName ?? "",
      user?.imageUrl ?? ""
    )
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
                  <Input {...field} type='time' value={field.value || ""} />
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
