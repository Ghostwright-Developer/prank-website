"use client"

import { useEffect, useState } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink, useRevealedLines } from "@/components/prank-kit"

const KEY_LINES = [
  "Sk2vYm7QxNf0pLw3aHt9cRu5eZb8dGjKo1iXyV4nMqTs6WrJhC2lP0zF",
  "x8GdA3uBvN5oEk1yTqLm7RcZ4wHsJf9XpI6tQeUb2nKj0VaYrD3gM8lC",
  "t5WzO1hSfP7xNc4RbLk9EvJq2AuGy6IdM0oTn3XwZs8HmUe1CrFj7aBp",
  "4QyKd0VnLg9TsRw2XfJhE6bPaZu8MoCi3NvYt1lGkA5DrWx7SeHq0jFz",
]

// The boot-time note shown by Bad Rabbit's dispci.exe disk locker (black screen, red text).
export default function BadRabbitScreen() {
  const [stage, setStage] = useState<"boot" | "note">("boot")
  const caret = useBlink(500)
  const { visible: boot, done } = useRevealedLines(
    [
      "Booting from Hard Disk...",
      "",
      "Verifying DMI Pool Data ........",
      "",
      "Boot from CD/DVD :",
      "",
      "Reading boot sector...",
    ],
    (i) => (i === 0 ? 400 : 650),
    { startAfter: 300 },
  )

  // Move to the ransom note once the boot lines finish.
  useEffect(() => {
    if (!done || stage !== "boot") return
    const t = setTimeout(() => setStage("note"), 1500)
    return () => clearTimeout(t)
  }, [done, stage])

  return (
    <FullscreenPrank exitMessage="DISK RESTORED - IT WAS A PRANK!" className="cursor-none bg-black font-dos text-[24px] leading-[1.2]">
      {stage === "boot" ? (
        <div className="h-full w-full p-8 text-[#c0c0c0]">
          {boot.map((l, i) => <div key={i}>{l || " "}</div>)}
          <span>{caret ? "_" : " "}</span>
        </div>
      ) : (
        <div className="h-full w-full overflow-hidden p-10 text-[#e01010]">
          <p className="mb-6">Oops! Your files have been encrypted.</p>
          <p className="mb-6">
            If you see this text, your files are no longer accessible, because they have been encrypted. Perhaps you
            are busy looking for a way to recover your files, but don&apos;t waste your time. Nobody can recover your
            files without our decryption service.
          </p>
          <p className="mb-6">
            We guarantee that you can recover all your files safely. All you need to do is submit the payment and get
            the decryption password.
          </p>
          <p className="mb-6">Visit our web service at caforssztxqzf2nm.onion</p>
          <p className="mb-2">Your personal installation key#1:</p>
          <div className="mb-6 break-all text-[20px] leading-[1.2]">
            {KEY_LINES.map((k) => <div key={k}>{k}</div>)}
          </div>
          <p>If you have already got the password, please enter it below.</p>
          <p className="mt-3">Password#1: {caret ? "█" : " "}</p>
        </div>
      )}
    </FullscreenPrank>
  )
}
