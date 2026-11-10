/**
 * The Stern Clock speaks the real time by chaining tiny clips: "It is" + "two" + "fifty one".
 * The generator (tools/gen_voice.py) renders exactly these pieces, so the words here must match it.
 */
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
const TENS = ["", "", "twenty", "thirty", "forty", "fifty"]

export const numberWord = (n: number): string => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`)
export const hourWord = (h24: number): string => numberWord(h24 % 12 === 0 ? 12 : h24 % 12)
export const minuteWord = (m: number): string => (m === 0 ? "o'clock" : m < 10 ? `oh ${ONES[m]}` : numberWord(m))
export const secondWord = (s: number): string => numberWord(s)

const shift = (d: Date, minutes: number) => new Date(d.getTime() + minutes * 60000)

/** Visual "2:51" label. */
export const timeLabel = (d: Date, ampm = false): string => {
  const h = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12
  return `${h}:${String(d.getMinutes()).padStart(2, "0")}${ampm ? (d.getHours() >= 12 ? " PM" : " AM") : ""}`
}
const hm = (d: Date): string[] => [hourWord(d.getHours()), minuteWord(d.getMinutes())]

export type ClockKind = "is" | "isSec" | "was" | "now" | "distract" | "splash"

/** The clip texts to chain, in order, and the on-screen caption. */
export function clockSequence(kind: ClockKind, d = new Date()): { parts: string[]; caption: string } {
  switch (kind) {
    case "is": return { parts: ["It is", ...hm(d)], caption: `It is ${timeLabel(d)}.` }
    case "splash": return { parts: ["It is", ...hm(d), d.getHours() >= 12 ? "P M" : "A M"], caption: `It is ${timeLabel(d, true)}.` }
    case "isSec": {
      const s = d.getSeconds() || 1
      return { parts: ["It is", ...hm(d), "and", secondWord(s), s === 1 ? "second" : "seconds"], caption: `It is ${timeLabel(d)} and ${s} second${s === 1 ? "" : "s"}.` }
    }
    case "was": {
      const p = shift(d, -1)
      return { parts: ["It was", ...hm(p), "a moment ago. That was the better one."], caption: `It was ${timeLabel(p)} a moment ago. That was the better one.` }
    }
    case "now": {
      const n = shift(d, 1)
      return { parts: ["It is now", ...hm(d), "You are closer to", ...hm(n), "than you were."], caption: `It is now ${timeLabel(d)}. You are closer to ${timeLabel(n)} than you were.` }
    }
    case "distract":
      return { parts: ["Distraction detected.", "It is", ...hm(d)], caption: `Distraction detected. It is ${timeLabel(d)}.` }
  }
}

/** Every clip text the Clock can ever need (used by the generator and for preloading). */
export function allClockPieces(): string[] {
  const out = new Set<string>(["It is", "It was", "It is now", "and", "second", "seconds", "P M", "A M", "a moment ago. That was the better one.", "You are closer to", "than you were.", "Distraction detected."])
  for (let h = 1; h <= 12; h++) out.add(numberWord(h))
  for (let m = 0; m < 60; m++) out.add(minuteWord(m))
  for (let s = 1; s < 60; s++) out.add(secondWord(s))
  return [...out]
}
