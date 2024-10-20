import CalendarPicker from "@/components/calendar/calendarPicker"
import Entries from "@/components/calendar/entries"
import PushNotificationManager from "@/components/user/pushNotificationManager"

export default function Home() {
  return (
    <section>
      <CalendarPicker></CalendarPicker>
      <Entries></Entries>
    </section>
  )
}
