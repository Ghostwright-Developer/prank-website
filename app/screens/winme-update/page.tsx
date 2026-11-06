'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function WinMEUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#008080] flex flex-col items-center justify-center font-mono">
        <div className="bg-[#000080] text-white p-1 px-4 mb-4 text-lg font-bold">Windows Millennium Edition Setup</div>
        <div className="bg-[#c0c0c0] border-2 border-white border-r-gray-800 border-b-gray-800 p-8 max-w-md">
          <div className="text-black text-center mb-6">Windows ME is updating your system files...</div>
          <div className="bg-white border border-gray-600 p-1 mb-4">
            <div className="bg-[#000080] h-4 animate-pulse" style={{width: '67%'}} />
          </div>
          <div className="text-black text-sm text-center">This may take several minutes.<br/>Do not turn off your computer.</div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
