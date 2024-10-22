"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggler() {
  const { resolvedTheme, setTheme } = useTheme()

  if (resolvedTheme === "light") {
    return (
      <Button
        className='w-full'
        variant='outline'
        size='icon'
        onClick={() => setTheme("dark")}
      >
        <Moon size={28} />
      </Button>
    )
  }

  if (resolvedTheme === "dark") {
    return (
      <Button
        className='w-full'
        variant='outline'
        size='icon'
        onClick={() => setTheme("light")}
      >
        <Sun size={28} />
      </Button>
    )
  }
}
