import { currentPickedDateStore } from "@/lib/stores"
import { formatISO } from "date-fns"
import Link from "next/link"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export default function NewEventButton() {
  const pickedDateStore = currentPickedDateStore((state) => state.date)

  return (
    pickedDateStore && (
      <Link
        href={`/calendar/${formatISO(pickedDateStore, {
          representation: "date",
        })}`}
      >
        <Button>
          <Plus></Plus>
        </Button>
      </Link>
    )
  )
}
