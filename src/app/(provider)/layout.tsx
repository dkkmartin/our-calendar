"use client"
import { ClerkProvider } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()
  return (
    <ClerkProvider appearance={theme === "dark" ? { baseTheme: dark } : {}}>
      {children}
    </ClerkProvider>
  )
}
