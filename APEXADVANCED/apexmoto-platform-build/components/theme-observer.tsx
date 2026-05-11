"use client"

import { useDynamicTheme } from "@/hooks/use-dynamic-theme"

export function ThemeObserver() {
  useDynamicTheme() // This will now run on the client as intended
  return null // This component doesn't render anything, it just manages the theme state
}
