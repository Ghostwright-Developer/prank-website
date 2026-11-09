/**
 * Long-form guide copy for every screen (used by /guide/[slug]) and every
 * category (used by /category/[slug]). Keyed by the slugs in lib/screens.ts.
 * Each screen has its own text so no two guide pages are near-duplicates.
 */

import type { CategorySlug } from "@/lib/screens"

export interface Guide {
  /** What the victim sees. */
  looks: string
  /** What it imitates and why it works. */
  story: string
  /** Who to send it to. */
  bestFor: string
  /** One staging tip. */
  tip: string
}

const g = (looks: string, story: string, bestFor: string, tip: string): Guide => ({ looks, story, bestFor, tip })

export const GUIDES: Record<string, Guide> = {
  // ---------- Windows ----------
  win31: g(
    "A stack of grey Program Manager-style dialog boxes with chunky 3D borders, each reporting an error and spawning another when you dismiss it.",
    "Windows 3.1 shipped in 1992 and was famous for General Protection Faults and Application Errors. The pile-up of tiny error boxes is what many people remember, which makes it funny rather than frightening.",
    "Anyone who used a computer in the 90s, and tech-savvy friends who will appreciate how accurate the old interface looks.",
    "Send it to someone with a modern PC. The jump from a sleek desktop to a 1992 error spiral is the whole joke.",
  ),
  "win98-bsod": g(
    "The classic Windows 95/98 blue screen: white-on-blue monospace text describing a fatal exception, with the prompt to press any key to continue.",
    "The 9x-era blue screen is the original 'blue screen of death'. Its wording about a fatal exception and a driver or memory address is what most people picture when they hear BSOD.",
    "Gamers, office workers and anyone old enough to have lost an unsaved document to one.",
    "Pair it with the start-delay option so it appears while the person is in the middle of typing.",
  ),
  "win95-update": g(
    "A Windows 95-style dialog with a progress bar that keeps searching for an update that never arrives, in the grey system font of the era.",
    "Windows 95 had no real automatic updates, which is exactly why a 'searching for updates' box feels both familiar and slightly wrong, a gentle nostalgic prank.",
    "Friends who enjoy retro computing and people you want to confuse rather than scare.",
    "Run it on a second monitor setup so only the main screen shows the dialog and the rest go black.",
  ),
  "winme-update": g(
    "A Windows Millennium Edition update screen with the period-correct graphics and a restart that never quite finishes.",
    "Windows ME (2000) has a reputation as one of the least stable Windows releases, so a never-ending ME update lands as a joke people already know.",
    "Anyone who remembers Windows ME, and teammates who like tech history jokes.",
    "Mention nothing and let them notice it. The older the OS, the funnier the double-take.",
  ),
  "win2000-update": g(
    "A Windows 2000 Service Pack installer reading 'Installing Service Pack 4' with a time remaining estimate that stays at 47 minutes.",
    "Windows 2000 was a business-focused release and service packs were long, serious installs. A frozen estimate is a convincing and universally relatable detail.",
    "IT colleagues and office workers who have watched a real service pack crawl.",
    "The long countdown makes people hover nervously near the power button, so keep your camera ready.",
  ),
  winxp: g(
    "The Windows XP 'This copy of Windows is not genuine' warning, with the desktop dimmed and the persistent notification that XP-era users knew too well.",
    "Windows Genuine Advantage notifications were a real XP annoyance. The black desktop and nag balloon are instantly recognizable to anyone who ran an unactivated copy.",
    "Friends who joke about pirated software, or anyone who enjoys the Bliss wallpaper era.",
    "Combine it with a straight face and ask whether they 'paid for Windows'.",
  ),
  "vista-uac": g(
    "A dimmed desktop with a Vista User Account Control prompt asking for permission over and over, however many times you click Allow.",
    "Vista's UAC was widely mocked for interrupting people constantly. A prompt that will not go away is a joke most Vista users have lived through.",
    "Anyone who used Vista, and people who like gentle, low-stress pranks.",
    "It is more annoying than scary, so it suits a friend who laughs easily.",
  ),
  "win7-update": g(
    "The Windows 7 shutdown-style screen reading 'Configuring Windows Updates, do not turn off your computer', with the Aero blue background.",
    "Windows 7 popularised this wording and many people spent anxious minutes watching it. Because it is something you are told never to interrupt, victims rarely dare to.",
    "Anyone who has waited through a real Windows 7 update at the worst possible moment.",
    "Because people fear interrupting it, this one can last a long time. Be ready to reveal yourself.",
  ),
  "win8-update": g(
    "A flat Metro-style screen with the signature ring of spinning dots and plain white text about getting things ready.",
    "Windows 8 introduced the spinning dots loading animation. It looks calm and clean, which makes a hang on it feel worryingly official.",
    "Friends with a fairly new laptop who will not be sure how long updates normally take.",
    "The clean design means it works well on tablets and touch devices too.",
  ),
  "win10-update": g(
    "The blue Windows 10 update screen with the spinning dots, a percentage and the 'Don't turn off your PC. This will take a while' message.",
    "Windows 10 updates are still part of everyday life, so this is the screen that most people will believe without question.",
    "Almost anyone with a Windows PC, from roommates to coworkers.",
    "Set a delay of a minute or two so you are out of the room when it appears.",
  ),
  "win11-update": g(
    "A Windows 11 update screen with the new centred loading ring and a progress indicator that sits at 99%.",
    "Windows 11 refreshed the update look with a centred spinner and cleaner type. Sitting at 99% is a joke on how updates seem to hang near the end.",
    "Anyone on a recent Windows laptop or desktop.",
    "Send it just before a meeting or a deadline for maximum panic.",
  ),
  "windows-update": g(
    "A Windows update screen that climbs quickly to 99% and then stays exactly there, indefinitely.",
    "Getting stuck near the end of an update is a shared experience. This screen leans on that exact frustration without any scary wording.",
    "Co-workers and family members who are not sure if a long update is normal.",
    "Good as a first prank because it is harmless and easy to explain afterwards.",
  ),
  "win10-realistic": g(
    "The most detailed Windows 10 update, with accurate colours, spacing and a percentage that stalls at 92%.",
    "Built to match the real screen as closely as possible, including the spinning dots and wording, so it holds up when someone looks at it carefully.",
    "People who think they can spot fakes. Realism is the point here.",
    "Use fullscreen and hide the cursor by leaving the mouse untouched. The details do the rest.",
  ),

  // ---------- Other OS ----------
  "macos-update": g(
    "A black screen with the white Apple logo and a thin progress bar underneath, with a time estimate that never moves.",
    "macOS installs show exactly this minimal screen, so there are very few details to get wrong and very little to question.",
    "Mac users, designers and anyone who thinks Macs never have problems.",
    "Because a Mac screen is so plain, it works well even on a Windows PC for a lock-screen-style surprise.",
  ),
  "ios-update": g(
    "An iPhone or iPad style software update screen with the Apple logo and a progress bar, in portrait or landscape.",
    "iOS updates can take a long time and look like nothing is happening, so a stuck bar seems entirely normal.",
    "iPhone and iPad owners, especially when they have just plugged the device in to charge.",
    "Open it on a tablet and place it back where they left it.",
  ),
  "android-update": g(
    "An Android system update screen with the green robot and a progress bar that fills slowly, reading 'Installing system update'.",
    "Android's installing-update screen with the robot is easy to recognise, and a stalled progress bar is a classic cause of worry.",
    "Android phone and tablet owners.",
    "Works best in landscape on a tablet or a phone set on a desk.",
  ),
  "ubuntu-update": g(
    "A Linux terminal showing a scrolling apt-get upgrade with package names, download lines and a prompt that keeps working.",
    "Developers and sysadmins see exactly this when running updates, so the stream of real-looking package output feels authentic.",
    "Programmers, sysadmins and Linux fans who will read every line.",
    "Because they read terminal output carefully, the fine detail rewards the prank.",
  ),
  "chromeos-update": g(
    "A Chromebook update screen with the Google colours, the 'Installing updates' message and a progress ring that never finishes.",
    "Chromebooks update quietly in the background, so seeing a full-screen update is unusual and tends to cause a little alarm.",
    "Students and anyone who uses a school or home Chromebook.",
    "A good fit for classrooms where everyone uses the same kind of device.",
  ),
  "kernel-panic": g(
    "A macOS kernel panic: the screen dims, a message about restarting the computer appears in several languages, and white text details the fault.",
    "Kernel panics are Apple's equivalent of the blue screen. The multi-language restart message is distinctive and instantly recognisable to Mac users.",
    "Mac users who know what a kernel panic is and the ones who learn it today.",
    "The multi-language text makes it look genuine, so there is no need to add anything else.",
  ),

  // ---------- OS lock / home screens ----------
  "win11-lock": g(
    "The Windows 11 lock screen with the Bloom wallpaper, a large clock and date, and a PIN sign-in that rejects every attempt.",
    "A lock screen is the first thing anyone sees, so showing the wrong operating system's version of it is an instant double-take.",
    "A die-hard Mac or Linux user. Showing them a Windows lock screen is the intended joke.",
    "Open it fullscreen on their computer while they are away and watch their face when they return.",
  ),
  "win10-lock": g(
    "The Windows 10 lock screen with a hero wallpaper, a clock at the bottom-left and a password prompt that never works.",
    "Windows 10 is still the most common desktop OS in many offices, so a locked screen feels completely plausible.",
    "Co-workers who stepped away from their desks and left them unlocked.",
    "Try a few passwords yourself first and let them think someone else tried.",
  ),
  "win7-login": g(
    "The Windows 7 Welcome screen with the blue Aero background, an avatar and a password box that always says the password is incorrect.",
    "The Windows 7 sign-in is nostalgic for many. Rejecting the password makes it a tiny lockout scare.",
    "Friends who remember Windows 7 fondly.",
    "Keep the tone light. The Aero look reminds people of simpler times.",
  ),
  "winxp-welcome": g(
    "The classic Windows XP Welcome screen with the user names on the left and the instruction to click your name, then a password prompt.",
    "The XP welcome screen with its blue and orange layout is among the most recognisable login screens ever made.",
    "Millennials and anyone nostalgic for the Bliss-hill era.",
    "It is an excellent gag for a modern computer where nobody expects to see this screen.",
  ),
  "macos-lock": g(
    "A Sonoma-style macOS lock screen with the large clock, a Touch ID prompt and a password field that rejects the attempt.",
    "macOS lock screens are clean and familiar. Prompting for Touch ID adds a layer of authenticity.",
    "A Windows loyalist who is not sure what to type in. Great for reverse-prank fun.",
    "Hide the taskbar by staying fullscreen to remove the giveaways.",
  ),
  "ios-lock": g(
    "An iPhone lock screen with the time, the swipe-up gesture and a passcode pad that ends with 'iPhone Unavailable, try again in 1 minute'.",
    "Everyone dreads the iPhone Unavailable message. Seeing it appear on a phone they just put down creates a real moment of panic.",
    "iPhone owners who leave their phones on the table.",
    "Put it on their tablet or laptop browser and enjoy the confusion.",
  ),
  "android-lock": g(
    "An Android lock screen with a swipe-up gesture, a PIN pad and a message about too many wrong attempts.",
    "Failed-attempt messages on Android feel serious, particularly the timer telling you to try again later.",
    "Android users who leave their phone unattended.",
    "Works well on a phone held in portrait.",
  ),
  "ubuntu-login": g(
    "A GNOME login screen with the user avatar and a password field that returns an authentication failure each time.",
    "Linux users take their login seriously. Having authentication fail repeatedly is a very specific kind of fear.",
    "Linux enthusiasts and developers who run Ubuntu.",
    "Show it to someone who prides themselves on never forgetting a password.",
  ),
  "win11-desktop": g(
    "A believable Windows 11 desktop with the centred taskbar, the Start menu that opens, and working-looking icons.",
    "A desktop that looks like their own but is not theirs is a subtle way to mislead, and it works as the starting point for more pranks.",
    "Mac or Linux users who would not expect to see Windows.",
    "Use it as a base: then follow up with a second prank link from the same collection.",
  ),
  "macos-desktop": g(
    "A Sonoma-style macOS desktop with the menu bar, the dock and apps that crash when opened.",
    "The dock and menu bar are very recognisable. Apps that crash on opening is a cheerful way to spoil a quiet afternoon.",
    "Windows fans who like to joke about Macs.",
    "Opening apps in the dock is the interactive part, so encourage them to try.",
  ),

  // ---------- Ransomware ----------
  cryptolocker: g(
    "A pop-up window announcing that your files have been encrypted, with a countdown timer and instructions for paying a ransom.",
    "CryptoLocker was one of the first widely known ransomware families, and the ransom note with a countdown became the template for countless others.",
    "People who have heard of ransomware, and coworkers who work in IT.",
    "Make sure you reveal the prank quickly. Ransom notes can cause genuine alarm.",
  ),
  wannacry: g(
    "The red-and-white WannaCry window with the padlock logo, the payment countdown and the list of languages.",
    "WannaCry hit organisations worldwide in 2017 and made ransomware headline news. The window is one of the most recognised ransomware screens.",
    "Colleagues who followed the 2017 news.",
    "This is an alarming screen, so keep it for people who enjoy a scare.",
  ),
  petya: g(
    "A black-and-red screen with a white skull drawn in text characters and a message about disk encryption.",
    "Petya's skull screen was displayed before the operating system loaded, so it feels like the computer itself has failed.",
    "Friends who love horror aesthetics and the people who know their malware history.",
    "The dark look is dramatic in a quiet, dim room.",
  ),
  locky: g(
    "A message saying all your files are locked, with a decryption instruction page and a payment prompt.",
    "Locky was a widespread ransomware strain spread through email attachments. The note's wording follows the familiar ransom format.",
    "People who open too many email attachments, as a gentle reminder.",
    "Use it as a teaching moment about not opening unknown attachments.",
  ),
  "bad-rabbit": g(
    "A red-on-black screen in the style of Bad Rabbit with the 'Oops! Your files are no longer accessible' text and a ransom prompt.",
    "Bad Rabbit appeared in 2017 and displayed a stark red-on-black note. The stark design translates well to a prank screen.",
    "Colleagues in IT and security who will recognise it.",
    "The plain layout is quick to take in, so the shock lands immediately.",
  ),
  "fbi-warning": g(
    "A police-style lock screen declaring that your computer has been locked because of illegal activity, with a fine to pay.",
    "Police-themed lockers were common scams in the early 2010s. The official-looking seal and accusation text are the hallmarks of the scam.",
    "Friends who will find it ridiculous. Avoid anyone who might panic.",
    "Remember that this scam targets real victims. Keep it to people who will laugh.",
  ),

  // ---------- Hacker ----------
  "malware-infection": g(
    "A full infection sequence: a webpage prompts a download, then the system is taken over with alerts, scans and terminal output.",
    "This screen tells a complete story, from a believable webpage to a full takeover, so it feels like a real incident unfolding.",
    "Co-workers and friends who enjoy an elaborate, drawn-out prank.",
    "Give it a minute. The slow build is what makes it convincing.",
  ),
  matrix: g(
    "Green characters raining down a black screen in the style of the movie, with a terminal that types out commands.",
    "The falling green code is the best-known hacker image from film. It is more cool than frightening.",
    "Movie fans and anyone who likes a harmless 'you got hacked' joke.",
    "A great screen to leave running on a spare monitor as a decoration.",
  ),
  webcam: g(
    "A message saying your webcam has been accessed, with a recording indicator and a 'someone is watching you' alert.",
    "People are already wary of webcam access, so a recording light and a warning lands with a very personal chill.",
    "Friends who joke about covering their camera.",
    "This is one of the most popular screens, so be ready to reveal quickly.",
  ),
  system32: g(
    "A command prompt listing files from the System32 folder being deleted one after another, with a counter.",
    "The old joke says that deleting System32 breaks Windows. The prank plays on that, with a stream of file names scrolling past.",
    "Anyone who has heard the System32 joke.",
    "Most people will reach for the power button, so be near the device.",
  ),
  "data-theft": g(
    "A terminal showing files, passwords and documents being uploaded to a remote server, with a progress counter.",
    "The sense that your private files are leaving your computer is unsettling, and the upload counter makes it feel live.",
    "Coworkers who are aware of cybersecurity training.",
    "Use it to start a conversation about password hygiene afterwards.",
  ),
  "file-download-hack": g(
    "A browser download that turns out to be a trojan, followed by an automatic launch and an infection progress screen.",
    "A file that downloads and runs on its own is a common fear, and the sequence mirrors how malware gets in.",
    "People who click through download prompts without reading.",
    "Pairs well with a note about being careful with downloads.",
  ),
  keylogger: g(
    "A monitoring panel showing every keystroke being recorded as you type, including a live log of captured text.",
    "The idea that your typing is being logged is deeply uncomfortable, and seeing letters appear in a log is a strong visual.",
    "Anyone who types passwords in front of you.",
    "Type something yourself on the keyboard to show it is 'working'.",
  ),
  "remote-access": g(
    "A remote-access trojan panel showing an attacker taking control, with a moving cursor and a connection status.",
    "Remote control tools are real and often used legitimately, which is why the idea of an uninvited one is so unsettling.",
    "Friends who like to joke about hackers.",
    "Move your own mouse in sync to make it feel real.",
  ),
  "crypto-miner": g(
    "A dashboard showing your processor being used to mine cryptocurrency, with rising hash rates, temperatures and earnings for someone else.",
    "Cryptojacking is a real issue, and the idea that your fans are spinning for a stranger's profit is oddly funny.",
    "Gamers and PC builders who care about their hardware.",
    "A good choice for people who are proud of their gaming rig.",
  ),

  // ---------- Phishing / scams ----------
  "tech-support-scam": g(
    "A fake Microsoft support pop-up warning that your computer is infected and to call a number immediately.",
    "Tech support scams are common and aimed at everyday users. Showing it in a safe context is a way to help people recognise one.",
    "Family members, especially to teach them how these scams look.",
    "Reveal the prank and explain how to spot the real thing. That is the real value.",
  ),
  "fake-antivirus": g(
    "An antivirus scan window reporting dozens of viruses found, with red warnings and a button to 'fix all'.",
    "Scareware that exaggerates threats has been around for decades. The fake scan, with a rising count of infections, mirrors its pattern.",
    "People who install lots of free software.",
    "The rising virus count is the fun part, so let it climb.",
  ),
  "browser-hijack": g(
    "A browser that keeps opening pop-ups and redirects, with alert dialogs and pages that will not close.",
    "Browser hijackers are a real nuisance and the endless pop-ups are very familiar to anyone who has dealt with one.",
    "Friends who have fought a browser hijacker before.",
    "Use it on a quiet afternoon, when someone is just browsing.",
  ),
  "fake-flash-update": g(
    "A website claiming your Flash Player is out of date and prompting an urgent update download.",
    "Fake Flash updates were a very common way to deliver malware. The prompt looks like a routine update that people used to click.",
    "People who clicked these prompts years ago and will enjoy the nostalgia.",
    "Flash is long retired, so this is also a nice history lesson.",
  ),

  // ---------- Chaos ----------
  format: g(
    "A command-line format of the C: drive, with the percentage climbing and a warning that all data will be lost.",
    "A format is the most feared command for anyone who has lost data, and a running count towards 100% is dramatic.",
    "Friends who know what formatting a drive means.",
    "Stopping it near 99% makes the reveal even funnier.",
  ),
  bios: g(
    "A BIOS screen reporting a critical firmware corruption with beeps and a recovery prompt.",
    "BIOS or firmware failures happen before the operating system loads, so they seem like deep hardware faults.",
    "Hardware fans and people who know what a BIOS is.",
    "The beeping helps. Keep sound on for the full effect.",
  ),

  // ---------- Screen damage ----------
  "cracked-screen": g(
    "Spiderweb glass cracks spreading over the display from the point of an impact, with coloured LCD ink bleeding beneath the break.",
    "A cracked display is a thing most people dread. The slowly spreading cracks and ink bleed follow how a damaged panel looks.",
    "Anyone who has already dropped a phone or laptop.",
    "The crack arrives with a glass sound, so turn the volume up.",
  ),
  "broken-lcd": g(
    "A failed panel showing stuck coloured columns, dead black stripes and a flickering corrupted band across the desktop.",
    "Failing LCD panels often show vertical lines and a distorted block of picture, which this screen reproduces.",
    "People with an expensive laptop or monitor.",
    "Works especially well on a big monitor where the lines run the full height.",
  ),
  "dead-pixels": g(
    "A handful of tiny stuck and dead pixels scattered across the screen and a small cluster that you have to look for.",
    "Dead pixels are tiny and easy to miss, so this prank rewards people who stare at their screen closely. It is subtle by design.",
    "Photographers, designers and anyone fussy about their display.",
    "Leave it on a white page and let them find the dots themselves.",
  ),

  // ---------- Comedy ----------
  "cats-took-over": g(
    "A screen taken over by cats, with a slow, endless news ticker at the bottom reporting increasingly ridiculous headlines.",
    "A comedy screen built for laughing, not scaring. The ticker keeps changing, so it is worth leaving on for a while.",
    "Cat lovers and anyone who needs a laugh.",
    "Leave it on a shared screen in the office and see who reads the ticker.",
  ),
  "windows-xp-tour": g(
    "A very annoying animated paperclip assistant that offers unhelpful advice and refuses to go away.",
    "The old Office assistant was beloved and hated in equal measure. This tribute is a gentle prank for anyone who remembers.",
    "Office workers who remember the original helper.",
    "It works best on someone in the middle of writing a document.",
  ),
  "minecraft-update": g(
    "A Minecraft-style update screen with blocky text and a loading bar that goes badly wrong.",
    "Games ask for updates at the worst times, and a loading screen that goes wrong in a blocky world is especially funny.",
    "Minecraft players of any age.",
    "A good choice for a younger sibling who is about to start a game.",
  ),
  "printer-error": g(
    "A printer error dialog that cycles through ever more absurd faults, from paper jams to the printer refusing to cooperate.",
    "Everyone has fought a printer. A dialog that shows the printer winning is relatable and silly.",
    "Anyone in an office with a shared printer.",
    "Time it for just before an important print job.",
  ),
}

export interface CategoryGuide {
  /** Extra long-form paragraphs shown on the category page. */
  about: string[]
  /** Practical staging tips. */
  tips: string[]
  faq: { question: string; answer: string }[]
}

export const CATEGORY_GUIDES: Record<CategorySlug, CategoryGuide> = {
  windows: {
    about: [
      "Windows has looked many different ways since 1992, and each era has its own familiar failure: the stack of Program Manager error boxes in Windows 3.1, the blue screen of the Windows 9x years, the XP 'not genuine' notice, Vista's constant permission prompts, and the 'Working on updates' screens that come with modern Windows.",
      "The screens in this collection recreate those moments as full-screen web pages. They run entirely in your browser, so nothing is installed and nothing on the computer changes. Close the tab or press Esc and everything is back to normal.",
      "If you want the most believable prank, pick the version of Windows that the victim actually uses: a Windows 11 update for a new laptop, a Windows 10 update for most office machines. If you want the funniest, pick a very old one and let them work out why their computer has travelled back thirty years.",
    ],
    tips: [
      "Match the screen to the computer. A Windows 11 update on a Windows 11 PC is the most convincing.",
      "Use the start delay in Set up so the screen appears after you have left the room.",
      "Keep the audio on if the screen has sound. A few beeps add a lot of realism.",
      "Reveal the prank quickly. A long wait only turns a laugh into worry.",
    ],
    faq: [
      { question: "Will a fake Windows update harm the computer?", answer: "No. The screens are ordinary web pages that run inside the browser. They do not install anything or touch files, and closing the page ends the prank." },
      { question: "How do I exit a fake Windows update screen?", answer: "Press Esc or Q, or close the tab. Esc also takes you back to the PrankSims home page." },
      { question: "Which Windows prank is the most believable?", answer: "The Windows 10 and Windows 11 update screens, because they look like what people see every month. The 'Windows 10 Realistic' one adds extra detail for people who look closely." },
      { question: "Do these work on a Mac or Linux?", answer: "Yes. They are web pages, so they run in any modern browser, which makes them a fun surprise on a computer that does not use Windows." },
    ],
  },
  "other-os": {
    about: [
      "Not everyone uses Windows. This collection covers the updates and crashes of the other major platforms: the Apple logo and progress bar of macOS, iPhone and iPad update screens, Android's green robot, Ubuntu's apt-get output, ChromeOS and the macOS kernel panic.",
      "Because these systems have simple, minimal update screens, they are easy to fake convincingly. A black screen with a white logo and a thin bar is almost exactly what a real Apple update looks like.",
      "Open a screen on a tablet or laptop and place it back where they left it. In landscape, the phone and tablet screens look right on larger displays too.",
    ],
    tips: [
      "Pick the screen that matches their device brand.",
      "Hide the browser interface by going fullscreen. The screens request fullscreen as soon as the page opens.",
      "For phones, hold the device in the orientation the screen is designed for.",
      "Ubuntu and kernel panic screens are best for tech-savvy friends who read the text.",
    ],
    faq: [
      { question: "Can I prank an iPhone or Android with these?", answer: "You can open the page on a phone or tablet. Fullscreen works best on desktop browsers, but the pages still look convincing on mobile." },
      { question: "What is a kernel panic?", answer: "It is how macOS reports a fatal system error, usually followed by a restart. The screen here imitates that message." },
      { question: "Are these safe?", answer: "Yes. They are only web pages and do not change the device in any way." },
    ],
  },
  "os-screens": {
    about: [
      "These screens imitate the lock screens, login screens and desktops of different operating systems. The classic use is cross-platform: show a lifelong Mac user the Windows 11 lock screen, or give a Windows loyalist a macOS login that will not accept their password.",
      "Because the first thing anyone sees when they sit down at a computer is a lock or login screen, these are very effective at creating a moment of confusion. They also include working-looking desktops with Start menus, docks and apps.",
      "Every screen is built for the browser, so it works on any computer and exits instantly with Esc.",
    ],
    tips: [
      "Show people a lock screen from an operating system they do not use.",
      "Set a delay so you can step away before the screen appears.",
      "Try the iPhone and Android locks on a tablet or laptop for a bigger surprise.",
      "Let them try a few passwords before you reveal what is going on.",
    ],
    faq: [
      { question: "Does the password work?", answer: "No. The sign-in fields always reject the attempt, which is part of the joke. Nothing you type is saved or sent anywhere." },
      { question: "Can this lock someone out of their computer?", answer: "No. It is a web page. Press Esc or close the tab and the real computer is right where they left it." },
      { question: "Does it work on any device?", answer: "Yes, in any modern browser. Desktop browsers give the best fullscreen effect." },
    ],
  },
  ransomware: {
    about: [
      "Ransomware notes became part of popular culture after outbreaks like WannaCry and Petya. This collection recreates the look of several well-known examples as harmless web pages, complete with countdown timers and payment instructions that go nowhere.",
      "These are the most alarming screens on the site, so they suit friends who enjoy a scare and colleagues who work in IT or security. They also make a useful teaching moment: afterwards, you can talk about backups and why you should not open unknown attachments.",
      "Nothing is encrypted and no files are touched. Pressing Esc or Q closes the screen and returns to the site.",
    ],
    tips: [
      "Do not use these on someone who has recently had a real security incident.",
      "Reveal the prank within a minute or two.",
      "Combine the scare with a short chat about backups.",
      "Skip the FBI warning for people who might take it seriously.",
    ],
    faq: [
      { question: "Is this real ransomware?", answer: "No. It is an image-and-text page that runs in the browser. It has no ability to encrypt or access files." },
      { question: "Can I accept payment through it?", answer: "There is no payment system. The wallet address and buttons are decoration." },
      { question: "How do I stop it?", answer: "Press Esc or Q, or simply close the tab or browser." },
    ],
  },
  hacker: {
    about: [
      "From the green code rain of the Matrix to a webcam-access alert and a full malware-infection story, these screens turn an ordinary computer into something out of a hacking film. They are the most dramatic prank screens and the most popular.",
      "Each screen uses a realistic mix of terminal output, progress counters and alerts. The slow build matters: the longer someone watches, the more convinced they become that something is happening.",
      "Everything runs inside the browser. No files are read, no webcam is turned on and nothing is uploaded.",
    ],
    tips: [
      "Use the Webcam Activated screen only on people who enjoy a scare.",
      "Let longer sequences like Malware Infection play out. The story is the point.",
      "Open the Matrix terminal on a spare monitor as a decoration.",
      "Afterwards, talk about real security habits such as strong passwords.",
    ],
    faq: [
      { question: "Does the webcam screen turn on my camera?", answer: "No. It only displays a warning. It does not ask for or use the camera." },
      { question: "Is anything uploaded?", answer: "No. Everything shown, from file names to the upload counter, is made up by the page." },
      { question: "What is the best hacker prank?", answer: "Webcam Activated is the most used, and Malware Infection is the most elaborate." },
    ],
  },
  phishing: {
    about: [
      "These screens imitate scams that real people encounter online: fake tech support pop-ups, scareware antivirus scans, endless browser pop-ups and fake Flash updates.",
      "They are a funny prank, and also a good way to show friends and family what the real thing looks like. Someone who has seen a tech support scam in a safe setting is better prepared to spot one.",
      "None of them ask for personal information or contact anyone. Close the page with Esc, Q or by closing the tab.",
    ],
    tips: [
      "Use these with family members who are not confident online and explain the scam afterwards.",
      "Never enter real details into any prank page.",
      "Combine with a short explanation of how to spot a real scam.",
      "Browser Hijack works best when someone is already browsing.",
    ],
    faq: [
      { question: "Do these collect my information?", answer: "No. Nothing typed on a prank screen is saved or sent anywhere." },
      { question: "Is the phone number real?", answer: "No. The numbers on these screens are not real contact numbers." },
      { question: "Why do people fall for these scams?", answer: "Because they use urgency and official branding. Seeing one in a harmless setting helps people recognise the pattern." },
    ],
  },
  chaos: {
    about: [
      "This collection is for the worst computer failures: a hard drive format running towards 100% and a BIOS firmware corruption with warning beeps.",
      "These are the screens that make people reach for the power cable. They look serious and they happen before the operating system, so they feel like deep hardware problems.",
      "As always, nothing real is happening. Press Esc or Q and the prank is over.",
    ],
    tips: [
      "Use sound for the BIOS screen. The beeps make a big difference.",
      "Stop the format screen at the right moment for the best reaction.",
      "Be nearby so you can reveal the prank before they pull the plug.",
    ],
    faq: [
      { question: "Will it format my drive?", answer: "No. It is an animation in the browser and has no access to your drives." },
      { question: "Is it safe to leave running?", answer: "Yes, but the point is the reaction, so do not leave it for long." },
    ],
  },
  "screen-damage": {
    about: [
      "Damage screens fake a broken display: spiderweb cracks across the glass, a failing LCD panel with stuck coloured lines, or a scattering of tiny dead pixels. They are quiet, believable and often the most shocking because the problem seems to be the screen itself.",
      "Each one is drawn live in the browser on top of a realistic desktop. The cracks spread over time, the LCD lines flicker and the dead pixels are small enough that people have to hunt for them.",
      "Press Esc and the damage is gone. The display itself is never touched.",
    ],
    tips: [
      "Use the cracked screen on a laptop with the volume up for the glass sound.",
      "Broken LCD looks best on a large monitor.",
      "Dead Pixels works best on a white page for fussy designers.",
      "Reveal quickly, since people worry about repair costs.",
    ],
    faq: [
      { question: "Can this damage my screen?", answer: "No. It is a picture drawn by a web page. The real display is not affected." },
      { question: "Which is the most believable?", answer: "Broken LCD on a big monitor, and Dead Pixels for people who look closely." },
    ],
  },
  comedy: {
    about: [
      "Not every prank needs to be scary. The comedy screens are built to make people laugh: cats that take over the computer with an endless news ticker, an over-enthusiastic paperclip assistant, a Minecraft update that goes wrong and a printer that always wins.",
      "They are the best choice for children, family and anyone who does not enjoy a fright.",
      "Everything runs in the browser and can be closed with Esc or Q.",
    ],
    tips: [
      "Leave the cats screen on for a while. The ticker keeps changing.",
      "Use the printer error just before an important print job.",
      "Show the Minecraft update to someone about to play.",
    ],
    faq: [
      { question: "Are these suitable for kids?", answer: "Yes. The comedy screens have no scary content." },
      { question: "Can I leave them running?", answer: "Yes. The cat news ticker loops with many different headlines." },
    ],
  },
}
