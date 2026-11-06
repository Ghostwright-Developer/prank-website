import Link from "next/link"
import { Monitor, Skull, Terminal, Zap, AlertTriangle, Laptop, Laugh, MonitorOff } from "lucide-react"

const categories = [
  {
    name: "Windows Updates",
    href: "/category/windows",
    description: "13 screens - From Windows 3.1 to Windows 11, plus ultra-realistic update stuck at 92%",
    icon: Monitor,
    color: "from-cyan-500 to-blue-600",
    gridColor: "rgba(0,255,255,0.05)",
  },
  {
    name: "Other OS Updates",
    href: "/category/other-os",
    description: "6 screens - macOS, iOS, Android, Ubuntu, ChromeOS and Kernel Panics",
    icon: Laptop,
    color: "from-purple-500 to-pink-600",
    gridColor: "rgba(168,85,247,0.05)",
  },
  {
    name: "Fake Ransomware",
    href: "/category/ransomware",
    description: "6 screens - CryptoLocker, WannaCry, Petya, Locky, BadRabbit & FBI Warning",
    icon: Skull,
    color: "from-red-500 to-pink-600",
    gridColor: "rgba(239,68,68,0.05)",
  },
  {
    name: "Hacker Attacks",
    href: "/category/hacker",
    description: "8 screens - Matrix, keyloggers, remote access, data theft & more",
    icon: Terminal,
    color: "from-green-500 to-emerald-600",
    gridColor: "rgba(34,197,94,0.05)",
  },
  {
    name: "Phishing & Scams",
    href: "/category/phishing",
    description: "4 screens - Tech support scams, fake antivirus, browser hijacks",
    icon: AlertTriangle,
    color: "from-orange-500 to-red-600",
    gridColor: "rgba(249,115,22,0.05)",
  },
  {
    name: "System Chaos",
    href: "/category/chaos",
    description: "2 screens - Hard drive formatting, BIOS corruption",
    icon: Zap,
    color: "from-yellow-500 to-orange-600",
    gridColor: "rgba(234,179,8,0.05)",
  },
  {
    name: "Screen Damage",
    href: "/category/screen-damage",
    description: "3 screens - Cracked glass, broken LCD vertical stripes, dead pixels",
    icon: MonitorOff,
    color: "from-indigo-500 to-violet-600",
    gridColor: "rgba(99,102,241,0.05)",
  },
  {
    name: "Absurd & Comedy",
    href: "/category/comedy",
    description: "4 screens - Cats taking over, Clippy's revenge, Minecraft gone wrong, printer rage",
    icon: Laugh,
    color: "from-yellow-400 to-pink-500",
    gridColor: "rgba(250,204,21,0.05)",
  },
]

const totalScreens = 47

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-zinc-100 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400 mb-6">
            <Zap className="h-4 w-4" />
            <span>{totalScreens}+ Free Prank Screens</span>
          </div>
          
          <h1 className="mb-6 text-6xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-orbitron)]">
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
              PRANK
            </span>
            <span className="text-white">SIMS</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-zinc-400 leading-relaxed">
            The ultimate collection of fake update screens, blue screens of death, 
            ransomware jokes, and hacker terminals. Send a link and watch the chaos unfold.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Instant fullscreen
            </span>
            <span className="text-zinc-700">|</span>
            <span>No downloads</span>
            <span className="text-zinc-700">|</span>
            <span>Works on all devices</span>
          </div>
        </header>

        {/* Category Cards */}
        <section className="mb-20">
          <h2 className="text-center text-2xl font-semibold mb-10 font-[family-name:var(--font-orbitron)]">
            Choose a <span className="text-cyan-400">Category</span>
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-8 transition-all duration-500 hover:border-zinc-700 hover:scale-[1.02] hover:shadow-2xl"
                >
                  {/* Animated grid on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(${category.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${category.gridColor} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  
                  {/* Gradient glow on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                  
                  <div className="relative">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white mb-2 font-[family-name:var(--font-orbitron)]">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="mt-5 flex items-center gap-2 text-sm text-zinc-600 group-hover:text-cyan-400 transition-colors">
                      <span>Browse screens</span>
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* How it works section */}
        <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-8 md:p-12 mb-20">
          <h2 className="text-2xl font-semibold text-center mb-10 font-[family-name:var(--font-orbitron)]">
            How It <span className="text-cyan-400">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose a Prank</h3>
              <p className="text-sm text-zinc-500">Pick from {totalScreens}+ authentic-looking fake screens</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-600 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Share the Link</h3>
              <p className="text-sm text-zinc-500">Send the URL to your unsuspecting victim</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Watch the Panic</h3>
              <p className="text-sm text-zinc-500">Enjoy as they frantically try to fix their computer</p>
            </div>
          </div>
        </section>

        {/* Info sections */}
        <section className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Disclaimer */}
            <div className="rounded-xl border border-red-900/30 bg-red-950/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">
                Important Disclaimer
              </h3>
              <p className="text-sm text-zinc-400">
                We are not responsible for revenge actions. Keep pranks brief and harmless. Prank at your own risk!
              </p>
            </div>

            {/* Safety */}
            <div className="rounded-xl border border-green-900/30 bg-green-950/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">
                100% Safe & Harmless
              </h3>
              <p className="text-sm text-zinc-400">
                No downloads, no malware, no system damage. It's purely visual trickery in your browser.
              </p>
            </div>
          </div>

          {/* Have an idea */}
          <div className="rounded-xl border border-yellow-900/30 bg-yellow-950/20 backdrop-blur-sm p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">
              Got Ideas for New Pranks?
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              We love hearing new ideas! Share your prank concepts with us.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 px-5 py-2.5 font-semibold text-white transition-all hover:from-yellow-400 hover:to-orange-500"
            >
              Share Your Ideas
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        <footer className="mt-16 border-t border-zinc-800/50 pt-8 text-center text-sm text-zinc-600">
          <p className="mb-2">All screens are harmless pranks. No actual system damage occurs.</p>
          <p className="text-zinc-700">
            Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">ESC</kbd> to exit any prank.
          </p>
        </footer>
      </div>
    </main>
  )
}
