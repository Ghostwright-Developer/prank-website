'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function Win8UpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#1d1d1d] flex flex-col items-center justify-center">
        <div className="flex gap-2 mb-8">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: `${i * 0.15}s`}} />
          ))}
        </div>
        <div className="text-white text-xl">Installing update 3 of 47...</div>
        <div className="text-gray-400 mt-4">Do not turn off your computer</div>
      </div>
    </FullscreenPrank>
  )
}
