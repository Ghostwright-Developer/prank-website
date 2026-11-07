"use client"

import { useEffect, useState } from "react"

/**
 * Current local time, set after mount. Rendering `new Date()` during the first
 * render makes the server HTML (server time zone) differ from the browser's,
 * which causes a hydration error.
 */
export function Clock({
  className,
  options = { hour: "numeric", minute: "2-digit" },
  kind = "time",
}: {
  className?: string
  options?: Intl.DateTimeFormatOptions
  kind?: "time" | "date"
}) {
  const [time, setTime] = useState("")
  useEffect(() => {
    const update = () => setTime(kind === "date" ? new Date().toLocaleDateString([], options) : new Date().toLocaleTimeString([], options))
    update()
    const id = setInterval(update, 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <span className={className} suppressHydrationWarning>
      {time}
    </span>
  )
}
