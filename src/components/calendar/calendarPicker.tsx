"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { createEntry } from "@/actions"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { formSchema } from "@/validations/newCalendarEntry"
import { Button } from "@/components/ui/button"
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

export default function CalendarPicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showNewEntryForm, setShowNewEntryForm] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      notes: "",
      date: date,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    createEntry(values.title, values.notes ? values.notes : "", values.date)
    form.reset({
      title: "",
      notes: "",
    })
    setShowNewEntryForm(false)
  }

  const handleNewEntry = () => {
    setShowNewEntryForm(true)
  }

  // Effect to update the form's default value for date when it changes
  useEffect(() => {
    form.reset({
      ...form.getValues(),
      date: date,
    })
  }, [date, form])

  return (
    <section className='flex flex-col items-center'>
      <Calendar
        mode='single'
        selected={date}
        onSelect={setDate}
        className='border-2 border-black rounded max-w-[280px] flex justify-center m-2'
      ></Calendar>
      <Button
        disabled={showNewEntryForm ? true : false}
        onClick={handleNewEntry}
      >
        <Plus></Plus>
      </Button>
      {showNewEntryForm && (
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
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      )}
    </section>
  )
}
