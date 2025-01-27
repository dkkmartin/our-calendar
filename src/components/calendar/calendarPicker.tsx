"use client"

import { Calendar } from "@/components/ui/calendar"
import { currentPickedDateStore, useEntriesStore } from "@/lib/stores"
import { useEffect, useState } from "react"
import { useRef, TouchEvent } from "react"
import {
  addMonths,
  format,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns"

export default function CalendarPicker() {
  const pickedDateStore = currentPickedDateStore((state) => state.date)
  const setPickedDateStore = currentPickedDateStore((state) => state.setDate)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const touchStartX = useRef<number | null>(null)
  const eventDates = useEntriesStore((state) => state.eventDates)

  useEffect(() => {
    useEntriesStore.getState().fetchEntries()
  }, [])

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const utcDate = startOfDay(newDate)
      setPickedDateStore(format(utcDate, "yyyy-MM-dd"))
      setCurrentMonth(startOfMonth(utcDate))
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (Math.abs(diff) > 100) {
      // Threshold for swipe
      if (diff > 0) {
        // Swipe left, go to next month
        setCurrentMonth(addMonths(currentMonth, 1))
      } else {
        // Swipe right, go to previous month
        setCurrentMonth(subMonths(currentMonth, 1))
      }
    }

    touchStartX.current = null
  }

  return (
    <section
      className='flex flex-col items-center border-b'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Calendar
        mode='single'
        selected={new Date(pickedDateStore)}
        onSelect={handleSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        modifiers={{
          event: (date) => eventDates.includes(date.toDateString()),
        }}
        components={{
          DayContent: ({ date }) => (
            <div className='relative w-full h-full flex items-center justify-center'>
              <span>{date.getDate()}</span>
              {eventDates.includes(date.toDateString()) && (
                <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full p-1' />
              )}
            </div>
          ),
        }}
      />
    </section>
  )
}
