"use client"

import { getSpecificEntry } from "@/actions"
import { currentPickedDateStore } from "@/lib/stores"
import { entryType } from "@/types/entryType"
import { FC, useEffect, useState } from "react"

const Entries: FC = () => {
  const pickedDateStore = currentPickedDateStore((state) => state.date)
  const [entryItems, setEntryItems] = useState<entryType[]>()

  useEffect(() => {
    async function getEntryData() {
      const data = await getSpecificEntry(pickedDateStore!)
      setEntryItems(data)
    }
    getEntryData()
  }, [pickedDateStore])

  useEffect(() => {
    console.log(pickedDateStore)
  }, [pickedDateStore])

  return (
    <section>
      {entryItems &&
        entryItems.map((entry, index) => (
          <div key={index}>
            <p>{entry.title}</p>
            <p>{entry.notes}</p>
            <p>{entry.date.toString()}</p>
          </div>
        ))}
    </section>
  )
}
export default Entries
