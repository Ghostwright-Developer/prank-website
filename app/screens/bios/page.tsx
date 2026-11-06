"use client"

import { useMemo } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink, useRevealedLines } from "@/components/prank-kit"

// Award BIOS style POST that ends in a checksum failure and halts.
export default function BiosScreen() {
  const lines = useMemo(
    () => [
      "Award Modular BIOS v6.00PG, An Energy Star Ally",
      "Copyright (C) 1984-2008, Award Software, Inc.",
      "",
      "ASUS P5K-E ACPI BIOS Revision 1002",
      "",
      "Main Processor : Intel(R) Core(TM)2 Quad CPU Q6600 @ 2.40GHz",
      "Memory Testing :  4194304K OK",
      "",
      "Award Plug and Play BIOS Extension v1.0A",
      "Copyright (C) 2008, Award Software, Inc.",
      "   Detecting IDE Primary Master   ... ST3500418AS",
      "   Detecting IDE Primary Slave    ... None",
      "   Detecting IDE Secondary Master ... HL-DT-ST DVDRAM",
      "   Detecting IDE Secondary Slave  ... None",
      "",
      "BIOS ROM checksum error",
      "CMOS checksum error - Defaults loaded",
      "Primary Master Hard Disk S.M.A.R.T. status BAD, Backup and Replace",
      "",
      "System halted.",
    ],
    [],
  )
  const { visible, done } = useRevealedLines(lines, (i) => (i < 8 ? 180 : 420))
  const on = useBlink()
  return (
    <FullscreenPrank exitMessage="BIOS RESTORED - IT WAS A PRANK!" className="cursor-none bg-black font-dos text-[#c8c8c8]">
      <div className="h-full p-6 text-[clamp(15px,2vw,22px)] leading-[1.2]">
        {visible.map((l, i) => (
          <div key={i} className={`whitespace-pre ${l.includes("error") || l.includes("BAD") ? "text-white" : ""}`}>{l || " "}</div>
        ))}
        {done ? <span className={on ? "bg-[#c8c8c8]" : ""}>&nbsp;</span> : null}
      </div>
    </FullscreenPrank>
  )
}
