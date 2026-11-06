"use client"

import { useState, useEffect } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const panicText = `panic(cpu 0 caller 0xffffff800a1b2c3d): "Unable to find driver for this platform: \\"ACPI\\"."\n@/BuildRoot/Library/Caches/com.apple.xbs/Sources/xnu/xnu-8020.121.3/osfmk/kern/debug.c:327
Debugger message: panic
Memory ID: 0xff
OS release type: User
OS version: 23A344
Kernel version: Darwin Kernel Version 23.0.0: Fri Sep 15 14:41:43 PDT 2023; root:xnu-8020.121.3~1/RELEASE_ARM64_T6020
Fileset Kernelcache UUID: 7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D
Kernel UUID: A1B2C3D4-E5F6-7890-ABCD-EF1234567890
Boot session UUID: 12345678-90AB-CDEF-1234-567890ABCDEF
iBoot version: iBoot-8422.121.1
secure boot?: YES
Paniclog version: 14
Kernel slide: 0x0000000029e00000
Kernel text base: 0xffffff800a200000
mach_absolute_time: 0x0000000123456789
Epoch Time: sec       usec
  Boot    : 0x65432100 0x00000000
  Sleep   : 0x00000000 0x00000000
  Wake    : 0x00000000 0x00000000
  Calendar: 0x65432100 0x00000000

Zone info:
  Zone map: 0xffffff800a200000 - 0xffffff800e200000
  . PGZ   : 0xffffff800a200000 - 0xffffff800a400000
  . VM    : 0xffffff800a400000 - 0xffffff800c200000
  . RO    : 0xffffff800c200000 - 0xffffff800c400000
  . GEN0  : 0xffffff800c400000 - 0xffffff800c600000
  . GEN1  : 0xffffff800c600000 - 0xffffff800c800000
  . GEN2  : 0xffffff800c800000 - 0xffffff800ca00000
  . GEN3  : 0xffffff800ca00000 - 0xffffff800cc00000
  . DATA  : 0xffffff800cc00000 - 0xffffff800e200000
  Metadata: 0xffffff9000000000 - 0xffffffa000000000
  Bitmaps : 0xffffffa000000000 - 0xffffffa800000000

TPM: UNAVAILABLE
SMC: PANIC
CPU: 0
PL: 0

Panicked task 0xffffff900d1e2f3a: 3924 pages, 1 threads: pid 0: kernel_task
Panicked thread: 0xffffff900d4e5f6a, backtrace: 0xfffffff30d6e7f8a, tid: 123

          lr: 0xffffff800a1b2c3d  fp: 0xfffffff30d6e8040
          lr: 0xffffff800a1b2c3d  fp: 0xfffffff30d6e8070
          lr: 0xffffff800a3c4d5e  fp: 0xfffffff30d6e80d0
          lr: 0xffffff800a5e6f7a  fp: 0xfffffff30d6e8180
          lr: 0xffffff800a7a8b9c  fp: 0xfffffff30d6e8240

** SYSTEM WILL RESTART **`

export default function KernelPanicScreen() {
  const [showText, setShowText] = useState(false)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Fade in effect
    const fadeTimer = setTimeout(() => {
      setShowText(true)
      setOpacity(1)
    }, 500)

    return () => clearTimeout(fadeTimer)
  }, [])

  return (
    <FullscreenPrank exitMessage="KERNEL RESTORED!" className="bg-black">
      <div 
        className="flex h-full w-full items-center justify-center bg-black p-8 transition-opacity duration-1000"
        style={{ opacity }}
      >
        <div className="w-full max-w-2xl text-center">
          {/* macOS Panic Icon */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-b from-gray-700 to-gray-900 shadow-2xl">
              <svg
                viewBox="0 0 24 24"
                className="h-20 w-20 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 8v4" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Main message */}
          <h1 className="mb-6 text-2xl font-light text-white">
            Your computer restarted because of a problem.
          </h1>

          <p className="mb-8 text-gray-400">
            Press a key or wait a few seconds to continue starting up.
          </p>

          {/* Panic log preview */}
          {showText && (
            <div className="mx-auto max-h-64 w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-950 p-4 text-left">
              <pre className="overflow-hidden font-mono text-xs text-gray-500 whitespace-pre-wrap">
                {panicText}
              </pre>
            </div>
          )}

          {/* Languages hint - like real macOS */}
          <div className="mt-8 flex justify-center gap-4 text-xs text-gray-600">
            <span>English</span>
            <span>Deutsch</span>
            <span>Francais</span>
            <span>Espanol</span>
            <span>Nederlands</span>
          </div>

          {/* Hint */}
          <p className="mt-8 text-xs text-gray-700">
            (This is a prank. Press ESC or Q to exit)
          </p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
