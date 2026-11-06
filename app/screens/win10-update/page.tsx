'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'
export default function Win10UpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#0078d4] flex flex-col items-center justify-center font-sans">
        <div className="text-white text-center space-y-6">
          <div className="text-5xl animate-spin">↻</div>
          <h1 className="text-4xl font-bold">Getting Windows Ready</h1>
          <p className="text-xl">Don't turn off your PC. This will take a few minutes.</p>
          <div className="w-80 h-2 bg-white/20 rounded">
            <div className="h-full w-3/4 bg-white rounded animate-pulse"></div>
          </div>
          <p className="text-lg">73%</p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
