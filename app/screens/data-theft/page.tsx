'use client'

import { FullscreenPrank } from '@/components/fullscreen-prank'
import { useState, useEffect } from 'react'

const commands = [
  { text: "root@hacker:~# ./stealer.sh", delay: 500 },
  { text: "Initializing data exfiltration module...", delay: 400 },
  { text: "[+] Module loaded successfully", delay: 300 },
  { text: "", delay: 200 },
  { text: "Connecting to target system...", delay: 600 },
  { text: "[+] Connection established via backdoor", delay: 400 },
  { text: "Establishing secure tunnel...", delay: 500 },
  { text: "[+] Tunnel active: 192.168.1.105 -> 185.243.115.84:4444", delay: 300 },
  { text: "", delay: 200 },
  { text: "Scanning for sensitive files...", delay: 700 },
  { text: "[+] /etc/passwd (FOUND)", delay: 200 },
  { text: "[+] /etc/shadow (FOUND - JACKPOT)", delay: 200 },
  { text: "[+] /home/user/.ssh/id_rsa (FOUND)", delay: 200 },
  { text: "[+] /home/user/Documents/passwords.txt (FOUND)", delay: 200 },
  { text: "[+] /home/user/Documents/tax_returns_2024.pdf (FOUND)", delay: 200 },
  { text: "[+] /home/user/Pictures/passport_scan.jpg (FOUND)", delay: 200 },
  { text: "", delay: 300 },
  { text: "Harvesting browser credentials...", delay: 600 },
  { text: "[+] Chrome: 47 saved passwords extracted", delay: 300 },
  { text: "[+] Firefox: 23 saved passwords extracted", delay: 300 },
  { text: "[+] Edge: 12 saved passwords extracted", delay: 300 },
  { text: "[+] Cookies: 1,247 session tokens captured", delay: 300 },
  { text: "", delay: 200 },
  { text: "Extracting credit card data from browser autofill...", delay: 500 },
  { text: "[+] VISA **** **** **** 4521 (exp 09/26)", delay: 200 },
  { text: "[+] MASTERCARD **** **** **** 8834 (exp 12/25)", delay: 200 },
  { text: "[+] AMEX **** ****** *1003 (exp 03/27)", delay: 200 },
  { text: "", delay: 300 },
  { text: "Uploading stolen data to C2 server...", delay: 800 },
  { text: "[████████████████████████████████] 100%", delay: 500 },
  { text: "[+] Upload complete: 2.3 GB exfiltrated", delay: 300 },
  { text: "", delay: 200 },
  { text: "Cleaning up traces...", delay: 400 },
  { text: "[+] Logs cleared", delay: 200 },
  { text: "[+] Backdoor persistence established", delay: 200 },
  { text: "", delay: 300 },
  { text: "EXFILTRATION COMPLETE.", delay: 0 },
]

export default function DataTheftScreen() {
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
        timeout = setTimeout(addLine, delay + Math.random() * 150)
      } else {
        setComplete(true)
      }
    }

    addLine()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-black font-mono text-green-500 p-6 overflow-hidden">
        <div className="mb-4 text-red-500 text-xl font-bold animate-pulse">
          DATA EXFILTRATION IN PROGRESS
        </div>
        
        <div className="h-[calc(100%-80px)] overflow-y-auto space-y-1">
          {lines.map((line, i) => (
            <div 
              key={i} 
              className={`text-sm ${
                line.includes("FOUND") || line.includes("extracted") || line.includes("captured") ? "text-cyan-400" :
                line.includes("JACKPOT") ? "text-yellow-400" :
                line.includes("[+]") ? "text-green-400" :
                line.includes("COMPLETE") ? "text-red-500 font-bold text-lg" :
                line.includes("████") ? "text-yellow-500" :
                "text-green-500"
              }`}
            >
              {line}
            </div>
          ))}
          
          {/* Blinking cursor at the end */}
          <div className="text-green-500 mt-2">
            root@hacker:~# <span className={complete ? "animate-pulse" : ""}>_</span>
          </div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
