import NewEvent from "@/components/calendar/newEvent"

interface CalendarAddProps {
  params: Promise<{
    date: string
  }>
}

export default async function CalendarAdd(props: CalendarAddProps) {
  const params = await props.params;
  return (
    <section>
      <NewEvent date={params.date}></NewEvent>
    </section>
  )
}
