"use client"

/** Shared visuals for the (imaginary) Windows 12 screens. Original artwork, no Microsoft assets. */

export const GLASS = "border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,.45)]"

export function Win12Style() {
  return (
    <style>{`
      @keyframes pk12-drift { 0%{transform:translate3d(-4%,-3%,0) scale(1)} 50%{transform:translate3d(5%,4%,0) scale(1.12)} 100%{transform:translate3d(-4%,-3%,0) scale(1)} }
      @keyframes pk12-drift2 { 0%{transform:translate3d(4%,3%,0) scale(1.1)} 50%{transform:translate3d(-5%,-2%,0) scale(1)} 100%{transform:translate3d(4%,3%,0) scale(1.1)} }
      @keyframes pk12-pulse { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.08);opacity:1} }
      @keyframes pk12-spin { to{transform:rotate(360deg)} }
      @keyframes pk12-scan { 0%{stroke-dashoffset:300} 100%{stroke-dashoffset:0} }
      @keyframes pk12-rise { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
      @keyframes pk12-sweep { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
    `}</style>
  )
}

export function Win12Wallpaper({ hue = 0 }: { hue?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#04050d]" style={{ filter: hue ? `hue-rotate(${hue}deg)` : undefined }}>
      <Win12Style />
      <div className="absolute -inset-[20%]" style={{ background: "radial-gradient(38% 34% at 22% 30%, rgba(34,211,238,.85), transparent 70%), radial-gradient(34% 40% at 78% 24%, rgba(139,92,246,.95), transparent 70%)", animation: "pk12-drift 22s ease-in-out infinite" }} />
      <div className="absolute -inset-[20%]" style={{ background: "radial-gradient(40% 32% at 62% 86%, rgba(236,72,153,.7), transparent 70%), radial-gradient(30% 30% at 12% 82%, rgba(59,130,246,.75), transparent 70%)", animation: "pk12-drift2 28s ease-in-out infinite" }} />
      <svg className="absolute inset-0 h-full w-full opacity-[.8]" preserveAspectRatio="none" viewBox="0 0 1600 900" aria-hidden="true">
        <defs>
          <linearGradient id="r1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#67e8f9" stopOpacity="0" /><stop offset=".5" stopColor="#a5b4fc" stopOpacity=".9" /><stop offset="1" stopColor="#f0abfc" stopOpacity="0" /></linearGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M-100 ${620 - i * 22} C 300 ${380 + i * 18}, 760 ${760 - i * 30}, 1200 ${430 + i * 14} S 1500 ${360 - i * 10}, 1700 ${300 + i * 20}`} fill="none" stroke="url(#r1)" strokeWidth={1.4 - i * 0.12} />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.4)_100%)]" />
    </div>
  )
}

/** Four floating panes with a soft glow: the made-up Windows 12 mark. */
export function Win12Logo({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 0 14px rgba(125,211,252,.65))" }}>
      <defs>
        <linearGradient id="w12a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#67e8f9" /><stop offset="1" stopColor="#818cf8" /></linearGradient>
        <linearGradient id="w12b" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#f0abfc" /></linearGradient>
      </defs>
      <rect x="10" y="12" width="37" height="34" rx="9" fill="url(#w12a)" />
      <rect x="53" y="8" width="37" height="38" rx="9" fill="url(#w12b)" opacity=".95" />
      <rect x="10" y="54" width="37" height="38" rx="9" fill="url(#w12b)" opacity=".85" />
      <rect x="53" y="54" width="37" height="34" rx="9" fill="url(#w12a)" opacity=".95" />
    </svg>
  )
}

/** The imaginary AI companion: a breathing glass orb. */
export function Orb({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: "radial-gradient(circle at 32% 28%, #fff 0, #a5f3fc 14%, #818cf8 46%, #6d28d9 72%, #1e1b4b 100%)", boxShadow: "0 0 24px rgba(129,140,248,.8), inset 0 0 12px rgba(255,255,255,.35)", animation: "pk12-pulse 3.2s ease-in-out infinite" }}
      aria-hidden="true"
    />
  )
}

const DOCK = ["#38bdf8", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#fb7185"]

/** Floating glass dock with a centered Start mark, an AI search pill and app tiles. */
export function Win12Dock({ prompt = "Ask Copilot anything", tasks = 3 }: { prompt?: string; tasks?: number }) {
  return (
    <div className="absolute inset-x-0 bottom-4 flex justify-center">
      <div className={`flex items-center gap-3 rounded-[22px] px-3 py-2 ${GLASS}`}>
        <Win12Logo size={30} />
        <div className="flex h-9 w-[min(280px,30vw)] items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 text-[13px] text-white/75"><Orb size={16} />{prompt}</div>
        {DOCK.map((c, i) => (
          <span key={c} className="relative grid h-9 w-9 place-items-center rounded-[11px]" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }}>
            <span className="h-3.5 w-3.5 rounded-[4px] bg-white/80" />
            {i < tasks && <span className="absolute -bottom-1 h-[3px] w-3 rounded-full bg-cyan-300" />}
          </span>
        ))}
      </div>
    </div>
  )
}
