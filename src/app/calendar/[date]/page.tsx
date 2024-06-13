import NewEvent from "@/components/calendar/newEvent"

interface CalendarAddProps {
  params: {
    date: string
  }
}

export default function CalendarAdd({ params }: CalendarAddProps) {
  return (
    <section>
      <NewEvent date={params.date}></NewEvent>
    </section>
  )
}
