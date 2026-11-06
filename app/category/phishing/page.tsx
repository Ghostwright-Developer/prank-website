import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"

const screens = [
  { name: "Tech Support Scam", href: "/screens/tech-support-scam", description: "Fake Microsoft support popup" },
  { name: "Fake Antivirus", href: "/screens/fake-antivirus", description: "47 viruses detected!" },
  { name: "Browser Hijack", href: "/screens/browser-hijack", description: "Endless redirects and popups" },
  { name: "Fake Flash Update", href: "/screens/fake-flash-update", description: "Classic malware delivery trick" },
]

export default function PhishingCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600">
            <AlertTriangle className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Phishing & Scams</h1>
            <p className="text-zinc-400">{screens.length} prank screens</p>
          </div>
        </div>
        
        <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-4 mb-8">
          <p className="text-orange-300 text-sm">
            These screens replicate common phishing tactics to help educate people about online threats. Use them to teach friends and family what to watch out for!
          </p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {screens.map((screen) => (
            <Link
              key={screen.href}
              href={screen.href}
              className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-orange-500/50 hover:bg-zinc-800/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]"
            >
              <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-white mb-2">
                {screen.name}
              </h3>
              <p className="text-sm text-zinc-500 group-hover:text-zinc-400">
                {screen.description}
              </p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
