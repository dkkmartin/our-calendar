"use client"

import { Calendar } from "@/components/ui/calendar"
import { currentPickedDateStore } from "@/lib/stores"
import { useEffect, useState } from "react"
import { entryType } from "@/types/entryType"
import { getAllEntries } from "@/actions"
import NewEventButton from "./newEventButton"

export default function CalendarPicker() {
  const pickedDateStore = currentPickedDateStore((state) => state.date)
  const setPickedDateStore = currentPickedDateStore((state) => state.setDate)
  const [entries, setEntries] = useState<entryType[]>()

  useEffect(() => {
    async function getEntries() {
      const data = await getAllEntries()
      setEntries(data)
    }
    getEntries()
  }, [])

  const handleSelect = (newState: Date | undefined) => {
    if (newState) {
      setPickedDateStore(newState)
    }
  }

  const eventDates = entries?.map((entry) =>
    new Date(entry.date).toDateString()
  )

  return (
    <section className='flex flex-col items-center'>
      <Calendar
        mode='single'
        selected={pickedDateStore}
        onSelect={handleSelect}
        className='w-screen'
        modifiers={{
          event: (date) => eventDates?.includes(date.toDateString()) || false,
        }}
        components={{
          DayContent: ({ date }) => (
            <div className='relative w-full h-full flex items-center justify-center'>
              <span>{date.getDate()}</span>
              {eventDates?.includes(date.toDateString()) && (
                <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full p-1' />
              )}
            </div>
          ),
        }}
      ></Calendar>
    </section>
  )
}
