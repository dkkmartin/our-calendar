import { getSpecificEntry } from "@/actions"
import EditEvent from "@/components/calendar/editEvent"

interface CalendarEditProps {
  params: {
    id: number
  }
}

export default async function CalendarEdit({ params }: CalendarEditProps) {
  const event = await getSpecificEntry(params.id)
  const eventData = event.data?.[0]
  if (!eventData) {
    return <div>Event not found</div>
  }
  return (
    <section>
      <EditEvent id={params.id} event={eventData} />
    </section>
  )
}
