import { getSpecificEntry } from "@/actions"
import EditEvent from "@/components/calendar/editEvent"

interface CalendarEditProps {
  params: Promise<{
    id: number
  }>
}

export default async function CalendarEdit(props: CalendarEditProps) {
  const params = await props.params;
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
