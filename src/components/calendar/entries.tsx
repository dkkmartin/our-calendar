"use client"

import { deleteEntry, getSpecificEntries } from "@/actions"
import { currentPickedDateStore } from "@/lib/stores"
import { entryType } from "@/types/entryType"
import { FC, useCallback, useEffect, useState } from "react"
import NewEventButton from "./newEventButton"
import { Button } from "../ui/button"
import { Pencil, Trash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const Entries: FC = () => {
  const pickedDateStore = currentPickedDateStore((state) => state.date)
  const [entryItems, setEntryItems] = useState<entryType[]>()
  const [entryExpanded, setEntryExpanded] = useState(false)

  function handleDelete(id: number) {
    deleteEntry(id)
    fetchEntryData()
  }

  function handleArticleClick() {
    setEntryExpanded(!entryExpanded)
  }

  const fetchEntryData = useCallback(async () => {
    //@ts-ignore
    const data = await getSpecificEntries(pickedDateStore!)
    setEntryItems(data)
  }, [pickedDateStore])

  useEffect(() => {
    fetchEntryData()
  }, [pickedDateStore, fetchEntryData])

  return (
    <div className='flex flex-col items-center gap-4 m-4'>
      <div className='flex justify-between items-center w-full px-4'>
        <h2 className='text-2xl font-bold self-start '>
          {entryItems && entryItems.length}{" "}
          {entryItems && entryItems.length === 1 ? "event" : "events"} for today
        </h2>
        <NewEventButton />
      </div>
      <section className='p-4 w-full overflow-scroll'>
        {entryItems && entryItems.length > 0 ? (
          <ul className='flex flex-col gap-4'>
            {entryItems.map((entry, index) => (
              <li key={index}>
                <article className='bg-white p-4 rounded-md shadow flex justify-between items-center'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center mb-2'>
                      {entry.userImage && (
                        <Image
                          src={entry.userImage}
                          alt={entry.userName}
                          className='w-8 h-8 rounded-full mr-2 object-cover'
                          width={32}
                          height={32}
                        />
                      )}
                      <p className='text-sm mb-2'>{entry.userName}</p>
                    </div>

                    <h3 className='text-xl font-semibold'>
                      {entry.title}
                      {entry.time && (
                        <span className='ml-2 text-sm text-gray-500'>
                          ({entry.time.slice(0, 5)})
                        </span>
                      )}
                    </h3>
                    <p
                      onClick={handleArticleClick}
                      className={`text-gray-600 ${
                        entryExpanded ? null : "truncate"
                      }`}
                    >
                      {entry.notes}
                    </p>
                  </div>
                  <div className='flex gap-2 ml-4'>
                    <Button variant='outline' size='icon'>
                      <Link href={`/calendar/edit/${entry.id}`}>
                        <Pencil size={18} />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleDelete(entry.id)}
                      variant='outline'
                      size='icon'
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-gray-500'>No entries for this date.</p>
        )}
      </section>
    </div>
  )
}
export default Entries
