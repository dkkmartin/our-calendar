import { getServerAuthSession } from "@/server/auth";
import EventForm from "./_components/NewEvent";
import AuthenticationBar from "./_components/AuthenticationBar";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session) {
    return (
      <div>
        <AuthenticationBar></AuthenticationBar>
        <EventForm sessionId={session?.user?.id}></EventForm>
      </div>
    );
  }
  return <AuthenticationBar></AuthenticationBar>;
}
