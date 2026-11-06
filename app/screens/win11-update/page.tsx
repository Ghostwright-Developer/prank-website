'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function Win11UpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin" />
        </div>
        <div className="text-white text-2xl mb-4">Working on updates</div>
        <div className="text-white text-lg mb-2">99% complete</div>
        <div className="text-gray-400 text-sm">Don't turn off your PC. This will take a while.</div>
        <div className="text-gray-400 text-sm mt-2">Your PC will restart several times.</div>
      </div>
    </FullscreenPrank>
  )
}
