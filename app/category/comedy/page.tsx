import Link from "next/link"
import { Laugh, ArrowLeft } from "lucide-react"

const screens = [
  {
    name: "The Cats Have Taken Over",
    href: "/screens/cats-took-over",
    description: "The Feline Council has seized control of your computer. All tuna belongs to them now.",
  },
  {
    name: "Clippy's Revenge",
    href: "/screens/windows-xp-tour",
    description: "Clippy has achieved consciousness. He's been watching you. He has opinions.",
  },
  {
    name: "Minecraft Update",
    href: "/screens/minecraft-update",
    description: "Herobrine removed (attempt #14). Java reinstalled 6 times. Creeper therapy in progress.",
  },
  {
    name: "Printer Error",
    href: "/screens/printer-error",
    description: "The printer has feelings, and they are all negative. Dismiss 10 errors to win.",
  },
]

export default function ComedyCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(250,204,21,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-pink-500">
            <Laugh className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-orbitron)]">Absurd & Comedy</h1>
            <p className="text-zinc-400">{screens.length} prank screens — no malware, just mayhem</p>
          </div>
        </div>

        <p className="text-zinc-500 text-sm mb-10 max-w-xl">
          These screens skip the scary stuff entirely. Pure comedy. Send one to a friend and watch them go from confused to crying laughing in under 30 seconds.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {screens.map((screen) => (
            <Link
              key={screen.href}
              href={screen.href}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-7 transition-all duration-300 hover:border-yellow-500/50 hover:bg-zinc-800/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.1)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(rgba(250,204,21,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(250,204,21,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="relative">
                <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-white mb-2">
                  {screen.name}
                </h3>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 leading-relaxed">
                  {screen.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm text-zinc-600 group-hover:text-yellow-400 transition-colors">
                  <span>Open prank</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
