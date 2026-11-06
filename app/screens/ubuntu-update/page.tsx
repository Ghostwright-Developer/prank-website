'use client'
import { FullscreenPrank } from '@/components/fullscreen-prank'

export default function UbuntuUpdateScreen() {
  return (
    <FullscreenPrank>
      <div className="w-full h-full bg-[#300a24] flex flex-col items-center justify-center font-mono text-white p-8">
        <div className="text-orange-500 text-2xl mb-6">Ubuntu</div>
        <div className="max-w-2xl w-full space-y-1 text-sm text-green-400">
          <div>Reading package lists...</div>
          <div>Building dependency tree...</div>
          <div>Calculating upgrade...</div>
          <div className="text-white">The following packages will be upgraded:</div>
          <div className="text-cyan-400 ml-4">linux-image-5.15.0-91-generic linux-modules-5.15.0-91-generic</div>
          <div className="mt-4">Unpacking linux-image-5.15.0-91-generic (5.15.0-91.101)</div>
          <div className="animate-pulse">Setting up linux-image-5.15.0-91-generic...</div>
          <div className="mt-4 text-yellow-400">Processing triggers for linux-image-5.15.0-91-generic...</div>
          <div className="text-red-400 mt-4 animate-pulse">E: dpkg was interrupted, you must manually run 'sudo dpkg --configure -a'</div>
        </div>
      </div>
    </FullscreenPrank>
  )
}
