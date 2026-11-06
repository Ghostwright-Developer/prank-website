'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function FakeFlashUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md border border-gray-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center text-white font-bold text-2xl">f</div>
            <div>
              <div className="font-bold text-xl text-gray-800">Adobe Flash Player</div>
              <div className="text-sm text-gray-500">Update Required</div>
            </div>
          </div>
          <div className="text-gray-700 mb-6">
            Your Flash Player is out of date. Update now to continue viewing content.
          </div>
          <div className="bg-yellow-100 border border-yellow-400 p-3 mb-6 text-sm text-yellow-800">
            Warning: Outdated plugins can expose your computer to security risks!
          </div>
          <button 
            onClick={() => alert('Flash Player was discontinued in 2020! This is a classic phishing trick. Never download "updates" from popups!')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold cursor-pointer"
          >
            Download Update
          </button>
          <div className="mt-4 text-center text-xs text-gray-400">
            (This is a prank! Flash was discontinued in 2020)
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
