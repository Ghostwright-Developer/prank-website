'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function BiosScreen() {
  const messages = [
    'Award BIOS Setup Utility v6.00PG',
    'Copyright (c) Award Software, Inc.',
    '',
    'Press DEL to enter Setup',
    '',
    'Main Processor  : Intel Core i7-9700K @ 3.6 GHz',
    'Memory Size     : 16384 MB',
    'Video Memory    : 512 MB',
    'Hard Disk Drive : 465 GB',
    '',
    'IDE 1 Master   : ST3500418AS',
    'IDE 1 Slave    : QEMU HARDDISK',
    '',
    'Floppy Drive   : Not Detected',
    'Onboard Audio  : Enabled',
    '',
    '',
    'Press ESC to quit',
    '',
    'Boot from: Hard Drive'
  ]

  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black p-8 font-mono text-amber-600 text-sm leading-relaxed overflow-hidden">
        <div className="space-y-1">
          {messages.map((line, i) => (
            <div key={i} className="text-sm">{line}</div>
          ))}
        </div>
        
        <div className="fixed bottom-8 left-8 space-y-2 text-base font-bold">
          <div className="text-red-500 animate-pulse">CRITICAL ERROR</div>
          <div className="text-amber-600 text-sm">BIOS Checksum Failed</div>
          <div className="text-amber-600 text-sm">CPU: Overheating</div>
          <div className="text-amber-600 text-sm">HDD: Corrupted</div>
          <div className="text-red-500 mt-4">SYSTEM HALTED</div>
          <div className="text-amber-600 text-sm mt-4">_<span className="animate-pulse">|</span></div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
