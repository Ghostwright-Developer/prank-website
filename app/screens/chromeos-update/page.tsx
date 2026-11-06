'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function ChromeOSUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 mb-8">
          <svg viewBox="0 0 100 100" className="animate-spin-slow">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#4285f4" strokeWidth="8" strokeDasharray="70 200" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ea4335" strokeWidth="8" strokeDasharray="70 200" strokeDashoffset="-70" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fbbc05" strokeWidth="8" strokeDasharray="70 200" strokeDashoffset="-140" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#34a853" strokeWidth="8" strokeDasharray="70 200" strokeDashoffset="-210" />
          </svg>
        </div>
        <div className="text-gray-800 text-xl mb-2">Updating Chrome OS...</div>
        <div className="text-gray-500">Your Chromebook will restart when finished.</div>
        <div className="text-gray-400 text-sm mt-8">99% complete</div>
      </div>
    </FullscreenPrank>
  )
}
