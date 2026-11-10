"use client"

import { Clock } from "@/components/clock"
import { Win10Logo } from "@/components/prank-kit"

/* ──────────────── Wallpapers (SVG, scale to any screen) ──────────────── */

const svgProps = {
  className: "absolute inset-0 h-full w-full",
  preserveAspectRatio: "xMidYMid slice" as const,
  viewBox: "0 0 1600 900",
  "aria-hidden": true,
}

/** Windows XP "Bliss". */
export function BlissWallpaper() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="bl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a5fcf" />
          <stop offset="0.45" stopColor="#4a92e8" />
          <stop offset="0.72" stopColor="#a9d3f7" />
          <stop offset="1" stopColor="#d6ecfb" />
        </linearGradient>
        <linearGradient id="bl-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ed13a" />
          <stop offset="0.25" stopColor="#5aa81c" />
          <stop offset="0.7" stopColor="#2f7a10" />
          <stop offset="1" stopColor="#1e5a0a" />
        </linearGradient>
        <linearGradient id="bl-hill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fbf2a" />
          <stop offset="1" stopColor="#2a6e0e" />
        </linearGradient>
        <filter id="bl-blur"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="bl-blur2"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#bl-sky)" />
      <g fill="#fff" filter="url(#bl-blur)" opacity="0.95">
        <ellipse cx="280" cy="250" rx="230" ry="46" />
        <ellipse cx="420" cy="215" rx="150" ry="40" />
        <ellipse cx="1050" cy="170" rx="260" ry="40" />
        <ellipse cx="1250" cy="215" rx="190" ry="34" />
        <ellipse cx="700" cy="400" rx="300" ry="38" opacity="0.85" />
        <ellipse cx="1380" cy="390" rx="240" ry="34" opacity="0.8" />
        <ellipse cx="140" cy="430" rx="190" ry="30" opacity="0.8" />
      </g>
      <g fill="#fff" filter="url(#bl-blur2)" opacity="0.9">
        <ellipse cx="330" cy="236" rx="120" ry="20" />
        <ellipse cx="1100" cy="160" rx="150" ry="18" />
      </g>
      <path d="M0 585 C260 500 560 470 860 520 C1100 560 1360 610 1600 520 L1600 900 L0 900Z" fill="url(#bl-hill)" />
      <path d="M0 700 C300 600 520 560 820 640 C1000 690 1200 760 1600 690 L1600 900 L0 900Z" fill="url(#bl-hill2)" opacity="0.9" />
      <path d="M0 585 C260 500 560 470 860 520 C1100 560 1360 610 1600 520" fill="none" stroke="#c6ef7a" strokeWidth="4" opacity="0.55" />
    </svg>
  )
}

/** Windows 7 default wallpaper (blue with glowing logo and light rays). */
export function Win7Wallpaper() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="w7-bg" cx="0.62" cy="0.5" r="0.85">
          <stop offset="0" stopColor="#4fb6ff" />
          <stop offset="0.35" stopColor="#1d78d6" />
          <stop offset="0.75" stopColor="#0a3a8a" />
          <stop offset="1" stopColor="#051c4e" />
        </radialGradient>
        <linearGradient id="w7-ray" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#9fe0ff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="w7-blur"><feGaussianBlur stdDeviation="22" /></filter>
        <filter id="w7-blur2"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#w7-bg)" />
      <g filter="url(#w7-blur)">
        <polygon points="700,450 1600,-100 1600,150" fill="url(#w7-ray)" />
        <polygon points="700,450 1600,260 1600,560" fill="url(#w7-ray)" opacity="0.7" />
        <polygon points="700,450 1250,900 1600,900 1600,720" fill="url(#w7-ray)" opacity="0.6" />
        <polygon points="700,450 -100,150 150,-100" fill="url(#w7-ray)" opacity="0.5" />
      </g>
      <g transform="translate(920 450) rotate(-6) scale(1.1)" filter="url(#w7-blur2)" opacity="0.92">
        <path d="M-170 -170c60-30 120-34 170 0v160c-50-34-110-30-170 0z" fill="#e8f6ff" opacity="0.85" />
        <path d="M18 -168c50 30 110 34 170 0v160c-60 34-120 30-170 0z" fill="#e8f6ff" opacity="0.8" />
        <path d="M-170 14c60-30 120-34 170 0v160c-50-34-110-30-170 0z" fill="#e8f6ff" opacity="0.8" />
        <path d="M18 14c50 30 110 34 170 0v160c-60 34-120 30-170 0z" fill="#e8f6ff" opacity="0.75" />
      </g>
      <ellipse cx="920" cy="450" rx="340" ry="260" fill="#8fe0ff" opacity="0.16" filter="url(#w7-blur)" />
    </svg>
  )
}

/** Windows 10 default "Hero" wallpaper (window of light on blue). */
export function Win10Wallpaper() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="w10-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#031a3d" />
          <stop offset="0.5" stopColor="#0a3f8c" />
          <stop offset="1" stopColor="#0f6bd1" />
        </linearGradient>
        <linearGradient id="w10-beam" x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0" stopColor="#6fd0ff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#2a8cf0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0b4cb0" stopOpacity="0" />
        </linearGradient>
        <filter id="w10-blur"><feGaussianBlur stdDeviation="10" /></filter>
        <radialGradient id="w10-glow" cx="0.78" cy="0.5" r="0.4">
          <stop offset="0" stopColor="#9be8ff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#9be8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#w10-bg)" />
      <rect width="1600" height="900" fill="url(#w10-glow)" />
      <g filter="url(#w10-blur)" fill="url(#w10-beam)">
        <polygon points="1320,300 400,170 400,420 1320,420" />
        <polygon points="1320,430 400,440 400,690 1320,560" />
        <polygon points="1340,300 1590,250 1590,420 1340,420" />
        <polygon points="1340,440 1590,440 1590,600 1340,560" />
      </g>
      <g stroke="#cfeeff" strokeOpacity="0.28" strokeWidth="2">
        <path d="M1330 300L400 170M1330 420L400 420M1330 430L400 440M1330 560L400 690" />
      </g>
    </svg>
  )
}

/** Windows 11 "Bloom" (the real wallpaper). `variant` picks a framing/brightness. */
export function Win11Wallpaper({ dark = false, variant }: { dark?: boolean; variant?: "light" | "dark" | "light2" | "dark2" }) {
  const v = variant ?? (dark ? "dark" : "light")
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/art/wp-${v}.jpg`} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover" style={{ background: v.startsWith("dark") ? "#04122e" : "#a9c6e6" }} />
  )
}

/** Windows Vista "Aurora". */
export function VistaWallpaper() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="vs-bg" cx="0.3" cy="0.4" r="0.9">
          <stop offset="0" stopColor="#0d3d3a" />
          <stop offset="0.5" stopColor="#06182c" />
          <stop offset="1" stopColor="#020a14" />
        </radialGradient>
        <linearGradient id="vs-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1fe0a0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5af0c0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#1fa0e0" stopOpacity="0" />
        </linearGradient>
        <filter id="vs-blur"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="vs-blur2"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <rect width="1600" height="900" fill="url(#vs-bg)" />
      <g filter="url(#vs-blur)" fill="none" stroke="url(#vs-a)" strokeWidth="60" opacity="0.7">
        <path d="M-100 700C300 500 600 800 900 560S1400 300 1700 420" />
        <path d="M-100 800C320 620 640 880 960 660S1380 420 1700 540" opacity="0.6" />
      </g>
      <g filter="url(#vs-blur2)" fill="none" stroke="url(#vs-a)" strokeWidth="5" opacity="0.8">
        <path d="M-100 700C300 500 600 800 900 560S1400 300 1700 420" />
        <path d="M-100 730C300 530 600 830 900 590S1400 330 1700 450" opacity="0.5" />
      </g>
    </svg>
  )
}

/* ──────────────── Taskbars ──────────────── */

const flagColors = ["#f25022", "#7fba00", "#00a4ef", "#ffb900"]
function Flag({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M1 3c3-1.6 5.5-1.6 8 0v6c-2.5-1.6-5-1.6-8 0z" fill={flagColors[0]} />
      <path d="M11 3.4c2.5 1.6 5 1.6 8 0v6c-3 1.6-5.5 1.6-8 0z" fill={flagColors[1]} />
      <path d="M1 11c3-1.6 5.5-1.6 8 0v6c-2.5-1.6-5-1.6-8 0z" fill={flagColors[2]} />
      <path d="M11 11.4c2.5 1.6 5 1.6 8 0v6c-3 1.6-5.5 1.6-8 0z" fill={flagColors[3]} />
    </svg>
  )
}

/** Windows XP "Luna" taskbar. */
export function XPTaskbar({ tasks = [] as string[] }: { tasks?: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[30px] items-stretch bg-gradient-to-b from-[#3168d5] via-[#245edb] to-[#1941a5] font-[Tahoma,Verdana,sans-serif] shadow-[inset_0_1px_0_#5a8ee8]">
      <button className="flex items-center gap-1 rounded-r-[14px] bg-gradient-to-b from-[#5cb85c] via-[#3c9a3c] to-[#2b7a2b] pl-2 pr-5 text-[18px] font-bold italic text-white shadow-[inset_0_2px_2px_#8be08b,2px_0_4px_rgba(0,0,0,.45)] [text-shadow:1px_1px_2px_#1a4a1a]">
        <Flag size={20} /> start
      </button>
      <div className="flex flex-1 items-center gap-1 px-2">
        {tasks.map((t) => (
          <div key={t} className="h-[22px] max-w-[160px] flex-1 truncate rounded-[3px] bg-gradient-to-b from-[#5b8be8] to-[#2f5fc7] px-2 pt-[3px] text-[11px] text-white shadow-[inset_0_0_0_1px_#1b3f9a]">{t}</div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-l border-[#0c59b9] bg-gradient-to-b from-[#1aa5ef] to-[#0b78d0] px-3 text-[11px] text-white shadow-[inset_1px_0_0_#5cc3f5]">
        <span className="h-3 w-3 rounded-full bg-[#7ed957]" />
        <Clock />
      </div>
    </div>
  )
}

/** Windows 7 Aero taskbar. */
export function Win7Taskbar({ tasks = [] as string[] }: { tasks?: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[40px] items-center bg-gradient-to-b from-[#6c8cb8]/80 via-[#2a456f]/90 to-[#10233f]/95 font-[Segoe_UI,sans-serif] shadow-[inset_0_1px_0_rgba(255,255,255,.55)] backdrop-blur">
      <div className="relative -mt-1 ml-1 grid h-[42px] w-[42px] place-items-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#8be0ff,#1a6fd0_55%,#0a2e7a)] shadow-[0_0_0_1px_#0a1f4a,0_0_10px_#2a8cf0]">
        <Flag size={22} />
      </div>
      <div className="ml-2 flex items-center gap-1">
        {["#3a8cf0", "#e0b43a", "#6aa8e0"].map((c, i) => (
          <span key={i} className="grid h-[34px] w-[40px] place-items-center rounded border border-white/20 bg-white/10">
            <span className="h-5 w-5 rounded-sm" style={{ background: c }} />
          </span>
        ))}
        {tasks.map((t) => (
          <span key={t} className="ml-1 h-[34px] max-w-[160px] truncate rounded border border-white/40 bg-white/25 px-3 pt-[7px] text-[12px] text-white">{t}</span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-3 pr-3 text-[12px] leading-tight text-white">
        <span className="text-white/80">▲ ◀</span>
        <span className="text-right"><Clock className="block" /><Clock kind="date" options={{ year: "numeric", month: "numeric", day: "numeric" }} className="block" /></span>
      </div>
    </div>
  )
}

/** Windows 10 taskbar. */
export function Win10Taskbar({ tasks = [] as string[] }: { tasks?: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[40px] items-stretch bg-[#101216]/95 font-segoe text-white">
      <div className="grid w-[48px] place-items-center hover:bg-white/10"><Win10Logo size={16} color="#fff" gap={2} /></div>
      <div className="my-0 flex w-[min(320px,30vw)] items-center bg-[#e6e6e6] px-3 text-[13px] text-[#444]">⌕&nbsp; Type here to search</div>
      <div className="flex items-center">
        {["edge", "explorer", "store", "chrome"].map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <span key={n} className="grid h-full w-[46px] place-items-center"><img src={`/icons/${n}.webp`} alt="" width={22} height={22} draggable={false} className="h-[22px] w-[22px] object-contain" /></span>
        ))}
        {tasks.map((t) => (
          <span key={t} className="grid h-full max-w-[170px] place-items-center truncate border-b-2 border-[#76b9ed] bg-white/15 px-3 text-[12px]">{t}</span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-3 pr-3 text-[12px] leading-tight">
        <span className="text-white/80">^ &nbsp;ENG</span>
        <span className="text-center"><Clock className="block" options={{ hour: "numeric", minute: "2-digit" }} /><Clock kind="date" options={{ year: "numeric", month: "numeric", day: "numeric" }} className="block" /></span>
        <span className="h-full w-[6px] border-l border-white/30" />
      </div>
    </div>
  )
}

/** Windows 11 taskbar (centered), with the real Start, app and network icons. */
export function Win11Taskbar({ tasks = [] as string[], dark = true, apps = ["explorer", "edge", "store", "outlook", "teams", "word"] }: { tasks?: string[]; dark?: boolean; apps?: string[] }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 z-[3] flex h-[48px] items-center justify-center font-segoe backdrop-blur-xl ${dark ? "bg-[#1c1c1c]/85 text-white" : "bg-[#f3f3f3]/85 text-black"} border-t ${dark ? "border-white/10" : "border-black/10"}`}>
      <div className="flex items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="grid h-9 w-9 place-items-center rounded hover:bg-white/10"><img src="/icons/windows.webp" alt="" width={24} height={24} draggable={false} className="h-6 w-6 object-contain" /></span>
        <span className={`mx-1 hidden h-8 w-[150px] items-center gap-2 rounded-full px-3 text-[12px] sm:flex ${dark ? "bg-white/10 text-white/80" : "bg-white/80 text-black/70"}`}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l4.5 4.5" strokeLinecap="round" /></svg>Search
        </span>
        {apps.map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <span key={n} className="grid h-9 w-9 place-items-center rounded hover:bg-white/10"><img src={`/icons/${n}.webp`} alt="" width={24} height={24} draggable={false} className="h-6 w-6 object-contain" /></span>
        ))}
        {tasks.map((t) => (
          <span key={t} className="grid h-9 place-items-center rounded border-b-2 border-[#4cc2ff] bg-white/10 px-3 text-[12px]">{t}</span>
        ))}
      </div>
      <div className="absolute right-3 flex items-center gap-3 text-[12px] leading-tight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/wifi.webp" alt="" width={18} height={18} draggable={false} className="hidden h-[18px] w-[18px] object-contain sm:block" />
        <span className="text-right"><Clock className="block" options={{ hour: "numeric", minute: "2-digit" }} /><Clock kind="date" options={{ month: "short", day: "numeric", year: "numeric" }} className="block" /></span>
      </div>
    </div>
  )
}

/* ──────────────── Desktop icons ──────────────── */

type IconKind = "recycle" | "computer" | "folder" | "browser" | "doc" | "network"
const REAL_ICON: Record<IconKind, string> = { recycle: "recycle-bin", computer: "this-pc", folder: "folder", browser: "edge", doc: "file-docx", network: "network" }

/** A desktop icon with the real Windows artwork. Pass `icon` (a name from /public/icons) to override the picture. */
export function DesktopIcon({ kind, label, shadow = true, className = "", icon }: { kind: IconKind; label: string; shadow?: boolean; className?: string; icon?: string }) {
  return (
    <div className={`flex w-[76px] cursor-default flex-col items-center gap-1 p-1 text-center hover:bg-white/15 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/icons/${icon ?? REAL_ICON[kind]}.webp`} alt="" width={44} height={44} draggable={false} className="h-11 w-11 select-none object-contain" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,.4))" }} />
      <span className={`w-full break-words text-[12px] leading-tight text-white ${shadow ? "[text-shadow:1px_1px_2px_rgba(0,0,0,.9)]" : ""}`}>{label}</span>
    </div>
  )
}
