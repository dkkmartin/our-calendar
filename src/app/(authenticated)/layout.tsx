"use client"
import NavigationBar from "@/components/navbar/navigationBar"
import { Toaster } from "@/components/ui/sonner"
import { currentPickedDateStore } from "@/lib/stores"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { format } from "date-fns"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pickedDateStore = currentPickedDateStore((state) => state.date)

  return (
    <>
      <header className='flex justify-between items-center px-8 py-4 border-b'>
        <h1 className='text-3xl font-bold'>
          {format(pickedDateStore!, "d MMMM, yyyy")}
        </h1>
        <SignedIn>
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
          />
        </SignedIn>
      </header>
      <main className='pb-16'>{children}</main>
      <Toaster />
      <NavigationBar />
    </>
  )
}
