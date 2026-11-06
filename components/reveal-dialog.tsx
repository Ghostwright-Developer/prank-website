"use client"

interface RevealDialogProps {
  title: string
  message: string
  buttonLabel?: string
  onClose: () => void
  /** "win95" renders a classic bevelled dialog; "modern" a plain light card. */
  variant?: "win95" | "modern"
}

/**
 * In-page replacement for window.alert(). A native alert() blocks the page,
 * can knock the browser out of fullscreen (which would now count as exiting
 * the prank) and looks nothing like the screen being faked.
 */
export function RevealDialog({
  title,
  message,
  buttonLabel = "OK",
  onClose,
  variant = "modern",
}: RevealDialogProps) {
  if (variant === "win95") {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30" role="alertdialog" aria-modal="true" aria-label={title}>
        <div className="w-80 border-2 border-[#dfdfdf] border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] text-black shadow-[2px_2px_0_#000]">
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d7] px-2 py-1 text-sm font-bold text-white">{title}</div>
          <div className="p-5 text-sm">{message}</div>
          <div className="px-5 pb-4 text-center">
            <button
              autoFocus
              onClick={onClose}
              className="w-24 cursor-pointer border-2 border-[#dfdfdf] border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] py-1 text-sm font-bold hover:bg-[#b0b0b0]"
            >
              {buttonLabel}
            </button>
          </div>
          <p className="border-t border-[#808080] px-5 py-2 text-center text-[11px] text-[#404040]">Press ESC or Q to exit</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center text-gray-800 shadow-2xl">
        <h2 className="mb-2 text-lg font-bold">{title}</h2>
        <p className="mb-5 text-sm text-gray-600">{message}</p>
        <button
          autoFocus
          onClick={onClose}
          className="cursor-pointer rounded bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          {buttonLabel}
        </button>
        <p className="mt-4 text-xs text-gray-400">Press ESC or Q to exit</p>
      </div>
    </div>
  )
}
