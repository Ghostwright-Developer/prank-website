'use client'

import { useEffect, useState } from 'react'
import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useRouter } from 'next/navigation'

const errorPopups = [
  { title: "Printer Error 0x00000001", body: "The printer has decided it does not feel like printing today.", btn: "Okay Fine" },
  { title: "Paper Jam (No There Isn't)", body: "The printer claims there is a paper jam. There is no paper jam. The printer is lying.", btn: "I Know" },
  { title: "Ink Level: EMOTIONAL", body: "Cyan: Empty. Magenta: Sad. Yellow: Hopeless. Black: This is fine.", btn: "Relatable" },
  { title: "Driver Error 404", body: "The printer driver has gone on a spiritual journey and cannot be reached.", btn: "Godspeed" },
  { title: "Connection Lost", body: "The printer was connected 30 seconds ago. It is now in witness protection.", btn: "Of Course" },
  { title: "CRITICAL: Wrong Paper Size", body: "You loaded A4 paper. The printer wanted A4 paper. It rejected it anyway.", btn: "WHY" },
  { title: "Queue Error", body: "Your print job is #1 in the queue. The queue has ceased to exist.", btn: "Makes Sense" },
  { title: "Warming Up (Forever)", body: "The printer has been 'warming up' since 2019. Experts say it may finish by 2031.", btn: "I'll Wait" },
  { title: "Toner Low", body: "Toner is at 0.3%. The printer refuses to print the next 847 pages until you replace it.", btn: "Hostage!" },
  { title: "PRINTER ON FIRE", body: "Error code: ¯\\_(ツ)_/¯ Please consult the 847-page manual, page 612.", btn: "Haha What" },
]

export default function PrinterError() {
  const router = useRouter()
  const [popupStack, setPopupStack] = useState<typeof errorPopups>([errorPopups[0]])
  const [dismissed, setDismissed] = useState(0)
  const [shake, setShake] = useState(false)
  const [rage, setRage] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPopupStack(prev => {
        const next = errorPopups[(prev.length) % errorPopups.length]
        return [...prev.slice(-4), next]
      })
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (dismissed >= 5) setRage(true)
  }, [dismissed])

  const dismissTop = () => {
    setPopupStack(prev => prev.slice(0, -1).concat(errorPopups[(prev.length) % errorPopups.length]))
    setDismissed(d => d + 1)
  }

  if (rage) {
    return (
      <FullscreenPrank>
        <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-center p-8">
          <div className="text-8xl mb-6">🖨️</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">The printer wins. It always wins.</h1>
          <p className="text-xl text-gray-600 mb-2">You clicked dismiss {dismissed} times.</p>
          <p className="text-gray-500 mb-2">The printer has noted your frustration and does not care.</p>
          <p className="text-yellow-600 font-semibold mt-4 mb-8">Just kidding! This was a prank. Unlike real printers, this one can't hurt you.</p>
          <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-8 py-3 rounded text-lg hover:bg-blue-700 cursor-pointer">
            Never buy a printer
          </button>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank>
      {/* Fake Windows desktop */}
      <div className="w-full h-full bg-[#008080] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 40%, #007070 0%, #008080 60%)' }} />

        {/* Fake taskbar */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 gap-2 z-20">
          <div className="bg-[#008000] text-white text-xs font-bold px-3 py-1 rounded-sm border border-white border-r-gray-500 border-b-gray-500">Start</div>
          <div className="flex-1" />
          <div className="text-xs text-black border border-gray-500 px-2 py-0.5 bg-[#c0c0c0]">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Popups - stacked with slight offset */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {popupStack.slice(-3).map((popup, i, arr) => {
            const isTop = i === arr.length - 1
            const offset = (arr.length - 1 - i) * 20
            return (
              <div
                key={`${popup.title}-${i}`}
                className={`absolute bg-[#c0c0c0] border-2 border-white shadow-xl w-96 ${shake && isTop ? 'animate-bounce' : ''}`}
                style={{
                  top: `calc(50% - 80px + ${offset}px)`,
                  left: `calc(50% - 192px + ${offset}px)`,
                  zIndex: i + 1,
                }}
              >
                {/* Title bar */}
                <div className="bg-[#000080] text-white text-xs font-bold px-2 py-1 flex items-center justify-between">
                  <span>Printer Spooler Service</span>
                  <button
                    onClick={isTop ? dismissTop : undefined}
                    className="bg-[#c0c0c0] text-black text-xs font-bold w-4 h-4 flex items-center justify-center border border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-300 cursor-pointer"
                  >
                    X
                  </button>
                </div>
                {/* Body */}
                <div className="p-5">
                  <div className="flex gap-3 mb-4">
                    <div className="text-red-600 text-3xl shrink-0">!</div>
                    <div>
                      <div className="font-bold text-sm text-black mb-1">{popup.title}</div>
                      <div className="text-xs text-black">{popup.body}</div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={isTop ? dismissTop : undefined}
                      className="bg-[#c0c0c0] text-black text-xs px-6 py-1 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-300 cursor-pointer"
                    >
                      {popup.btn}
                    </button>
                    <button
                      onClick={isTop ? dismissTop : undefined}
                      className="bg-[#c0c0c0] text-black text-xs px-4 py-1 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dismiss counter */}
        <div className="absolute top-4 right-4 z-30 text-white text-xs opacity-60">
          Dismissed {dismissed} times • {Math.max(0, 5 - dismissed)} more until rage
        </div>
      </div>
    </FullscreenPrank>
  )
}
