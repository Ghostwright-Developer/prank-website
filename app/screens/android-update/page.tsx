'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'
export default function AndroidUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black flex flex-col items-center justify-center">
        <div className="space-y-6 text-center">
          <div className="text-6xl">📱</div>
          <h1 className="text-2xl font-bold text-white">System Update Available</h1>
          <p className="text-gray-400">Android 13.1.2 Security Patch</p>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-green-500 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500">Downloaded: 234 MB / 342 MB</p>
        </div>
      </div>
    </FullscreenPrank>
  )
}
