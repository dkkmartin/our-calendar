import { getSpecificEntry } from "@/actions"
import EditEvent from "@/components/calendar/editEvent"

interface CalendarEditProps {
  params: {
    id: number
  }
}

export default async function CalendarEdit({ params }: CalendarEditProps) {
  const event = await getSpecificEntry(params.id)

  return (
    <section>
      <EditEvent id={params.id} event={event[0]} />
    </section>
  )
}
