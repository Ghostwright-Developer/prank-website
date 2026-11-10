"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const hackSequence = [
  { text: "root@darknet:~# nmap -sS -sV -O 192.168.1.0/24", type: "cmd" },
  { text: "Starting Nmap 7.94 ( https://nmap.org )", type: "output" },
  { text: "Scanning 256 hosts...", type: "output" },
  { text: "Host 192.168.1.1 appears to be up (0.0012s latency)", type: "success" },
  { text: "Host 192.168.1.105 appears to be up (0.0023s latency)", type: "success" },
  { text: "", type: "output" },
  { text: "root@darknet:~# exploit -t 192.168.1.105 -p 445", type: "cmd" },
  { text: "[*] Starting SMB exploitation module...", type: "output" },
  { text: "[*] Target: 192.168.1.105:445", type: "output" },
  { text: "[*] Sending malicious payload...", type: "warning" },
  { text: "[+] Exploitation successful!", type: "success" },
  { text: "[+] Meterpreter session 1 opened", type: "success" },
  { text: "", type: "output" },
  { text: "meterpreter > sysinfo", type: "cmd" },
  { text: "Computer     : YOURCOMPUTER-PC", type: "output" },
  { text: "OS           : Windows 10 (Build 19045)", type: "output" },
  { text: "Architecture : x64", type: "output" },
  { text: "Meterpreter  : x64/windows", type: "output" },
  { text: "", type: "output" },
  { text: "meterpreter > hashdump", type: "cmd" },
  { text: "Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::", type: "warning" },
  { text: "Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::", type: "warning" },
  { text: "User:1001:aad3b435b51404eeaad3b435b51404ee:e52cac67419a9a224a3b108f3fa6cb6d:::", type: "warning" },
  { text: "", type: "output" },
  { text: "meterpreter > download /Users/*/Documents/*", type: "cmd" },
  { text: "[*] Downloading files...", type: "output" },
  { text: "[+] passwords.txt (12 KB)", type: "success" },
  { text: "[+] tax_return_2024.pdf (2.3 MB)", type: "success" },
  { text: "[+] bank_statements/ (47 files)", type: "success" },
  { text: "[+] private_photos/ (234 files)", type: "success" },
  { text: "", type: "output" },
  { text: "meterpreter > webcam_snap", type: "cmd" },
  { text: "[*] Starting camera...", type: "warning" },
  { text: "[+] Webcam snapshot saved: victim_001.jpg", type: "success" },
  { text: "", type: "output" },
  { text: "meterpreter > keyscan_start", type: "cmd" },
  { text: "[*] Keylogger started", type: "warning" },
  { text: "", type: "output" },
  { text: "meterpreter > persistence -U -i 10 -p 4444", type: "cmd" },
  { text: "[*] Installing persistence module...", type: "output" },
  { text: "[+] Persistence installed successfully", type: "success" },
  { text: "", type: "output" },
  { text: "[!] FULL SYSTEM ACCESS ACHIEVED", type: "critical" },
  { text: "", type: "output" },
  { text: "meterpreter > ", type: "cmd" },
]

export default function MatrixScreen() {
  const [lines, setLines] = useState<typeof hackSequence>([])
  const [phase, setPhase] = useState<"matrix" | "hack" | "frozen">("matrix")
  const [cursorVisible, setCursorVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Matrix rain canvas effect
  useEffect(() => {
    if (phase !== "matrix" && phase !== "hack") return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF"
    const fontSize = 14
    let columns = Math.floor(canvas.width / fontSize)
    let drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        
        ctx.fillStyle = Math.random() > 0.95 ? "#fff" : "#0f0"
        ctx.fillText(char, x, y)
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)
    
    const handleResize = () => {
      setSize()
      columns = Math.floor(canvas.width / fontSize)
      drops = Array(columns).fill(1)
    }
    window.addEventListener("resize", handleResize)

    // Switch to hack phase after 3 seconds
    if (phase === "matrix") {
      const timer = setTimeout(() => setPhase("hack"), 3000)
      return () => {
        clearInterval(interval)
        clearTimeout(timer)
        window.removeEventListener("resize", handleResize)
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [phase])

  // Hack sequence - runs once and freezes
  useEffect(() => {
    if (phase !== "hack") return
    
    let i = 0
    const interval = setInterval(() => {
      if (i < hackSequence.length) {
        { const __next = hackSequence[i]; setLines(prev => [...prev, __next]) }
        i++
        // Auto-scroll terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
        setPhase("frozen") // Freeze - no more transitions
      }
    }, 150)
    
    return () => clearInterval(interval)
  }, [phase])

  // Blinking cursor for frozen state
  useEffect(() => {
    if (phase !== "frozen") return
    const interval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [phase])

  return (
    <FullscreenPrank sound="typing" className="cursor-none bg-black">
      <div className="h-full w-full bg-black relative overflow-hidden">
        {/* Matrix rain canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        {/* Terminal overlay */}
        {(phase === "hack" || phase === "frozen") && (
          <div className="absolute inset-0 bg-black/80 p-4 font-mono text-sm flex flex-col">
            {/* Header */}
            <div className="mb-4 pb-2 border-b border-green-800 shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-green-500">
                  <span className="text-red-500 animate-pulse mr-2">&#9679;</span>
                  DARKNET TERMINAL v3.14
                </div>
                <div className="text-green-600 text-xs">
                  TARGET: 192.168.1.105 | SESSION: ACTIVE
                </div>
              </div>
            </div>
            
            {/* Terminal output */}
            <div ref={terminalRef} className="flex-1 overflow-y-auto pb-16">
              {lines.map((line, i) => (
                <div key={i} className={`mb-1 ${
                  line.type === "cmd" ? "text-cyan-400" :
                  line.type === "success" ? "text-green-400" :
                  line.type === "warning" ? "text-yellow-400" :
                  line.type === "critical" ? "text-red-500 text-xl font-bold animate-pulse" :
                  "text-green-300"
                }`}>
                  {line.text || "\u00a0"}
                </div>
              ))}
              {phase === "frozen" && (
                <span className={`text-cyan-400 ${cursorVisible ? "opacity-100" : "opacity-0"}`}>_</span>
              )}
            </div>
            
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-green-800 bg-black/90 px-4 py-2">
              <div className="flex justify-between text-xs text-green-600">
                <span>CPU: 87% | RAM: 4.2GB | NET: 12.4 MB/s</span>
                <span className="text-red-500 animate-pulse">INTRUSION ACTIVE</span>
              </div>
            </div>
          </div>
        )}

        {/* Initial matrix phase text */}
        {phase === "matrix" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-green-500 text-4xl font-mono animate-pulse">
              INITIALIZING...
            </div>
          </div>
        )}
      </div>
    </FullscreenPrank>
  )
}
