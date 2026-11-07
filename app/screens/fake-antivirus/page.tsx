"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const threatTypes = [
  { name: "Trojan.Win32.Generic", severity: "critical", location: "C:\\Windows\\System32\\svchost.exe" },
  { name: "Spyware.Keylogger.PWS", severity: "critical", location: "C:\\Users\\User\\AppData\\Local\\Temp\\logger.dll" },
  { name: "Ransomware.WannaCry", severity: "critical", location: "C:\\ProgramData\\Microsoft\\crypto.exe" },
  { name: "Backdoor.RemoteAccess", severity: "critical", location: "C:\\Windows\\System32\\drivers\\rat.sys" },
  { name: "Adware.BrowserHijack", severity: "high", location: "C:\\Program Files\\Browser\\extension.dll" },
  { name: "PUP.CryptoMiner", severity: "high", location: "C:\\Users\\User\\Desktop\\game_crack.exe" },
  { name: "Worm.NetworkSpread", severity: "high", location: "C:\\Users\\Public\\Downloads\\setup.exe" },
  { name: "Rootkit.BootKit", severity: "critical", location: "\\\\?\\PhysicalDrive0\\MBR" },
  { name: "Trojan.BankingInfo", severity: "critical", location: "C:\\Windows\\Temp\\banking.dll" },
  { name: "Spyware.ScreenCapture", severity: "high", location: "C:\\Users\\User\\AppData\\screencap.exe" },
  { name: "Malware.Botnet.ZeuS", severity: "critical", location: "C:\\Windows\\System32\\zeus.dll" },
  { name: "Trojan.PasswordStealer", severity: "critical", location: "C:\\ProgramData\\Chrome\\stealer.exe" },
  { name: "Adware.PopupGenerator", severity: "medium", location: "C:\\Program Files\\PopupAds\\popup.dll" },
  { name: "PUP.SystemOptimizer", severity: "medium", location: "C:\\Program Files\\SpeedBoost\\optimizer.exe" },
  { name: "Trojan.Downloader.Gen", severity: "high", location: "C:\\Users\\User\\Downloads\\free_movie.exe" },
]

export default function FakeAntivirusScreen() {
  const [phase, setPhase] = useState<"scanning" | "results" | "cleaning" | "joke">("scanning")
  const [scanProgress, setScanProgress] = useState(0)
  const [filesScanned, setFilesScanned] = useState(0)
  const [threats, setThreats] = useState<typeof threatTypes>([])
  const [cleanProgress, setCleanProgress] = useState(0)
  const [currentScanPath, setCurrentScanPath] = useState("C:\\")
  const mountedRef = useRef(true)

  const scanPaths = [
    "C:\\Windows\\System32\\",
    "C:\\Windows\\SysWOW64\\",
    "C:\\Users\\User\\AppData\\",
    "C:\\Program Files\\",
    "C:\\Program Files (x86)\\",
    "C:\\Users\\User\\Documents\\",
    "C:\\Users\\User\\Downloads\\",
    "C:\\ProgramData\\",
    "C:\\Windows\\Temp\\",
    "Registry: HKEY_LOCAL_MACHINE\\",
    "Registry: HKEY_CURRENT_USER\\",
    "Memory Scan...",
    "Boot Sector Scan...",
    "Network Connections...",
  ]

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (phase !== "scanning") return

    const scanInterval = setInterval(() => {
      if (!mountedRef.current) return
      
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          setTimeout(() => {
            if (mountedRef.current) setPhase("results")
          }, 1000)
          return 100
        }
        return prev + 0.5
      })

      setFilesScanned(prev => prev + Math.floor(Math.random() * 500) + 100)
      
      const pathIndex = Math.floor((scanProgress / 100) * scanPaths.length)
      setCurrentScanPath(scanPaths[Math.min(pathIndex, scanPaths.length - 1)])

      if (Math.random() > 0.7 && threats.length < threatTypes.length) {
        const newThreat = threatTypes[threats.length]
        setThreats(prev => [...prev, newThreat])
      }
    }, 100)

    return () => clearInterval(scanInterval)
  }, [phase, scanProgress, threats.length])

  useEffect(() => {
    if (phase !== "cleaning") return

    const cleanInterval = setInterval(() => {
      setCleanProgress(prev => {
        if (prev >= 100) {
          clearInterval(cleanInterval)
          setTimeout(() => {
            if (mountedRef.current) setPhase("joke")
          }, 1500)
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(cleanInterval)
  }, [phase])

  if (phase === "joke") {
    return (
      <FullscreenPrank sound="alarm" className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-900 p-8 text-center">
          <div className="text-8xl mb-8">&#128170;</div>
          <h1 className="text-5xl font-bold text-green-400 mb-4">YOUR PC IS CLEAN!</h1>
          <p className="text-2xl text-green-300 mb-4">Because there were never any viruses.</p>
          <p className="text-lg text-gray-400 mb-2">This is what fake antivirus scareware looks like.</p>
          <p className="text-gray-500">Real antivirus software does not pop up randomly demanding payment!</p>
          <p className="mt-8 text-sm text-gray-600">Press ESC to return home</p>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank sound="alarm" className="bg-[#1e1e2e]">
      <div className="h-full w-full bg-gradient-to-br from-[#1e1e2e] to-[#0f0f1a] flex flex-col">
        <div className="bg-gradient-to-r from-red-800 to-red-900 px-6 py-4 flex items-center justify-between border-b-2 border-red-600">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">&#128737;</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TotalSecurity Pro 2024</h1>
              <p className="text-red-200 text-sm">Advanced Threat Protection</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-red-300 text-sm">License Status:</div>
            <div className="text-red-400 font-bold animate-pulse">UNREGISTERED - AT RISK!</div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden">
          {phase === "scanning" && (
            <div className="h-full flex flex-col">
              <div className="text-center mb-6">
                <div className="text-6xl text-red-500 animate-pulse mb-4">&#128270;</div>
                <h2 className="text-3xl font-bold text-white mb-2">SCANNING YOUR SYSTEM...</h2>
                <p className="text-gray-400">Please wait while we check for threats</p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Scan Progress</span>
                  <span>{Math.floor(scanProgress)}%</span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/30 rounded p-3 mb-4">
                <div className="text-xs text-gray-500">Currently scanning:</div>
                <div className="text-green-400 font-mono text-sm truncate">{currentScanPath}</div>
                <div className="text-xs text-gray-500 mt-1">Files scanned: {filesScanned.toLocaleString()}</div>
              </div>

              <div className="flex-1 bg-black/30 rounded border border-red-900 overflow-hidden">
                <div className="bg-red-900/50 px-4 py-2 flex items-center justify-between">
                  <span className="text-red-400 font-bold">THREATS DETECTED: {threats.length}</span>
                  <span className="text-red-500 animate-pulse">&#9888;</span>
                </div>
                <div className="p-4 h-64 overflow-y-auto">
                  {threats.map((threat, i) => (
                    <div key={i} className="mb-3 pb-3 border-b border-gray-800 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          threat.severity === "critical" ? "bg-red-500 animate-pulse" :
                          threat.severity === "high" ? "bg-orange-500" : "bg-yellow-500"
                        }`} />
                        <span className="text-white font-medium">{threat.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          threat.severity === "critical" ? "bg-red-800 text-red-200" :
                          threat.severity === "high" ? "bg-orange-800 text-orange-200" :
                          "bg-yellow-800 text-yellow-200"
                        }`}>
                          {threat.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 ml-5 mt-1 font-mono">{threat.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {phase === "results" && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-8xl text-red-500 animate-bounce mb-6">&#9888;</div>
              <h2 className="text-4xl font-bold text-red-500 mb-4">CRITICAL THREATS FOUND!</h2>
              <p className="text-xl text-white mb-8">{threats.length} serious threats are putting your computer at risk!</p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-red-900/30 border border-red-600 rounded p-4">
                  <div className="text-4xl text-red-500 mb-2">{threats.filter(t => t.severity === "critical").length}</div>
                  <div className="text-red-400 font-bold">CRITICAL</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-600 rounded p-4">
                  <div className="text-4xl text-orange-500 mb-2">{threats.filter(t => t.severity === "high").length}</div>
                  <div className="text-orange-400 font-bold">HIGH RISK</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-600 rounded p-4">
                  <div className="text-4xl text-yellow-500 mb-2">{threats.filter(t => t.severity === "medium").length}</div>
                  <div className="text-yellow-400 font-bold">MEDIUM</div>
                </div>
              </div>

              <div className="bg-black/50 border-2 border-red-600 rounded-lg p-6 max-w-2xl">
                <p className="text-red-400 mb-4">
                  Your computer is infected with dangerous malware including ransomware, trojans, and spyware!
                </p>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  Special Offer: $49.99/year <span className="text-lg line-through text-gray-500">$199.99</span>
                </div>
                <button 
                  onClick={() => setPhase("cleaning")}
                  className="w-full py-4 bg-green-600 text-white text-xl font-bold rounded hover:bg-green-700 transition-colors animate-pulse cursor-pointer"
                >
                  REMOVE ALL THREATS NOW
                </button>
              </div>
            </div>
          )}

          {phase === "cleaning" && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl text-green-500 mb-6 animate-spin">&#128737;</div>
              <h2 className="text-3xl font-bold text-white mb-4">REMOVING THREATS...</h2>
              <div className="w-full max-w-md mb-8">
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-100"
                    style={{ width: `${cleanProgress}%` }}
                  />
                </div>
                <div className="text-green-400 mt-2">{Math.floor(cleanProgress)}% Complete</div>
              </div>
              <div className="text-gray-400">
                {cleanProgress < 30 && "Quarantining malicious files..."}
                {cleanProgress >= 30 && cleanProgress < 60 && "Removing trojans and spyware..."}
                {cleanProgress >= 60 && cleanProgress < 90 && "Cleaning registry entries..."}
                {cleanProgress >= 90 && "Finalizing cleanup..."}
              </div>
            </div>
          )}
        </div>

        <div className="bg-black/50 border-t border-gray-800 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>TotalSecurity Pro 2024 - Version 12.0.4851</span>
            <span className="text-red-400">Protection Status: COMPROMISED</span>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
