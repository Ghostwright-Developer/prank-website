'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function Win95UpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#008080] p-4 font-[MS Sans Serif] flex flex-col">
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d7] text-white px-2 py-1 font-bold text-sm flex items-center gap-2">
          <div className="w-5 h-5 bg-white opacity-20"></div>
          Windows Update
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-96">
            <p className="text-black text-sm mb-6">Searching for Windows 95 Update...</p>
            
            <div className="border-2 border-[#c0c0c0] bg-[#dfdfdf] p-3 mb-4">
              <div className="text-xs text-black mb-2">Progress:</div>
              <div className="w-full h-6 bg-[#c0c0c0] border border-[#808080] border-r-white border-b-white">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#0a246a] to-[#1084d7] relative">
                  <div className="absolute top-1 left-1 right-1 h-1 bg-white opacity-30"></div>
                </div>
              </div>
            </div>

            <button onClick={() => alert('Just a prank! Windows 95 is perfectly fine!')} className="w-full py-2 px-4 bg-[#dfdfdf] border-2 border-[#dfdfdf] border-r-[#808080] border-b-[#808080] text-black cursor-pointer hover:bg-[#c0c0c0] text-sm font-bold">
              OK
            </button>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
