import { Calendar } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import SettingsSheet from "./settings"
import Link from "next/link"

export default function NavigationBar() {
  return (
    <footer className='fixed bottom-0 w-full border-t shadow-md h-16 z-50 bg-background'>
      <ul className='grid grid-cols-[1fr_1px_1fr] h-full'>
        <li className='flex items-center justify-center'>
          <Link href='/calendar' className='h-full w-full'>
            <Button variant='ghost' className='h-full w-full p-0'>
              <Calendar size={36} />
            </Button>
          </Link>
        </li>
        <li className='flex items-center justify-center'>
          <Separator orientation='vertical' className='h-12' />
        </li>
        <li className='flex items-center justify-center'>
          <SettingsSheet />
        </li>
      </ul>
    </footer>
  )
}
