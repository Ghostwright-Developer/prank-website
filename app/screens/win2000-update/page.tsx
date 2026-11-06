'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function Win2000UpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#3a6ea5] flex flex-col items-center justify-center font-mono">
        <div className="bg-[#ece9d8] border-2 border-white border-r-gray-600 border-b-gray-600 p-8 max-w-lg shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">&#x1F4BB;</div>
            <div className="text-black font-bold text-lg">Windows 2000 Professional</div>
          </div>
          <div className="text-black mb-4">Installing Windows 2000 Service Pack 4...</div>
          <div className="bg-white border border-gray-400 p-1 mb-4">
            <div className="bg-[#316ac5] h-5" style={{width: '45%'}} />
          </div>
          <div className="text-gray-600 text-sm">Estimated time remaining: 47 minutes</div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
