"use client"

import { Win10Taskbar, Win10Wallpaper } from "@/components/windows-ui"

/** Small deterministic random generator so effects are repeatable. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A believable, ordinary Windows 10 desktop with a browser window open on a
 * white page. The screen-damage pranks draw their damage on top of this, so it
 * reads as a real display showing a real desktop (and white areas make stuck
 * pixels easy to spot).
 */
export function DesktopBase() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black font-segoe">
      <Win10Wallpaper />
      <div className="absolute inset-x-[6%] bottom-[56px] top-[6%] overflow-hidden rounded-[2px] border border-[#1883d7] bg-white shadow-[0_10px_40px_rgba(0,0,0,.5)]">
        <div className="flex h-[34px] items-end gap-1 bg-[#dee1e6] pl-2 pt-1.5">
          <div className="flex h-[28px] w-[200px] items-center gap-2 rounded-t-lg bg-white px-3 text-[12px] text-[#202124]"><span className="h-3 w-3 rounded-full bg-[#4285f4]" />Google</div>
          <div className="mb-1 text-[16px] text-[#5f6368]">+</div>
          <div className="ml-auto flex h-full items-start text-[#202124]"><span className="grid h-[28px] w-[46px] place-items-center text-[13px]">—</span><span className="grid h-[28px] w-[46px] place-items-center text-[13px]">▢</span><span className="grid h-[28px] w-[46px] place-items-center text-[14px]">✕</span></div>
        </div>
        <div className="flex h-[38px] items-center gap-3 border-b border-[#dadce0] bg-white px-3 text-[#5f6368]">
          <span>←&nbsp; →&nbsp; ⟳</span>
          <div className="flex-1 rounded-full bg-[#f1f3f4] px-4 py-1.5 text-[13px] text-[#202124]">www.google.com</div>
        </div>
        <div className="flex h-[calc(100%-72px)] flex-col items-center justify-center bg-white px-6 text-center">
          <div className="text-[clamp(44px,8vw,84px)] font-medium leading-none tracking-tight">
            <span className="text-[#4285f4]">G</span><span className="text-[#ea4335]">o</span><span className="text-[#fbbc05]">o</span><span className="text-[#4285f4]">g</span><span className="text-[#34a853]">l</span><span className="text-[#ea4335]">e</span>
          </div>
          <div className="mt-7 flex h-[46px] w-[min(560px,86%)] items-center rounded-full border border-[#dfe1e5] px-5 text-left text-[15px] text-[#9aa0a6] shadow-sm">Search Google or type a URL</div>
          <div className="mt-6 flex gap-3 text-[13px]"><span className="rounded bg-[#f8f9fa] px-4 py-2 text-[#3c4043]">Google Search</span><span className="rounded bg-[#f8f9fa] px-4 py-2 text-[#3c4043]">I&apos;m Feeling Lucky</span></div>
        </div>
      </div>
      <Win10Taskbar tasks={["Google - Microsoft Edge"]} />
    </div>
  )
}
