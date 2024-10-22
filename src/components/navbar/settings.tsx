"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SettingsIcon } from "lucide-react"
import PushNotificationManager from "../user/pushNotificationManager"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { ThemeToggler } from "../theme/theme-toggler"

export default function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger className='h-full w-full overflow-hidden flex items-center justify-center active:scale-95 transition-transform duration-75'>
        <SettingsIcon size={36} />
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetHeader className='text-start'>
          <SheetTitle className='text-2xl font-bold'>Settings</SheetTitle>
          <Separator className='my-4' />
        </SheetHeader>
        <div className='py-6 flex flex-col gap-4'>
          <ThemeToggler />
          <PushNotificationManager />
        </div>
      </SheetContent>
    </Sheet>
  )
}
