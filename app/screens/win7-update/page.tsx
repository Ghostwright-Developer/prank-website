'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'
export default function Win7UpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black flex flex-col items-center justify-center font-sans">
        <div className="text-white text-center space-y-6">
          <div className="text-6xl">⟳</div>
          <h1 className="text-3xl font-bold">Installing Update</h1>
          <p className="text-lg">Windows 7 Update KB2670838</p>
          <div className="w-96 h-8 bg-[#1a1a1a] border border-[#444] rounded">
            <div className="h-full w-2/3 bg-gradient-to-r from-[#0078d4] to-[#00a4ef]"></div>
          </div>
          <p className="text-sm text-gray-400">35% - Estimated time remaining: 45 minutes</p>
          <p className="text-xs text-gray-600 mt-6">Do not turn off your computer</p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
