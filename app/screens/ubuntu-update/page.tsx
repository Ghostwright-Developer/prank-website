"use client"

import { useEffect, useMemo, useRef } from "react"
import { FullscreenPrank } from "@/components/fullscreen-prank"
import { useBlink, useRevealedLines } from "@/components/prank-kit"

const PKGS = ["libc6","libc-bin","libssl3","openssl","libsystemd0","systemd","systemd-sysv","udev","libudev1","apt","libapt-pkg6.0","dpkg","bash","coreutils","util-linux","mount","libgnutls30","linux-image-6.8.0-45-generic","linux-modules-6.8.0-45-generic","linux-headers-6.8.0-45","firefox","snapd","python3","python3-minimal","libpython3.12","openssh-client","openssh-server","curl","libcurl4","gnupg","gpgv","tzdata","vim-common","vim-tiny","nano","grub-common","grub-pc","initramfs-tools","cloud-init","networkd-dispatcher"]

export default function UbuntuUpdateScreen() {
  const lines = useMemo(() => {
    const out: string[] = [
      "owen@ubuntu:~$ sudo apt-get update && sudo apt-get upgrade -y",
      "Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease",
      "Get:2 http://archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]",
      "Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]",
      "Fetched 252 kB in 1s (312 kB/s)",
      "Reading package lists... Done",
      "Building dependency tree... Done",
      "Reading state information... Done",
      "Calculating upgrade... Done",
      `The following packages will be upgraded:`,
      "  " + PKGS.join(" "),
      `${PKGS.length} upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`,
      "Need to get 612 MB of archives.",
      "After this operation, 48.3 MB of additional disk space will be used.",
    ]
    PKGS.forEach((p, i) => out.push(`Get:${i + 4} http://archive.ubuntu.com/ubuntu noble-updates/main amd64 ${p} amd64 ${(2 + (i % 5)).toString()}.${i % 9}.${(i * 7) % 30}-0ubuntu1 [${(100 + i * 37) % 900} kB]`))
    out.push("Fetched 612 MB in 41s (14.9 MB/s)", "(Reading database ... 214870 files and directories currently installed.)")
    PKGS.forEach((p) => out.push(`Preparing to unpack .../${p}_amd64.deb ...`, `Unpacking ${p} (updated) ...`))
    PKGS.forEach((p) => out.push(`Setting up ${p} (updated) ...`))
    out.push("Processing triggers for man-db (2.12.0-4build2) ...", "Processing triggers for libc-bin (2.39-0ubuntu8) ...", "update-initramfs: Generating /boot/initrd.img-6.8.0-45-generic")
    return out
  }, [])
  const { visible } = useRevealedLines(lines, 230)
  const on = useBlink()
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView() }, [visible.length])
  return (
    <FullscreenPrank secondary="#300a24" exitMessage="UPGRADE CANCELLED - IT WAS A PRANK!" className="cursor-none bg-[#300a24] font-term text-[#eeeeec]">
      <div className="h-full overflow-hidden px-4 py-3 text-[15px] leading-[1.35]">
        {visible.map((l, i) => <div key={i} className="whitespace-pre-wrap break-all">{l}</div>)}
        <span className={on ? "bg-[#eeeeec]" : ""}>&nbsp;</span>
        <div ref={end} />
      </div>
    </FullscreenPrank>
  )
}
