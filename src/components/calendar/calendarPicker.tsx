"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { formatISO } from "date-fns"
import { currentPickedDateStore } from "@/lib/stores"

export default function CalendarPicker() {
  const pickedDateStore = currentPickedDateStore((state) => state.date)
  const setPickedDateStore = currentPickedDateStore((state) => state.setDate)

  const handleSelect = (newState: Date | undefined) => {
    if (newState) {
      setPickedDateStore(newState)
    }
  }

  return (
    <section className='flex flex-col items-center'>
      <Calendar
        mode='single'
        selected={pickedDateStore}
        onSelect={handleSelect}
        className='border-2 border-black rounded max-w-[280px] flex justify-center m-2'
      ></Calendar>
      {pickedDateStore && (
        <Link
          href={`/calendar/${formatISO(pickedDateStore, {
            representation: "date",
          })}`}
        >
          <Button>
            <Plus></Plus>
          </Button>
        </Link>
      )}
    </section>
  )
}
