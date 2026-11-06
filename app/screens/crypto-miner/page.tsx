"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

export default function CryptoMinerScreen() {
  const [hashRate, setHashRate] = useState(0)
  const [coins, setCoins] = useState(0)
  const [cpuUsage, setCpuUsage] = useState(0)
  const [gpuUsage, setGpuUsage] = useState(0)
  const [temperature, setTemperature] = useState(45)
  const [shares, setShares] = useState({ accepted: 0, rejected: 0 })
  const [workers, setWorkers] = useState<{ id: string; hashRate: number; temp: number }[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [phase, setPhase] = useState<"mining" | "joke">("mining")
  const [uptime, setUptime] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (phase !== "mining") return

    // Initialize workers
    setWorkers([
      { id: "GPU #0 (RTX 3080)", hashRate: 0, temp: 45 },
      { id: "GPU #1 (RTX 3070)", hashRate: 0, temp: 42 },
      { id: "CPU (Ryzen 9)", hashRate: 0, temp: 38 },
    ])

    // Add initial log
    setLogs(["[INFO] Miner initialized", "[INFO] Connecting to pool stratum+tcp://pool.evil-crypto.com:3333"])

    // Main update loop
    const interval = setInterval(() => {
      if (!mountedRef.current) return

      // Update hash rates
      setHashRate(prev => {
        const base = 95000000 + Math.random() * 10000000
        return Math.floor(base)
      })

      // Update coins mined
      setCoins(prev => prev + Math.random() * 0.0000001)

      // Update CPU/GPU usage
      setCpuUsage(95 + Math.random() * 5)
      setGpuUsage(98 + Math.random() * 2)

      // Update temperature (gradually increasing)
      setTemperature(prev => Math.min(92, prev + (Math.random() * 0.5)))

      // Update shares
      if (Math.random() > 0.7) {
        setShares(prev => ({
          accepted: prev.accepted + (Math.random() > 0.1 ? 1 : 0),
          rejected: prev.rejected + (Math.random() > 0.9 ? 1 : 0)
        }))
      }

      // Update workers
      setWorkers(prev => prev.map(w => ({
        ...w,
        hashRate: w.id.includes("3080") ? 95 + Math.random() * 5 : 
                  w.id.includes("3070") ? 60 + Math.random() * 5 : 
                  12 + Math.random() * 3,
        temp: w.temp + (Math.random() * 0.3)
      })))

      // Update uptime
      setUptime(prev => prev + 1)

      // Update earnings
      setEarnings(prev => prev + Math.random() * 0.001)

      // Add random logs
      if (Math.random() > 0.8) {
        const logMessages = [
          "[INFO] Share accepted (diff: 8.589G)",
          "[INFO] New job received",
          "[WARN] GPU temperature high: throttling",
          "[INFO] Block found! Hash: 0x7f3a...",
          "[INFO] Pool: Hashrate 98.2 MH/s",
          "[WARN] Power consumption: 450W",
        ]
        setLogs(prev => [...prev.slice(-20), logMessages[Math.floor(Math.random() * logMessages.length)]])
      }
    }, 200)

    return () => clearInterval(interval)
  }, [phase])

  const formatHashRate = (h: number) => {
    if (h >= 1000000000) return `${(h / 1000000000).toFixed(2)} GH/s`
    if (h >= 1000000) return `${(h / 1000000).toFixed(2)} MH/s`
    if (h >= 1000) return `${(h / 1000).toFixed(2)} KH/s`
    return `${h.toFixed(0)} H/s`
  }

  const formatUptime = (s: number) => {
    const hrs = Math.floor(s / 3600)
    const mins = Math.floor((s % 3600) / 60)
    const secs = s % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }



  return (
    <FullscreenPrank className="bg-[#0a0a12]">
      <div className="h-full w-full bg-[#0a0a12] font-mono text-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-900/50 to-red-900/50 px-6 py-3 flex items-center justify-between border-b border-yellow-800/30">
          <div className="flex items-center gap-4">
            <span className="text-yellow-500 text-2xl">&#9881;</span>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">CryptoJacker Pro v2.1</h1>
              <p className="text-xs text-red-400">UNAUTHORIZED MINING ACTIVE</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Uptime</div>
            <div className="text-lg text-green-400 font-mono">{formatUptime(uptime)}</div>
          </div>
        </div>

        <div className="flex-1 p-4 grid grid-cols-4 gap-4 overflow-hidden">
          {/* Main stats */}
          <div className="col-span-3 grid grid-cols-3 gap-4">
            {/* Hash rate */}
            <div className="bg-black/50 border border-green-900 rounded p-4">
              <div className="text-xs text-gray-500 mb-1">Total Hashrate</div>
              <div className="text-3xl font-bold text-green-400">{formatHashRate(hashRate)}</div>
              <div className="mt-2 h-1 bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-green-500 w-full animate-pulse" />
              </div>
            </div>

            {/* Coins mined */}
            <div className="bg-black/50 border border-yellow-900 rounded p-4">
              <div className="text-xs text-gray-500 mb-1">Coins Mined (to attacker)</div>
              <div className="text-3xl font-bold text-yellow-400">{coins.toFixed(8)}</div>
              <div className="text-xs text-gray-500 mt-2">BTC (~${(coins * 43000).toFixed(4)} USD)</div>
            </div>

            {/* Shares */}
            <div className="bg-black/50 border border-blue-900 rounded p-4">
              <div className="text-xs text-gray-500 mb-1">Shares</div>
              <div className="flex gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-400">{shares.accepted}</div>
                  <div className="text-xs text-gray-500">Accepted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{shares.rejected}</div>
                  <div className="text-xs text-gray-500">Rejected</div>
                </div>
              </div>
            </div>

            {/* Workers */}
            <div className="col-span-2 bg-black/50 border border-gray-800 rounded p-4">
              <div className="text-xs text-gray-500 mb-3">Active Workers</div>
              <div className="space-y-2">
                {workers.map((worker, i) => (
                  <div key={i} className="flex items-center justify-between bg-black/30 rounded p-2">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 animate-pulse">&#9679;</span>
                      <span className="text-gray-300">{worker.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400">{worker.hashRate.toFixed(1)} MH/s</span>
                      <span className={`${worker.temp > 80 ? "text-red-400" : worker.temp > 65 ? "text-yellow-400" : "text-green-400"}`}>
                        {worker.temp.toFixed(0)}°C
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System stats */}
            <div className="bg-black/50 border border-red-900 rounded p-4">
              <div className="text-xs text-gray-500 mb-3">System Resources</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">CPU Usage</span>
                    <span className="text-red-400">{cpuUsage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-red-500 transition-all" style={{ width: `${cpuUsage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">GPU Usage</span>
                    <span className="text-red-400">{gpuUsage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full bg-red-500 transition-all" style={{ width: `${gpuUsage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Temperature</span>
                    <span className={temperature > 85 ? "text-red-400 animate-pulse" : "text-yellow-400"}>
                      {temperature.toFixed(0)}°C
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all ${temperature > 85 ? "bg-red-500 animate-pulse" : "bg-yellow-500"}`}
                      style={{ width: `${(temperature / 100) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Log output */}
            <div className="col-span-3 bg-black border border-gray-800 rounded p-4 overflow-hidden">
              <div className="text-xs text-gray-500 mb-2">Mining Log</div>
              <div className="h-24 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                  <div key={i} className={`${
                    log.includes("WARN") ? "text-yellow-400" : 
                    log.includes("ERROR") ? "text-red-400" :
                    log.includes("accepted") ? "text-green-400" :
                    "text-gray-400"
                  }`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Pool info */}
            <div className="bg-black/50 border border-purple-900 rounded p-4">
              <div className="text-xs text-gray-500 mb-2">Mining Pool</div>
              <div className="text-purple-400 text-sm break-all">pool.evil-crypto.com:3333</div>
              <div className="text-xs text-gray-500 mt-2">Wallet: 1Evil...xyz</div>
            </div>

            {/* Earnings */}
            <div className="bg-black/50 border border-green-900 rounded p-4">
              <div className="text-xs text-gray-500 mb-2">Estimated Earnings</div>
              <div className="text-green-400 text-lg">${earnings.toFixed(4)}/hour</div>
              <div className="text-xs text-gray-500 mt-1">(sent to attacker)</div>
            </div>

            {/* Warning button - does nothing */}
            <div className="w-full py-3 bg-red-700/50 text-white/50 font-bold rounded text-center cursor-not-allowed">
              STOP MINING (DISABLED)
            </div>

            {/* Warning */}
            <div className="bg-red-950 border border-red-800 rounded p-3">
              <div className="text-red-400 text-xs">
                <span className="animate-pulse">&#9888;</span> Your hardware is being exploited
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
