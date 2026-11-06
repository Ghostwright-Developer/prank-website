'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function IOSUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black flex flex-col items-center justify-center">
        <div className="text-white text-6xl mb-8">&#63743;</div>
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-white rounded-full animate-pulse" style={{width: '78%'}} />
        </div>
        <div className="text-gray-400 text-sm">iOS 17.3 Installing...</div>
        <div className="text-gray-600 text-xs mt-2">About 45 minutes remaining</div>
      </div>
    </FullscreenPrank>
  )
}
