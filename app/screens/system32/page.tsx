"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const system32Files = [
  "kernel32.dll",
  "ntdll.dll",
  "user32.dll",
  "gdi32.dll",
  "advapi32.dll",
  "shell32.dll",
  "ole32.dll",
  "oleaut32.dll",
  "rpcrt4.dll",
  "comctl32.dll",
  "comdlg32.dll",
  "version.dll",
  "wininet.dll",
  "urlmon.dll",
  "shlwapi.dll",
  "crypt32.dll",
  "msvcrt.dll",
  "ws2_32.dll",
  "mswsock.dll",
  "ntoskrnl.exe",
  "hal.dll",
  "csrss.exe",
  "smss.exe",
  "winlogon.exe",
  "services.exe",
  "lsass.exe",
  "svchost.exe",
  "explorer.exe",
  "taskmgr.exe",
  "cmd.exe",
  "notepad.exe",
  "regedit.exe",
  "mspaint.exe",
  "calc.exe",
  "drivers/",
  "config/",
  "winsxs/",
  "en-US/",
  "Boot.ini",
  "NTLDR",
  "bootmgr",
]

export default function System32Screen() {
  const [deletedFiles, setDeletedFiles] = useState<string[]>([])
  const [currentFile, setCurrentFile] = useState("")
  const [progress, setProgress] = useState(0)
  const [showError, setShowError] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    let fileIndex = 0
    
    const deleteInterval = setInterval(() => {
      if (fileIndex < system32Files.length) {
        const file = system32Files[fileIndex]
        setCurrentFile(file)
        setDeletedFiles((prev) => [...prev, file])
        setProgress(Math.floor((fileIndex / system32Files.length) * 100))
        fileIndex++

        // Show fake error at 75%
        if (fileIndex === Math.floor(system32Files.length * 0.75)) {
          setShowError(true)
          setTimeout(() => setShowError(false), 2000)
        }
      } else {
        clearInterval(deleteInterval)
        setProgress(100)
        setCurrentFile("COMPLETE - System failure imminent")
        setComplete(true)
      }
    }, 150)

    return () => clearInterval(deleteInterval)
  }, [])

  return (
    <FullscreenPrank sound="typing" exitMessage="SYSTEM RESTORED!" className="bg-black">
      <div className="flex h-full w-full flex-col bg-black p-8 font-mono">
        {/* Header */}
        <div className="mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-2xl text-red-500">C:\Windows\System32</h1>
          <p className="text-gray-500">Administrator Command Prompt</p>
        </div>

        {/* Command being executed */}
        <div className="mb-4">
          <p className="text-gray-400">
            {">"} del /f /s /q C:\Windows\System32\*.*
          </p>
          <p className="mt-2 text-yellow-500">
            WARNING: Deleting critical system files...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>Deleting files...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current file being deleted */}
        <div className="mb-4">
          <p className="text-gray-500">Currently deleting:</p>
          <p className="text-red-400">C:\Windows\System32\{currentFile}</p>
        </div>

        {/* Deleted files log */}
        <div className="flex-1 overflow-hidden rounded border border-gray-800 bg-gray-950 p-4">
          <p className="mb-2 text-xs text-gray-600">Deletion Log:</p>
          <div className="h-64 overflow-y-auto">
            {deletedFiles.map((file, i) => (
              <p key={i} className="text-xs text-red-400/80">
                Deleted: C:\Windows\System32\{file}
              </p>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-8 text-sm">
          <div>
            <span className="text-gray-500">Files deleted: </span>
            <span className="text-red-400">{deletedFiles.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Space freed: </span>
            <span className="text-red-400">{(deletedFiles.length * 2.3).toFixed(1)} MB</span>
          </div>
        </div>

        {/* Terminal freeze with blinking cursor */}
        {complete && (
          <div className="mt-6 border-t border-gray-800 pt-4">
            <p className="text-red-500 font-bold">FATAL ERROR: System32 has been destroyed.</p>
            <p className="text-gray-400 mt-2">{">"} _<span className="animate-pulse">|</span></p>
          </div>
        )}

        {/* Error popup */}
        {showError && (
          <div className="fixed left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded border border-red-600 bg-gray-900 p-4 shadow-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">X</span>
              <span className="font-bold text-red-500">Critical Error</span>
            </div>
            <p className="text-sm text-gray-300">
              Access denied: File is in use by another process.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Attempting to force delete...
            </p>
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}
