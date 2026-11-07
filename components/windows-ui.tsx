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

/** Windows 11 "Bloom". */
export function Win11Wallpaper({ dark = false }: { dark?: boolean }) {
  const bg = dark ? ["#0a1530", "#050a1c"] : ["#d6e6f7", "#b9d3f0"]
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="w11-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg[0]} />
          <stop offset="1" stopColor={bg[1]} />
        </linearGradient>
        <filter id="w11-blur"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="w11-blur2"><feGaussianBlur stdDeviation="5" /></filter>
        <linearGradient id="w11-p1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7fb7ff" /><stop offset="1" stopColor="#1b55d6" /></linearGradient>
        <linearGradient id="w11-p2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#1a3fb5" /><stop offset="1" stopColor="#8fc4ff" /></linearGradient>
        <linearGradient id="w11-p3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9ecff" /><stop offset="1" stopColor="#3c8cf0" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#w11-bg)" />
      <g transform="translate(800 450)">
        <g filter="url(#w11-blur)" opacity="0.95">
          <ellipse rx="150" ry="440" transform="rotate(35)" fill="url(#w11-p2)" />
          <ellipse rx="150" ry="440" transform="rotate(-35)" fill="url(#w11-p1)" />
        </g>
        <g filter="url(#w11-blur2)">
          <ellipse rx="130" ry="400" transform="rotate(90) translate(0 -30)" fill="url(#w11-p3)" opacity="0.92" />
          <ellipse rx="115" ry="330" transform="rotate(-70)" fill="url(#w11-p1)" opacity="0.85" />
          <ellipse rx="115" ry="330" transform="rotate(70)" fill="url(#w11-p2)" opacity="0.85" />
          <ellipse rx="90" ry="230" transform="rotate(0)" fill="url(#w11-p3)" opacity="0.9" />
        </g>
      </g>
    </svg>
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
        {["#0078d7", "#f2c94c", "#e04a3a", "#3aa856"].map((c, i) => (
          <span key={i} className="grid h-full w-[46px] place-items-center"><span className="h-5 w-5 rounded-sm" style={{ background: c }} /></span>
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

/** Windows 11 taskbar (centered). */
export function Win11Taskbar({ tasks = [] as string[], dark = true }: { tasks?: string[]; dark?: boolean }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 flex h-[48px] items-center justify-center font-segoe backdrop-blur-xl ${dark ? "bg-[#1c1c1c]/85 text-white" : "bg-[#f3f3f3]/85 text-black"} border-t ${dark ? "border-white/10" : "border-black/10"}`}>
      <div className="flex items-center gap-1">
        <span className="grid h-9 w-9 place-items-center rounded hover:bg-white/10"><Win10Logo size={18} color="#4cc2ff" gap={2} /></span>
        {["#9aa0a6", "#0078d4", "#f2c94c", "#3aa856", "#e04a3a"].map((c, i) => (
          <span key={i} className="grid h-9 w-9 place-items-center rounded hover:bg-white/10"><span className="h-5 w-5 rounded-[5px]" style={{ background: c }} /></span>
        ))}
        {tasks.map((t) => (
          <span key={t} className="grid h-9 place-items-center rounded bg-white/10 px-3 text-[12px]">{t}</span>
        ))}
      </div>
      <div className="absolute right-3 flex items-center gap-3 text-[12px] leading-tight">
        <span>ENG<br />US</span>
        <span className="text-right"><Clock className="block" options={{ hour: "numeric", minute: "2-digit" }} /><Clock kind="date" options={{ year: "numeric", month: "numeric", day: "numeric" }} className="block" /></span>
      </div>
    </div>
  )
}

/* ──────────────── Desktop icons ──────────────── */

type IconKind = "recycle" | "computer" | "folder" | "browser" | "doc" | "network"
const ICON_COLORS: Record<IconKind, [string, string]> = {
  recycle: ["#cfe8ff", "#6fa8dc"], computer: ["#dfe8f2", "#7a93b3"], folder: ["#ffe08a", "#e0a82a"], browser: ["#4aa8ff", "#1d5fd0"], doc: ["#ffffff", "#bcc6d4"], network: ["#d6e6f7", "#5a86c0"],
}
export function DesktopIcon({ kind, label, shadow = true, className = "" }: { kind: IconKind; label: string; shadow?: boolean; className?: string }) {
  const [a, b] = ICON_COLORS[kind]
  return (
    <div className={`flex w-[76px] cursor-default flex-col items-center gap-1 p-1 text-center hover:bg-white/15 ${className}`}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,.45))" }}>
        <defs><linearGradient id={`ic-${kind}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
        {kind === "recycle" && (<><path d="M9 11h22l-2 24H11z" fill={`url(#ic-${kind})`} stroke="#4a6f9c" /><path d="M7 8h26v3H7z" fill="#e8f2ff" stroke="#4a6f9c" /><path d="M16 8V5h8v3" fill="none" stroke="#4a6f9c" /><path d="M15 16v14M20 16v14M25 16v14" stroke="#4a6f9c" /></>)}
        {kind === "computer" && (<><rect x="5" y="6" width="30" height="21" rx="2" fill={`url(#ic-${kind})`} stroke="#42587a" /><rect x="8" y="9" width="24" height="15" fill="#2a78d8" /><rect x="14" y="29" width="12" height="3" fill="#9aa8bd" /><rect x="9" y="32" width="22" height="3" rx="1" fill="#b8c2d2" stroke="#42587a" /></>)}
        {kind === "folder" && (<><path d="M3 10h13l3 4h18v20H3z" fill={`url(#ic-${kind})`} stroke="#a07418" /><path d="M3 16h34v18H3z" fill="#ffd45e" stroke="#a07418" /></>)}
        {kind === "browser" && (<><circle cx="20" cy="20" r="15" fill={`url(#ic-${kind})`} stroke="#1a4aa8" /><path d="M10 22a10 10 0 0120 0" fill="none" stroke="#fff" strokeWidth="3" /><text x="20" y="27" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="Georgia,serif">e</text></>)}
        {kind === "doc" && (<><path d="M9 4h16l7 7v25H9z" fill={`url(#ic-${kind})`} stroke="#7b88a0" /><path d="M25 4v7h7" fill="#e0e6f0" stroke="#7b88a0" /><path d="M13 18h14M13 23h14M13 28h10" stroke="#9aa8c0" /></>)}
        {kind === "network" && (<><rect x="6" y="8" width="18" height="13" rx="1.5" fill={`url(#ic-${kind})`} stroke="#3c5a8a" /><rect x="18" y="19" width="16" height="12" rx="1.5" fill="#bcd4f0" stroke="#3c5a8a" /><path d="M14 22v5h6" stroke="#3c5a8a" fill="none" /></>)}
      </svg>
      <span className={`w-full break-words text-[12px] leading-tight text-white ${shadow ? "[text-shadow:1px_1px_2px_rgba(0,0,0,.9)]" : ""}`}>{label}</span>
    </div>
  )
}
