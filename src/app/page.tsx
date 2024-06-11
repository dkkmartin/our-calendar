import { getEntries } from "@/actions"
import CalendarPicker from "@/components/calendar/calendarPicker"
import Entries from "@/components/calendar/entries"

export default async function Home() {
  const data = await getEntries()
  return (
    <section>
      <CalendarPicker></CalendarPicker>
      <Entries entries={data}></Entries>
    </section>
  )
}
