"use client"

import { getSpecificEntry } from "@/actions"
import { currentPickedDateStore } from "@/lib/stores"
import { entryType } from "@/types/entryType"
import { format } from "date-fns"
import { FC, useEffect, useState } from "react"
import NewEventButton from "./newEventButton"
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"

const Entries: FC = () => {
  const pickedDateStore = currentPickedDateStore((state) => state.date)
  const [entryItems, setEntryItems] = useState<entryType[]>()

  useEffect(() => {
    async function getEntryData() {
      //@ts-ignore
      const data = await getSpecificEntry(pickedDateStore!)
      setEntryItems(data)
    }
    getEntryData()
  }, [pickedDateStore])

  return (
    <div className='flex flex-col items-center gap-4 m-4'>
      <section className='p-4 rounded-lg w-full'>
        <h2 className='text-2xl font-bold mb-4'>
          {format(pickedDateStore!, "MMMM d, yyyy")}
        </h2>
        {entryItems && entryItems.length > 0 ? (
          <ul className='flex flex-col gap-4'>
            {entryItems.map((entry, index) => (
              <li key={index}>
                <article className='bg-white p-4 rounded-md shadow flex justify-between items-center'>
                  <div>
                    <h3 className='text-xl font-semibold mb-2'>
                      {entry.title}
                      {entry.time && (
                        <span className='ml-2 text-sm text-gray-500'>
                          ({entry.time.slice(0, 5)})
                        </span>
                      )}
                    </h3>
                    <p className='text-gray-600'>{entry.notes}</p>
                  </div>
                  <Button variant='outline' size='icon'>
                    <Pencil />
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500'>No entries for this date.</p>
        )}
      </section>
      <NewEventButton></NewEventButton>
    </div>
  )
}
export default Entries
