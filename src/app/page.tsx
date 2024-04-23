import { getServerAuthSession } from "@/server/auth";
import EventForm from "./_components/NewEvent";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <div>
      <EventForm></EventForm>
    </div>
  );
}
