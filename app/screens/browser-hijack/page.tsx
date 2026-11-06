'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'
export default function BrowserHijackScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-white flex flex-col">
        <div className="bg-blue-600 text-white p-2 text-sm font-bold flex items-center gap-2">
          <span>🔒</span> search-redirect.biz
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-start p-8 space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-blue-600">Welcome!</h1>
            <p className="text-gray-600">Your browser has been optimized for better search experience</p>
          </div>

          <div className="space-y-3 w-full max-w-2xl">
            {[...Array(6)].map((_, i) => (
              <a key={i} href="#" className="block p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                <p className="text-blue-600 font-semibold">Exciting Offer #{i+1}</p>
                <p className="text-sm text-gray-600">Click here for amazing deals and prizes!</p>
              </a>
            ))}
          </div>

          <button onClick={() => alert('Your browser is fine! Just a prank!')} className="mt-8 px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </FullscreenPrank>
  )
}
