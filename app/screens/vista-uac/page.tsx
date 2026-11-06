"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

interface UACDialog {
  id: number
  program: string
  publisher: string
}

const programs = [
  { program: "cmd.exe", publisher: "Microsoft Corporation" },
  { program: "notepad.exe", publisher: "Microsoft Corporation" },
  { program: "explorer.exe", publisher: "Microsoft Corporation" },
  { program: "setup.exe", publisher: "Unknown" },
  { program: "installer.exe", publisher: "Unknown" },
  { program: "update.exe", publisher: "Unknown" },
  { program: "rundll32.exe", publisher: "Microsoft Corporation" },
  { program: "msiexec.exe", publisher: "Microsoft Corporation" },
  { program: "regedit.exe", publisher: "Microsoft Corporation" },
  { program: "svchost.exe", publisher: "Microsoft Corporation" },
]

export default function VistaUACScreen() {
  const [dialogs, setDialogs] = useState<UACDialog[]>([])
  const [idCounter, setIdCounter] = useState(0)

  useEffect(() => {
    const addDialog = () => {
      const prog = programs[Math.floor(Math.random() * programs.length)]
      setDialogs((prev) => [
        ...prev,
        { id: idCounter, ...prog },
      ])
      setIdCounter((prev) => prev + 1)
    }

    // Initial dialogs
    for (let i = 0; i < 2; i++) {
      setTimeout(addDialog, i * 300)
    }

    const interval = setInterval(addDialog, 1200)
    return () => clearInterval(interval)
  }, [idCounter])

  const handleResponse = (id: number) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id))
    // Spawn more dialogs
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        const prog = programs[Math.floor(Math.random() * programs.length)]
        setDialogs((prev) => [
          ...prev,
          { id: Date.now() + i, ...prog },
        ])
      }
    }, 100)
  }

  return (
    <FullscreenPrank className="cursor-default" exitMessage="PERMISSIONS GRANTED!">
      {/* Dimmed desktop */}
      <div className="h-full w-full bg-black/90">
        {/* UAC Dialogs */}
        {dialogs.map((dialog, index) => (
          <div
            key={dialog.id}
            className="absolute left-1/2 top-1/2 w-[450px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/20 bg-[#1a1a1a] shadow-2xl"
            style={{
              transform: `translate(-50%, -50%) translate(${(index % 5) * 20 - 40}px, ${(index % 5) * 20 - 40}px)`,
              zIndex: dialog.id,
            }}
          >
            {/* Aero glass effect header */}
            <div className="bg-gradient-to-b from-white/10 to-transparent p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-2xl shadow-lg">
                  🛡️
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    User Account Control
                  </h2>
                  <p className="mt-1 text-sm text-gray-300">
                    Do you want to allow the following program to make changes to this computer?
                  </p>
                </div>
              </div>
            </div>

            {/* Program details */}
            <div className="border-t border-white/10 bg-[#0a0a0a] p-4">
              <div className="mb-4 rounded bg-[#1e1e1e] p-3">
                <p className="text-sm text-gray-400">Program name:</p>
                <p className="font-mono text-white">{dialog.program}</p>
                <p className="mt-2 text-sm text-gray-400">Verified publisher:</p>
                <p className={dialog.publisher === "Unknown" ? "text-red-400" : "text-green-400"}>
                  {dialog.publisher}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleResponse(dialog.id)}
                  className="rounded border border-white/20 bg-gradient-to-b from-[#3d3d3d] to-[#2a2a2a] px-6 py-2 text-sm text-white transition-colors hover:from-[#4a4a4a] hover:to-[#3a3a3a]"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleResponse(dialog.id)}
                  className="rounded border border-white/20 bg-gradient-to-b from-[#3d3d3d] to-[#2a2a2a] px-6 py-2 text-sm text-white transition-colors hover:from-[#4a4a4a] hover:to-[#3a3a3a]"
                >
                  No
                </button>
              </div>
            </div>

            {/* Show details link */}
            <div className="border-t border-white/10 bg-[#0a0a0a] px-4 py-2">
              <button className="text-xs text-blue-400 hover:underline">
                Show details
              </button>
            </div>
          </div>
        ))}
      </div>
    </FullscreenPrank>
  )
}
