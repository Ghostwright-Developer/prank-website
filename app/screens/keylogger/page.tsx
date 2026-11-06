'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

export default function KeyloggerScreen() {
  const [keys, setKeys] = useState<string[]>([])
  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return
      setKeys(prev => [...prev.slice(-50), e.key === ' ' ? '[SPACE]' : e.key === 'Enter' ? '[ENTER]' : e.key])
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black p-8 font-mono text-green-500 text-sm">
        <div className="border border-green-500 p-4 mb-4">
          <div className="text-red-500 font-bold mb-2">KEYLOGGER ACTIVE</div>
          <div className="text-xs text-green-400">Recording all keystrokes...</div>
        </div>
        <div className="border border-green-900 p-4 h-64 overflow-auto bg-black/50">
          <div className="text-xs text-green-300">Captured keystrokes:</div>
          <div className="mt-2 text-yellow-400 break-all">
            {keys.join(' ')}
            <span className="animate-pulse">|</span>
          </div>
        </div>
        <div className="mt-4 border border-green-900 p-4 bg-black/50">
          <div className="text-xs text-green-600 mb-2">root@keylogger:~# _<span className="animate-pulse">|</span></div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
