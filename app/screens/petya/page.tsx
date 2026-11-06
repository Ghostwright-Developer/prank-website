"use client"

import { useState, useEffect, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"

const skullAscii = `
                            ....                              
                        .::::::::::.                          
                      .::::::::::::::.                        
                     ::::::::::::::::::                       
                   .::::::::::::::::::::.                     
                  ::::::::::::::::::::::::                    
                 ::::::::::::::::::::::::::                   
                ::::::::::::::::::::::::::::                  
               ::::::::::::::::::::::::::::::                 
              ::::::::::::::::::::::::::::::::                
             ::::::::::::::::::::::::::::::::::               
            .:::::::.            .::::::::::::::              
            ::::::                   .::::::::::              
           :::::      ::::::::.        :::::::::              
           ::::     :::::::::::::.      ::::::::              
          ::::     :::::::::::::::.      :::::::              
          ::::     ::::::::::::::::.     :::::::              
          ::::      ::::::::::::::.      :::::::              
          :::::       ::::::::::        ::::::::              
           :::::                       ::::::::               
            ::::::                   :::::::::                
             :::::::              .::::::::::                 
               ::::::::::::::::::::::::::::                   
                 :::::::::::::::::::::::::                    
                    ::::::::::::::::::::                      
                       :::::::::::::::                        
                          .::::::::                           
                             :::                              
`

const bootMessages = [
  "Repairing file system on C:",
  "The type of the file system is NTFS.",
  "One of your disks needs to be checked for consistency. You",
  "may cancel the disk check, but it is strongly recommended",
  "that you continue.",
  "",
  "To skip disk checking, press any key within 10 seconds.",
  "",
  "CHKDSK is verifying files (stage 1 of 5)...",
  "  File verification completed. 234852 file records processed.",
  "CHKDSK is verifying indexes (stage 2 of 5)...",
  "  Index verification completed. 0 unindexed files scanned.",
  "CHKDSK is verifying security descriptors (stage 3 of 5)...",
  "  Security descriptor verification completed. 28342 data files processed.",
  "CHKDSK is verifying file data (stage 4 of 5)...",
  "  File data verification completed.",
  "CHKDSK is verifying free space (stage 5 of 5)...",
  "  Free space verification is complete.",
  "",
  "Windows found problems with the file system.",
  "Run CHKDSK with the /F (fix) option to correct these.",
  "",
  "CRITICAL_PROCESS_DIED",
  "",
  "Collecting some error info, and then we'll restart for you.",
]

export default function PetyaScreen() {
  const [phase, setPhase] = useState<"boot" | "skull" | "message" | "joke">("boot")
  const [bootLines, setBootLines] = useState<string[]>([])
  const [blinkOn, setBlinkOn] = useState(true)
  const [encryptProgress, setEncryptProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (mountedRef.current) setBlinkOn(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Boot phase
  useEffect(() => {
    if (phase !== "boot") return
    let i = 0
    const interval = setInterval(() => {
      if (!mountedRef.current) return
      if (i < bootMessages.length) {
        setBootLines(prev => [...prev, bootMessages[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          if (mountedRef.current) setPhase("skull")
        }, 1500)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [phase])

  // Skull phase with encryption progress
  useEffect(() => {
    if (phase !== "skull") return
    const interval = setInterval(() => {
      if (!mountedRef.current) return
      setEncryptProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            if (mountedRef.current) setPhase("message")
          }, 2000)
          return 100
        }
        return prev + Math.random() * 3 + 1
      })
    }, 100)
    return () => clearInterval(interval)
  }, [phase])

  if (phase === "joke") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="flex h-full w-full flex-col items-center justify-center bg-black p-8 text-center font-mono">
          <pre className="text-green-500 text-xs mb-8 leading-tight">{skullAscii}</pre>
          <h1 className="text-4xl text-green-400 mb-4">YOU'RE SAFE!</h1>
          <p className="text-xl text-green-300 mb-2">This was just a simulation of the Petya ransomware.</p>
          <p className="text-gray-500">Your disk was never encrypted. Press ESC to return.</p>
        </div>
      </FullscreenPrank>
    )
  }

  if (phase === "boot") {
    return (
      <FullscreenPrank className="bg-black">
        <div className="h-full w-full bg-black p-4 font-mono text-sm text-gray-300 overflow-hidden">
          {bootLines.map((line, i) => (
            <div key={i} className={line.includes("CRITICAL") ? "text-red-500 font-bold" : ""}>
              {line || "\u00a0"}
            </div>
          ))}
          <span className={`${blinkOn ? "opacity-100" : "opacity-0"}`}>_</span>
        </div>
      </FullscreenPrank>
    )
  }

  if (phase === "skull") {
    return (
      <FullscreenPrank className="bg-red-600">
        <div className="h-full w-full bg-red-600 flex flex-col items-center justify-center font-mono p-8">
          <pre className={`text-white text-xs leading-tight mb-8 transition-opacity ${blinkOn ? "opacity-100" : "opacity-80"}`}>
            {skullAscii}
          </pre>
          <div className="text-white text-center">
            <div className="text-2xl mb-4">REPAIRING DISK...</div>
            <div className="w-64 h-4 bg-red-800 rounded overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${encryptProgress}%` }}
              />
            </div>
            <div className="mt-2 text-xl">{Math.floor(encryptProgress)}%</div>
            <div className="mt-4 text-sm opacity-75">DO NOT TURN OFF YOUR COMPUTER</div>
          </div>
        </div>
      </FullscreenPrank>
    )
  }

  return (
    <FullscreenPrank className="bg-black">
      <div className="h-full w-full bg-black flex flex-col items-center justify-center font-mono p-8 overflow-y-auto">
        <pre className={`text-red-500 text-xs leading-tight mb-8 ${blinkOn ? "" : "opacity-80"}`}>
          {skullAscii}
        </pre>
        
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl text-red-500 mb-6">
            Ooops, your important files are encrypted.
          </h1>
          
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">
            If you see this text, then your files are no longer accessible, because they have 
            been encrypted. Perhaps you are busy looking for a way to recover your files, but 
            do not waste your time. Nobody can recover your files without our decryption service.
          </p>
          
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">
            We guarantee that you can recover all your files safely and easily. All you need to 
            do is submit the payment and purchase the decryption key.
          </p>

          <div className="border border-red-800 bg-red-950/30 p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <div className="text-gray-500">Personal Installation Key:</div>
                <div className="text-yellow-400 font-mono text-xs break-all mt-1">
                  wowDga2Pj8Vnm...jYC0EuQs+YAFh
                </div>
              </div>
              <div className="text-left">
                <div className="text-gray-500">Bitcoin Address:</div>
                <div className="text-yellow-400 font-mono text-xs break-all mt-1">
                  1Mz7153HMuxXTuR2R1t78mGSdzaAtNbBWX
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-400 text-sm mb-8">
            Send <span className="text-green-400">$300</span> worth of Bitcoin to the address above.
          </div>

          <button 
            onClick={() => setPhase("joke")}
            className="px-8 py-3 bg-red-700 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
          >
            I already paid, decrypt my files!
          </button>
        </div>
      </div>
    </FullscreenPrank>
  )
}
