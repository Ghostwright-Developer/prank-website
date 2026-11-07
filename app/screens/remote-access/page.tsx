'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

const commands = [
  { text: "[RAT] Initializing Remote Access Trojan...", delay: 400 },
  { text: "[RAT] Connecting to C2 server: 185.243.115.84:4444", delay: 500 },
  { text: "[RAT] Connection established", delay: 300 },
  { text: "[RAT] Authenticating with attacker...", delay: 400 },
  { text: "[RAT] Authentication successful", delay: 300 },
  { text: "", delay: 200 },
  { text: "[INFO] Loading remote control modules...", delay: 500 },
  { text: "[+] Mouse control: ENABLED", delay: 200 },
  { text: "[+] Keyboard injection: ENABLED", delay: 200 },
  { text: "[+] Screen capture: ENABLED", delay: 200 },
  { text: "[+] File browser: ENABLED", delay: 200 },
  { text: "[+] Webcam access: ENABLED", delay: 200 },
  { text: "[+] Microphone access: ENABLED", delay: 200 },
  { text: "[+] Command shell: ENABLED", delay: 200 },
  { text: "", delay: 300 },
  { text: "[ALERT] Attacker has connected to your session", delay: 500 },
  { text: "[ALERT] Remote control is now ACTIVE", delay: 400 },
  { text: "", delay: 300 },
  { text: "Attacker> whoami", delay: 600 },
  { text: "DESKTOP-PC\\victim", delay: 300 },
  { text: "", delay: 200 },
  { text: "Attacker> ipconfig", delay: 500 },
  { text: "IPv4 Address: 192.168.1.105", delay: 200 },
  { text: "Subnet Mask: 255.255.255.0", delay: 200 },
  { text: "Default Gateway: 192.168.1.1", delay: 200 },
  { text: "", delay: 300 },
  { text: "Attacker> dir C:\\Users\\victim\\Desktop", delay: 600 },
  { text: " passwords.txt", delay: 150 },
  { text: " tax_returns_2024.pdf", delay: 150 },
  { text: " family_photos/", delay: 150 },
  { text: " bank_statements/", delay: 150 },
  { text: "", delay: 300 },
  { text: "Attacker> start webcam", delay: 500 },
  { text: "[WEBCAM] Stream started - attacker is watching", delay: 400 },
  { text: "", delay: 300 },
  { text: "Attacker> screenshot", delay: 400 },
  { text: "[SCREENSHOT] Captured and sent to attacker", delay: 300 },
  { text: "", delay: 400 },
  { text: "[WARNING] Full system access granted to remote attacker", delay: 0 },
]

export default function RemoteAccessScreen() {
  const [lines, setLines] = useState<string[]>([])
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    let index = 0
    let timeout: NodeJS.Timeout

    const addLine = () => {
      if (index < commands.length) {
        { const __next = commands[index].text; setLines(prev => [...prev, __next]) }
        const delay = commands[index].delay
        index++
        timeout = setTimeout(addLine, delay + Math.random() * 100)
      } else {
        setComplete(true)
      }
    }

    addLine()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <FullscreenPrank sound="typing">
      <div className="w-full h-full bg-gray-900 p-6 font-mono overflow-hidden">
        <div className="bg-red-900 border-2 border-red-500 p-4 mb-4">
          <div className="text-white font-bold text-xl">REMOTE ACCESS TROJAN ACTIVE</div>
          <div className="text-red-300 text-sm mt-1">An attacker has gained control of your system</div>
        </div>
        
        <div className="bg-black border border-gray-700 rounded p-4 h-[calc(100%-120px)] overflow-y-auto">
          {lines.map((line, i) => (
            <div 
              key={i} 
              className={`text-sm ${
                line.includes("[RAT]") ? "text-purple-400" :
                line.includes("[+]") ? "text-green-400" :
                line.includes("[ALERT]") || line.includes("[WARNING]") ? "text-red-400 font-bold" :
                line.includes("[WEBCAM]") || line.includes("[SCREENSHOT]") ? "text-yellow-400" :
                line.includes("Attacker>") ? "text-cyan-400" :
                line.includes("[INFO]") ? "text-blue-400" :
                "text-gray-300"
              }`}
            >
              {line}
            </div>
          ))}
          
          {/* Blinking cursor */}
          <div className="text-cyan-400 mt-2">
            Attacker{">"} <span className={complete ? "animate-pulse" : ""}>_</span>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
