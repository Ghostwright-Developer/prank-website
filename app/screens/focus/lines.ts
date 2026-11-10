import type { VoiceName } from "@/lib/fx"

/** Every spoken line in FOCUS. The generator (tools/gen_voice.py) pre-renders each V("voice", "text"). */
export interface L { voice: VoiceName; text: string }
const V = (voice: VoiceName, text: string): L => ({ voice, text })

/* ── The Coach ── */
export const COACH = {
  hover: [V("coach", "Take your time."), V("coach", "No rush. Truly. Take all the time you need."), V("coach", "Whenever you're ready. We'll be here. Waiting. Not judging.")],
  start: [V("coach", "Wow. Wow. Okay. That was brave."), V("coach", "Look at you. Starting things."), V("coach", "And just like that, we're a team that starts things.")],
  clickBlank: [V("coach", "...Why?"), V("coach", "...Why would you do that?"), V("coach", "I'm not mad. I just... why?")],
  typeAfterFog: [V("coach", "Great start. Never mind. Keep going."), V("coach", "Great start. Don't. Never mind. Keep going."), V("coach", "Beautiful typing. That was a sound. Keep going.")],
  idle10: [V("coachw", "Are we still doing this?"), V("coachw", "Is this the part where we wait?"), V("coachw", "We're just sitting? Okay. Sitting is fine.")],
  back: [V("coach", "Welcome back. We didn't talk about you."), V("coach", "Welcome back. We were just talking. Not about you."), V("coach", "Oh good, you're back. We were not worried.")],
  resume: [V("coach", "And we're back. We didn't miss you. We were fine.")],
  deep: V("coach", "Okay! Deep breath in. And out. Great. That was the most productive thing we've done. Let's not peak early."),
  gotThis: V("coach", "You've got this. And if you don't, I've got you. And if I don't, we'll all learn something."),
  working: V("coach", "Look at us. Working."),
  sitting: V("coach", "I'm just going to sit here. Quietly. Supportively. Not looking at the clock."),
  clockThink: V("coach", "Do you ever just... think about the clock? Anyway. Focus."),
  dayOff: V("coach", "I haven't had a real day off since twenty nineteen. Not your problem. Type."),
  narrate: V("coach", "And now you're looking at the document. Nice. And now you're looking at it harder. I can feel that."),
  overInvolved: V("coach", "Okay, I'm going to type the first word for you. You just watch. Wow. I'm so proud of me. Of us."),
  askClock: V("coach", "Clock, buddy, how are we doing on time?"),
  askClock2: V("coach", "Does anyone know what time it is?"),
  everyone: V("coach", "Okay, everyone. Please."),
  rest: V("coach", "I'm just going to rest my eyes. You've got this. I'm resting."),
  giveUp: V("coach", "Yeah. That's fine. That's fine."),
  knee: V("coach", "My knee hasn't been right since the regional finals. Anyway. Focus."),
  daughter: V("coach", "My daughter says I'm a lot. Anyway. Type."),
  almost: V("coach", "Okay, we're close. Let's finish strong. Or finish."),
  greatWork: V("coach", "Great work. Really. Same time tomorrow? Please say yes."),
  darkMode: V("coachw", "Oh no."),
  niceTry: V("coach", "Nice try."),
  notif: V("coach", "Notifications are now respectfully on. We appreciate your respect."),
}

/* ── The Cheerleader (every line gets a horn that is far too big) ── */
export const CHEER = {
  start: [V("cheer", "YOU CLICKED THE BUTTON! LOOK AT YOU!")],
  mouse: [V("cheer", "YOU MOVED THE MOUSE! LOOK AT YOU!"), V("cheer", "YOU MOVED IT AGAIN! THAT'S TWICE! THAT'S A TREND!")],
  blink: V("cheer", "YOU BLINKED! BOTH EYES! AT THE SAME TIME!"),
  here: V("cheer", "YOU'RE STILL HERE! THAT'S HUGE! SOME PEOPLE LEAVE!"),
  opened: V("cheer", "YOU OPENED THE DOCUMENT!"),
  opened2: V("cheer", "It's blank. Doesn't matter. THE ENERGY."),
  missed: V("cheer", "Wait, did something happen? Sorry, I was celebrating."),
  idle30: [V("cheer", "YOU'RE DOING GREAT BY NOT MOVING!"), V("cheer", "YOU'RE STILL NOT MOVING! INCREDIBLE FOCUS!"), V("cheer", "THIS IS THE BEST YOU'VE EVER NOT MOVED!")],
  small: [V("cheer", "YOU TOOK A BREATH! A DEEP ONE! WE HEARD IT!"), V("cheer", "YOU'RE SITTING UP STRAIGHT! POSTURE!"), V("cheer", "SOMEONE JUST LOOKED AT THE TASK! WAS IT YOU?! IT WAS YOU!"), V("cheer", "THE SCREEN IS STILL ON! THAT'S A TEAM EFFORT!")],
  chaos: V("cheer", "YOU'RE STILL HERE! WE'RE ALL STILL HERE!"),
  done: V("cheer", "IT'S OVER! YOU DID IT! WHATEVER IT WAS!"),
}

/* ── The Stern Clock (live time is composed in code from tiny clips) ── */
export const CLOCK = {
  oneMinute: V("clock", "It has been one minute. You have been present for all of it."),
  twoMinutes: V("clock", "It has been two minutes. You have been present for all of it."),
  threeMinutes: V("clock", "It has been three minutes. You have been present for all of it."),
  done: V("clock", "Session complete. Focus achieved: zero minutes."),
}

/* ── Tyler, the intern ── */
export const TYLER = {
  timer2: V("tyler", "Hi! I added a second timer. It's for the first timer."),
  clicky: V("tyler", "Don't click that. Actually, do. No. I'll tell you."),
  startStop: V("tyler", "I made it so the Start button also does the stopping. It's called efficiency."),
  deleted: V("tyler", "I might have deleted something. Not yours. Mostly. Someone's."),
  mistakes: V("tyler", "My mentor said to own my mistakes. I own seven. Would you like one?"),
  whisper: V("tylerw", "I've been here three days. I don't know what we make."),
  bug: V("tyler", "That's not a bug. It's a feature. It's also a bug. They're the same thing."),
  extra: [V("tyler", "Quick update: the update is updating."), V("tyler", "I fixed the timer. Now it's a different timer."), V("tyler", "Is production the real one? Don't answer that."), V("tyler", "I'm just going to push this. For luck.")],
}

/* ── Gary from Accounting (each one arrives with a polite sports buzzer) ── */
export const GARY = {
  thought: V("gary", "Hey. Quick thought. Not a question. Not a suggestion. Just a thought."),
  goodTime: V("gary", "Is this a good time? Doesn't matter, I'm already here."),
  brief: V("gary", "I'll be brief."),
  ramble: V("gary", "So I was looking at the numbers. And then I wasn't. And then I was again. And it occurred to me, and this is just me spitballing, that numbers have feelings too. Anyway. That's my two cents. I'll invoice you."),
  lastEmail: V("gary", "Per my last email. I'm sure you got it. You didn't get it. I'll resend it. Same email."),
  loop: V("gary", "Looping in people who don't need to be looped."),
  followUp: V("gary", "Quick follow-up to my quick thought. Same thought. Louder."),
  circling: V("gary", "Circling back. I was never gone."),
  picked: V("gary", "Oh, you picked me. Great choice. Wonderful choice. I'll be right there."),
}

/* ── Brenda, the progress bar ── */
export const BRENDA = {
  mid: V("brenda", "I'm at fifty percent. That's a normal number. I'm fine."),
  ninetyNine: V("brenda", "I'm at ninety-nine percent. I've never been this far. I don't know what's on the other side."),
  going: V("brenda", "Don't look at me. I'm going through something."),
  cant: V("brenda", "It's not that I can't hit a hundred. It's that I'd have to be a hundred. Does that make sense?"),
  stopWatching: V("brenda", "Please stop watching. It makes it worse."),
  point9: V("brenda", "I'm at ninety-nine point nine. This is my whole personality now."),
  notTime: V("brenda", "It's not a time. It's a number. It's ninety-nine."),
  notTime2: V("brenda", "Time is a construct. I'm a percentage."),
  stay: V("brenda", "You can't leave me at ninety-nine."),
  stay2: V("brenda", "I'm at ninety-nine. Please."),
  hundred: V("brenda", "A hundred? I'm a hundred. Oh no. What do I do now?"),
}

/* ── The Wi-Fi ── */
export const WIFI = {
  lost: V("wifi", "Connection lost. It's not you."),
  partly: V("wifi", "...Okay, it's partly you."),
  break: V("wifi", "I've been thinking about us. Maybe we should take a break. I'm going to take one anyway."),
  saved: [V("wifi", "We saved your seat."), V("wifi", "We held your spot."), V("wifi", "Your session is still here.")],
  someone: [V("wifi", "Someone else is in it."), V("wifi", "It was a short hold."), V("wifi", "So is the person who's using it.")],
  back: V("wifi", "Reconnected. Let's not make it weird."),
}

export const ALL_LINES: L[] = (() => {
  const out: L[] = []
  const walk = (o: unknown) => {
    if (Array.isArray(o)) o.forEach(walk)
    else if (o && typeof o === "object") {
      const r = o as Record<string, unknown>
      if (typeof r.voice === "string" && typeof r.text === "string") out.push(r as unknown as L)
      else Object.values(r).forEach(walk)
    }
  }
  walk([COACH, CHEER, CLOCK, TYLER, GARY, BRENDA, WIFI])
  return out
})()
