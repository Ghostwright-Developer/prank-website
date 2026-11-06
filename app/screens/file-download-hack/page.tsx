'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

export default function FileDownloadHackScreen() {
  const [phase, setPhase] = useState<'download' | 'extract' | 'execute' | 'hack'>('download')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (phase === 'download') { setPhase('extract'); return 0 }
          if (phase === 'extract') { setPhase('execute'); return 0 }
          if (phase === 'execute') { setPhase('hack'); clearInterval(timer); return 100 }
        }
        return prev + Math.random() * 5
      })
    }, 100)
    return () => clearInterval(timer)
  }, [phase])

  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black p-8 font-mono text-green-500">
        <div className="max-w-2xl mx-auto">
          <div className="text-red-500 text-xl mb-8 text-center animate-pulse">
            MALWARE DETECTED - SYSTEM COMPROMISED
          </div>
          
          <div className="space-y-6">
            <div className={phase === 'download' ? 'text-yellow-400' : 'text-green-600'}>
              [1/4] Downloading payload... {phase !== 'download' ? '100%' : `${Math.min(100, Math.floor(progress))}%`}
            </div>
            <div className={phase === 'extract' ? 'text-yellow-400' : phase === 'download' ? 'text-gray-600' : 'text-green-600'}>
              [2/4] Extracting malware... {phase === 'download' ? '' : phase === 'extract' ? `${Math.min(100, Math.floor(progress))}%` : '100%'}
            </div>
            <div className={phase === 'execute' ? 'text-yellow-400' : phase === 'hack' ? 'text-green-600' : 'text-gray-600'}>
              [3/4] Executing trojan.exe... {phase === 'execute' ? `${Math.min(100, Math.floor(progress))}%` : phase === 'hack' ? '100%' : ''}
            </div>
            <div className={phase === 'hack' ? 'text-red-500 animate-pulse' : 'text-gray-600'}>
              [4/4] {phase === 'hack' ? 'SYSTEM FULLY COMPROMISED!' : 'Waiting...'}
            </div>
          </div>

          {phase === 'hack' && (
            <div className="mt-8">
              <div className="text-green-500 font-mono">
                {">"} C:\Windows\System32\trojan.exe running...
              </div>
              <div className="text-green-500 font-mono mt-2">
                {">"} <span className="animate-pulse">_</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </FullscreenPrank>
  )
}
