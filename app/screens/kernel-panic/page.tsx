"use client"

import { FullscreenPrank } from "@/components/fullscreen-prank"

// The multilingual macOS restart-after-panic message (Apple's wording).
const LINES = [
  "You need to restart your computer. Hold down the Power button until it turns off, then press the Power button again.",
  "Vous devez redémarrer votre ordinateur. Maintenez le bouton d’alimentation enfoncé jusqu’à ce qu’il s’éteigne, puis appuyez de nouveau sur le bouton d’alimentation.",
  "Sie müssen Ihren Computer neu starten. Halten Sie den Ein-/Ausschalter gedrückt, bis das Gerät ausgeschaltet ist, und drücken Sie dann den Ein-/Ausschalter erneut.",
  "Debe reiniciar el ordenador. Mantenga pulsado el botón de encendido hasta que se apague y, a continuación, vuelva a pulsarlo.",
  "Devi riavviare il computer. Tieni premuto il pulsante di accensione finché non si spegne, quindi premilo di nuovo.",
  "コンピュータを再起動する必要があります。電源ボタンを押し続けて電源を切り、もう一度電源ボタンを押してください。",
  "您需要重新启动电脑。请按住电源按钮直至电脑关闭，然后再按一下电源按钮。",
  "컴퓨터를 다시 시작해야 합니다. 전원 버튼을 눌러 컴퓨터를 끈 다음 전원 버튼을 다시 누르십시오.",
]

export default function KernelPanicScreen() {
  return (
    <FullscreenPrank secondary="#1b1b1b" exitMessage="KERNEL RESTORED - IT WAS A PRANK!" className="cursor-none bg-[#1b1b1b] font-sf text-[#e8e8e8]">
      <div className="flex h-full items-center justify-center px-6">
        <div className="max-w-[760px] space-y-[1.1em] text-center text-[clamp(13px,1.5vw,17px)] leading-snug">
          {LINES.map((l, i) => <p key={i}>{l}</p>)}
        </div>
      </div>
    </FullscreenPrank>
  )
}
