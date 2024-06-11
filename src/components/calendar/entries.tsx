"use client"

import { entryType } from "@/types/entryType"
import { FC, useState } from "react"

interface Props {
  entries: entryType[]
}

const Entries: FC<Props> = ({ entries }) => {
  const [entryItems, setEntryItems] = useState<entryType[]>(entries)
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
