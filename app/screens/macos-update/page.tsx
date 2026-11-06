'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'
export default function MacOSUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center font-sans">
        <div className="space-y-8">
          <div className="text-center">
            <div className="text-8xl mb-4">🍎</div>
            <h1 className="text-2xl font-bold">Software Update</h1>
            <p className="text-gray-600">macOS Big Sur 11.7.3</p>
          </div>
          <div className="w-96 space-y-3">
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-center text-sm text-gray-600">Installing... (about 5 minutes remaining)</p>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
