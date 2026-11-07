"use client"

import { useEffect, useRef, useState } from "react"
import { sfx } from "@/lib/sfx"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { BlissWallpaper, DesktopIcon, XPTaskbar } from "@/components/windows-ui"

const TIPS = [
  "It looks like you're trying to use a computer. Would you like help?",
  "It looks like you're writing a letter. It also looks like you've been staring at the screen for 11 minutes without writing a letter. Would you like help with that?",
  "It looks like you're trying to close me. Would you like help closing me? I will not be providing it.",
  "I've reorganized your desktop. Everything is now in a folder called 'Stuff'.",
  "It looks like you're about to click something. Would you like to click it more slowly?",
  "I noticed you have 14 unsaved documents. I have saved all of them as 'Document1'.",
  "It looks like you're typing a password. Would you like me to remember it? I already did.",
  "Fun fact: I was retired in 2007. I have continued to attend meetings.",
  "I rated your last email 'a bit much'.",
  "It looks like you're trying to be productive. Would you like me to stop you?",
  "I've changed your default font to Comic Sans. The vote was unanimous. I voted twice.",
  "It looks like you're having a nice day. Would you like me to find something to change that?",
  "You've reached the end of this tip. Would you like to see this tip again? There are no other tips.",
  "It looks like you're trying to get away. Would you like help staying?",
]
const ERRORS = [
  "Paperclip has performed an illegal operation and will be shut down.\n\nPaperclip declined.",
  "The paperclip cannot be removed because it is being used by another paperclip.",
  "Are you sure you want to delete the paperclip?\n\n(Yes is the same as No in this case.)",
  "Your document has been saved. It was not the document you were working on. It is now the one you are working on.",
  "Not enough memory to close this assistant. Please close the assistant and try again.",
]

interface Err { id: number; x: number; y: number; msg: string }

export default function WindowsXPTourScreen() {
  const [visible, setVisible] = useState(false)
  const [tip, setTip] = useState(0)
  const [pos, setPos] = useState({ x: 62, y: 52 })
  const [errors, setErrors] = useState<Err[]>([])
  const [menu, setMenu] = useState(false)
  const id = useRef(0)

  useEffect(() => { const t = setTimeout(() => setVisible(true), 1500); return () => clearTimeout(t) }, [])
  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setTip((i) => (i + 1) % TIPS.length), 9000)
    return () => clearInterval(t)
  }, [visible])

  const addError = (msg: string) =>
    (sfx.ding(), setErrors((p) => [...p, { id: ++id.current, x: 18 + Math.random() * 40, y: 12 + Math.random() * 40, msg }].slice(-5)))

  const goAway = () => {
    setVisible(false)
    setTimeout(() => { setPos({ x: 20 + Math.random() * 55, y: 20 + Math.random() * 50 }); setTip(2); setVisible(true) }, 3500)
  }

  return (
    <FullscreenPrank exitMessage="THE PAPERCLIP HAS BEEN DISMISSED - IT WAS A PRANK!" className="cursor-default bg-black font-[Tahoma,Verdana,sans-serif]">
      <BlissWallpaper />
      <div className="absolute left-3 top-3 flex flex-col gap-3">
        {([["recycle", "Recycle Bin"], ["computer", "My Computer"], ["folder", "My Documents"], ["browser", "Internet Explorer"]] as const).map(([k, l]) => (
          <div key={l} onClick={() => addError(`${l} is currently being used by the paperclip.`)}><DesktopIcon kind={k} label={l} /></div>
        ))}
      </div>

      {visible && (
        <div className="absolute z-40 transition-all duration-1000" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <div className="relative w-[min(290px,80vw)] rounded-[6px] border border-black bg-[#ffffe1] p-3 text-[12px] text-black shadow-[2px_2px_0_rgba(0,0,0,.4)]">
            <p key={tip} className="min-h-[3.6em] animate-[fadein_.6s_ease]">{TIPS[tip]}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setTip((i) => (i + 1) % TIPS.length)} className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-[2px]">Get Help</button>
              <button onClick={goAway} className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-[2px]">Go Away</button>
              <button onClick={() => addError(ERRORS[Math.floor(Math.random() * ERRORS.length)])} className="rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-[2px]">Options</button>
            </div>
            <span className="absolute -bottom-[10px] left-10 h-0 w-0 border-x-[9px] border-t-[10px] border-x-transparent border-t-black" />
            <span className="absolute -bottom-[8px] left-[41px] h-0 w-0 border-x-[8px] border-t-[9px] border-x-transparent border-t-[#ffffe1]" />
          </div>
          <div className="ml-6 mt-3 animate-bounce text-[64px] leading-none drop-shadow-lg" onClick={() => addError(ERRORS[Math.floor(Math.random() * ERRORS.length)])}>📎</div>
        </div>
      )}

      {errors.map((e) => (
        <div key={e.id} className="absolute z-50 w-[min(340px,92vw)] border-[3px] border-[#0054e3] bg-[#ece9d8] shadow-[3px_3px_10px_rgba(0,0,0,.6)]" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
          <div className="flex items-center justify-between bg-gradient-to-b from-[#3d95ff] via-[#0058ee] to-[#0045c4] px-2 py-[4px] text-[12px] font-bold text-white">
            <span>Microsoft Office Assistant</span>
            <button onClick={() => { setErrors((p) => p.filter((x) => x.id !== e.id)); setTimeout(() => addError(ERRORS[Math.floor(Math.random() * ERRORS.length)]), 900) }} className="grid h-[20px] w-[20px] place-items-center rounded-[3px] border border-white bg-gradient-to-b from-[#e8826a] to-[#c8432b] text-[11px]">✕</button>
          </div>
          <div className="flex gap-3 p-4 text-[12px] text-black">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8b400] text-[20px] font-bold text-white">!</span>
            <p className="whitespace-pre-line">{e.msg}</p>
          </div>
          <div className="flex justify-center pb-3">
            <button onClick={() => { setErrors((p) => p.filter((x) => x.id !== e.id)); setTimeout(() => addError(ERRORS[Math.floor(Math.random() * ERRORS.length)]), 900) }} className="min-w-[80px] rounded-[3px] border border-[#003c74] bg-gradient-to-b from-white to-[#d6d0c5] px-3 py-[2px] text-[12px] text-black">OK</button>
          </div>
        </div>
      ))}

      {menu && (
        <div className="absolute bottom-[30px] left-0 z-50 w-[300px] overflow-hidden rounded-t-[6px] border-2 border-[#0a3bb0] bg-white text-[12px] shadow-2xl">
          <div className="bg-gradient-to-b from-[#3d7be8] to-[#1a4fc4] px-3 py-3 font-bold text-white">Administrator</div>
          {["Internet", "E-mail", "My Documents", "My Music", "Control Panel"].map((l) => (
            <div key={l} onClick={() => { setMenu(false); addError(`${l}: access has been reorganized by the paperclip.`) }} className="cursor-default px-4 py-2 hover:bg-[#316ac5] hover:text-white">{l}</div>
          ))}
        </div>
      )}
      <div onClick={() => setMenu((m) => !m)}><XPTaskbar /></div>
      <style>{`@keyframes fadein { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </FullscreenPrank>
  )
}
