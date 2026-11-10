/**
 * Single source of truth for every prank screen and category.
 * Home page cards, category pages, sitemap, JSON-LD, per-screen metadata and
 * all "N screens" counts are derived from this file, so they can never drift.
 */

export type CategorySlug =
  | "windows"
  | "windows-12"
  | "other-os"
  | "os-screens"
  | "ransomware"
  | "hacker"
  | "phishing"
  | "chaos"
  | "screen-damage"
  | "comedy"

export interface Screen {
  slug: string
  name: string
  category: CategorySlug
  /** Short blurb used on cards. */
  blurb: string
  /** SEO <title> (the " | PrankSims" suffix is added by the root template). */
  title: string
  /** SEO meta description, ~120-160 characters. */
  description: string
  keywords: string[]
  /** Surfaced on the home page "popular" row. */
  popular?: boolean
}

export interface Category {
  slug: CategorySlug
  name: string
  /** Label used in breadcrumbs and tight spaces. */
  shortName: string
  /** Lucide icon key, resolved in the UI layer. */
  icon: "Monitor" | "Laptop" | "Lock" | "Skull" | "Terminal" | "AlertTriangle" | "Zap" | "MonitorOff" | "Laugh"
  color: string
  gridColor: string
  /** Card blurb (without the count; the count is computed). */
  cardBlurb: string
  title: string
  description: string
  /** Visible intro paragraph on the category page (crawlable text). */
  intro: string
  keywords: string[]
}

const s = (
  slug: string,
  category: CategorySlug,
  name: string,
  blurb: string,
  title: string,
  description: string,
  keywords: string[],
  popular = false,
): Screen => ({ slug, category, name, blurb, title, description, keywords, popular })

export const SCREENS: Screen[] = [
  // ───────────────────────── Windows ─────────────────────────
  s("win31", "windows", "Windows 3.1 Crash", "Cascading error dialogs from 1992",
    "Fake Windows 3.1 Error Prank Screen",
    "Endless cascading Windows 3.1 error dialogs, straight from 1992. A free retro fake crash screen you can send as a link. Fullscreen and 100% harmless.",
    ["windows 3.1 prank", "fake windows 3.1 error", "retro windows crash", "90s computer prank", "old windows error dialogs"]),
  s("win98-bsod", "windows", "Windows 95/98 BSOD", "The classic blue screen of death",
    "Fake Windows 98 Blue Screen (BSOD) Prank",
    "Send a fake Windows 95/98 blue screen of death with the classic fatal exception 0E message. Free, fullscreen and totally harmless. Just share the link.",
    ["fake bsod", "windows 98 bsod", "windows 95 blue screen", "fake blue screen of death", "bsod prank link", "fatal exception 0e"], true),
  s("win95-update", "windows", "Windows 95 Update", "Searching for Windows 95 Update...",
    "Fake Windows 95 Update Prank Screen",
    "A fake Windows 95 \"Searching for Windows 95 Update\" window on the classic teal desktop with a slow progress bar. Free retro prank link, 100% safe.",
    ["windows 95 prank", "fake windows 95 update", "retro windows prank", "windows 95 update screen"]),
  s("winme-update", "windows", "Windows ME Update", "The most unstable Windows ever",
    "Fake Windows ME Update Prank Screen",
    "Prank someone with a fake Windows Millennium Edition update screen, the most infamous unstable Windows ever. Free, fullscreen retro prank link.",
    ["windows me prank", "fake windows millennium update", "windows me crash", "retro windows update prank"]),
  s("win2000-update", "windows", "Windows 2000 Update", "Installing Service Pack 4... 47 minutes left",
    "Fake Windows 2000 Update Prank Screen",
    "A fake Windows 2000 Professional screen \"Installing Service Pack 4\" with a 47-minute estimate. Send the link and watch them wonder why the PC is stuck in 2000.",
    ["windows 2000 prank", "fake windows 2000 update", "windows 2000 setup screen", "retro windows prank"]),
  s("winxp", "windows", "Windows XP Not Genuine", "This copy of Windows is not genuine",
    "Fake Windows XP \"Not Genuine\" Prank Screen",
    "The infamous \"This copy of Windows is not genuine\" warning, recreated in full screen. Send the link for a free Windows XP nostalgia prank.",
    ["windows xp not genuine", "fake windows xp prank", "windows xp genuine advantage", "windows xp error", "retro windows prank"], true),
  s("vista-uac", "windows", "Windows Vista UAC", "Permission denied... forever",
    "Fake Windows Vista UAC Prank Screen",
    "Relive the Windows Vista User Account Control nightmare: endless permission prompts with unknown publishers that never stop. Free fullscreen prank link.",
    ["windows vista uac prank", "fake uac prompt", "vista permission popups", "cancel or allow prank", "retro windows prank"]),
  s("win7-update", "windows", "Windows 7 Update", "Configuring Windows Updates... Do not turn off your computer",
    "Fake Windows 7 Update Prank Screen (Configuring Windows Updates)",
    "A fake Windows 7 \"Installing Update\" screen with a KB number, a progress bar and a 45-minute countdown. Send the link and let them wait. Free and harmless.",
    ["windows 7 update prank", "fake windows 7 update", "configuring windows features", "windows 7 update stuck"]),
  s("win8-update", "windows", "Windows 8 Update", "Metro style spinning dots",
    "Fake Windows 8 Update Prank Screen",
    "The Windows 8 spinning-dots screen reading \"Installing update 3 of 47\", fullscreen. A free, harmless fake update prank you can send with one link.",
    ["windows 8 update prank", "fake windows 8 update", "windows 8 metro screen", "windows 8 spinner"]),
  s("win10-update", "windows", "Windows 10 Update", "Working on updates... Don't turn off your PC",
    "Fake Windows 10 Update Prank Screen",
    "A fake Windows 10 \"Getting Windows Ready\" screen on the classic blue background. The most popular fake update prank, free and fullscreen. Just send the link.",
    ["fake windows 10 update", "windows 10 update prank", "working on updates", "fake update screen", "fake update prank"], true),
  s("win11-update", "windows", "Windows 11 Update", "Working on updates... 99% complete",
    "Fake Windows 11 Update Prank Screen",
    "A fake Windows 11 \"Working on updates\" screen frozen at 99% and warning that the PC will restart several times. Free fullscreen prank link.",
    ["fake windows 11 update", "windows 11 update prank", "windows 11 fake screen", "fake update screen"], true),
  s("windows-update", "windows", "Windows Update Forever", "Stuck at 99% for eternity",
    "Fake Windows Update Stuck at 99% Prank",
    "The fake Windows update that gets stuck at 33%, restarts, then freezes at 99% forever. A free fullscreen prank link that tests everyone's patience.",
    ["windows update stuck at 99", "fake windows update", "windows update prank", "never ending windows update", "fakeupdate alternative"], true),
  s("win10-realistic", "windows", "Windows 10 Realistic", "Ultra-realistic update stuck at 92%",
    "Realistic Fake Windows 10 Update Prank (92%)",
    "An ultra-realistic fake Windows 10 update that sticks at 92%. Looks like the real thing, runs in the browser, and is free to send as a link.",
    ["realistic fake windows update", "windows 10 update stuck 92", "fake windows 10 update prank", "best fake update screen"]),

  // ───────────────────────── Other OS ─────────────────────────
  s("macos-update", "other-os", "macOS Update", "Apple logo with progress bar",
    "Fake macOS Update Prank Screen",
    "A fake macOS Big Sur software update with the Apple logo and a slow progress bar. A free fullscreen Mac prank you can send as a link. 100% harmless.",
    ["fake macos update", "mac update prank", "fake apple update screen", "macbook prank", "fake mac screen"], true),
  s("ios-update", "other-os", "iOS Update", "iPhone/iPad software update",
    "Fake iOS Update Prank Screen for iPhone & iPad",
    "Prank an iPhone or iPad user with a fake iOS 17.3 install screen and a 45-minute estimate. Free, runs in the browser, shared with a single link.",
    ["fake ios update", "iphone update prank", "fake ipad update", "fake iphone screen", "apple prank"]),
  s("android-update", "other-os", "Android Update", "System update installing...",
    "Fake Android System Update Prank Screen",
    "A fake Android \"System Update Available\" security patch screen with a download progress bar. Free fullscreen prank link for any phone or tablet browser.",
    ["fake android update", "android update prank", "fake system update screen", "android prank"]),
  s("ubuntu-update", "other-os", "Ubuntu Update", "apt-get upgrade in progress",
    "Fake Ubuntu Update Prank (apt-get upgrade)",
    "A fake Ubuntu apt upgrade that scrolls package output and ends in a dpkg was interrupted error. A free prank for sysadmins and Linux fans: send the link.",
    ["fake ubuntu update", "linux prank", "apt-get upgrade prank", "fake linux screen", "ubuntu prank"]),
  s("chromeos-update", "other-os", "ChromeOS Update", "Chromebook update loop",
    "Fake ChromeOS Update Prank for Chromebooks",
    "A fake Chromebook \"Updating Chrome OS\" screen with the colourful spinner stuck at 99%. Free ChromeOS prank link, fullscreen and harmless.",
    ["fake chromeos update", "chromebook prank", "fake chrome os screen", "chromebook update prank"]),
  s("kernel-panic", "other-os", "Kernel Panic", "macOS fatal system error",
    "Fake macOS Kernel Panic Prank Screen",
    "A fake macOS kernel panic with the full wall of panic log text. Send this free fatal system error prank to any Mac user. Harmless, fullscreen.",
    ["fake kernel panic", "macos kernel panic prank", "mac crash screen", "fake system error", "kernel panic screen"]),


  // ───────────────────── OS Lock & Home Screens ─────────────────────
  s("win11-lock", "os-screens", "Windows 11 Lock Screen", "Bloom wallpaper, big clock, PIN sign-in that never works",
    "Fake Windows 11 Lock Screen Prank (PIN Sign-in)",
    "A convincing Windows 11 lock screen with the Bloom wallpaper and a PIN prompt that never accepts anything. Perfect for a Mac or Linux friend. Free fullscreen link.",
    ["fake windows 11 lock screen", "windows 11 lock screen prank", "fake login screen prank", "fake lock screen", "prank mac user windows"], true),
  s("win10-lock", "os-screens", "Windows 10 Lock Screen", "Hero wallpaper, bottom-left clock, password prompt",
    "Fake Windows 10 Lock Screen Prank (Sign-in Screen)",
    "A realistic Windows 10 lock and sign-in screen with the Hero wallpaper and a password box that always says it is incorrect. Free link prank for any computer.",
    ["fake windows 10 lock screen", "windows 10 login prank", "fake sign in screen", "fake lock screen prank"]),
  s("win7-login", "os-screens", "Windows 7 Welcome Screen", "The Aero welcome screen with a password that never works",
    "Fake Windows 7 Login Screen Prank (Welcome Screen)",
    "The Windows 7 Aero welcome screen with a user tile and a password box. Every attempt fails with the real error message. Free fullscreen nostalgia prank.",
    ["fake windows 7 login", "windows 7 welcome screen prank", "retro windows login prank", "fake login screen"]),
  s("winxp-welcome", "os-screens", "Windows XP Welcome Screen", "Click your user name... then try your password",
    "Fake Windows XP Welcome Screen Prank (Log On)",
    "The classic blue Windows XP welcome screen: \"To begin, click your user name.\" The password never works. Free retro login screen prank.",
    ["fake windows xp login", "windows xp welcome screen prank", "retro windows login", "xp logon screen"]),
  s("macos-lock", "os-screens", "macOS Lock Screen", "Sonoma-style lock screen with Touch ID and password",
    "Fake macOS Lock Screen Prank (Mac Login Screen)",
    "A fake macOS lock screen with a big clock, user avatar and password field that shakes on every attempt. Prank your Windows friend as a Mac. Free link.",
    ["fake macos lock screen", "mac login screen prank", "fake mac lock screen", "macos prank screen"], true),
  s("ios-lock", "os-screens", "iPhone Lock Screen", "Swipe up, enter passcode, iPhone Unavailable",
    "Fake iPhone Lock Screen Prank (Passcode Screen)",
    "A fake iOS lock screen with a swipe-up gesture, passcode keypad and the dreaded \"iPhone Unavailable\" lockout. Works on phones and desktops. Free prank link.",
    ["fake iphone lock screen", "ios lock screen prank", "fake passcode screen", "iphone unavailable prank"]),
  s("android-lock", "os-screens", "Android Lock Screen", "Swipe up, enter PIN, too many attempts",
    "Fake Android Lock Screen Prank (PIN Screen)",
    "A fake Android lock screen with a PIN keypad that always says wrong PIN, then locks you out. Works on phones and desktops. Free prank link.",
    ["fake android lock screen", "android lock screen prank", "fake pin screen", "fake phone lock screen"]),
  s("ubuntu-login", "os-screens", "Ubuntu Login Screen", "GNOME login with an authentication failure every time",
    "Fake Ubuntu Login Screen Prank (GNOME Sign-in)",
    "A fake Ubuntu GNOME login screen. Passwords return \"Sorry, that didn't work\" until it locks you out. A great prank for Linux users. Free link.",
    ["fake ubuntu login screen", "linux login prank", "fake gnome login", "ubuntu prank screen"]),
  s("win11-desktop", "os-screens", "Windows 11 Desktop", "A working-looking Windows 11 desktop and Start menu",
    "Fake Windows 11 Desktop Prank (Start Menu)",
    "A realistic Windows 11 desktop with taskbar and Start menu. Make a Mac or Linux user think they have been switched to Windows. Free fullscreen link.",
    ["fake windows 11 desktop", "windows 11 prank", "fake start menu", "switch to windows prank"]),
  s("macos-desktop", "os-screens", "macOS Desktop", "Sonoma-style desktop with menu bar and a dock that crashes apps",
    "Fake macOS Desktop Prank (Dock and Menu Bar)",
    "A realistic macOS desktop with a menu bar and dock. Every app you open \"quits unexpectedly.\" Prank a Windows user into thinking they are on a Mac. Free link.",
    ["fake macos desktop", "mac desktop prank", "fake mac dock", "switch to mac prank"]),

  // ───────────────────────── Ransomware ─────────────────────────
  s("cryptolocker", "ransomware", "CryptoLocker", "Your files have been encrypted!",
    "Fake CryptoLocker Ransomware Prank Screen",
    "A fake CryptoLocker ransomware screen with a scary countdown and ransom note. It's a harmless joke. Send the link and let them panic for a bit.",
    ["fake cryptolocker", "fake ransomware screen", "ransomware prank", "cryptolocker prank", "fake ransom note"], true),
  s("wannacry", "ransomware", "WannaCry 2.0", "The infamous global ransomware",
    "Fake WannaCry Ransomware Prank Screen",
    "Recreate the infamous WannaCry \"Ooops, your files have been encrypted\" screen as a harmless prank. Free, fullscreen, nothing is touched.",
    ["fake wannacry", "wannacry prank", "fake ransomware", "wannacry screen", "fake virus screen"], true),
  s("petya", "ransomware", "Petya Skull", "Scary red screen with skull",
    "Fake Petya Ransomware Skull Screen Prank",
    "The scary red Petya skull ransomware screen, recreated as a safe browser prank. Send the link and watch the colour drain from their face.",
    ["fake petya", "petya ransomware prank", "red skull screen", "fake ransomware screen", "scary computer prank"]),
  s("locky", "ransomware", "Locky", "All your files are locked",
    "Fake Locky Ransomware Prank Screen",
    "A fake Locky ransomware note claiming all your files are locked. A harmless, free, fullscreen prank you can send in one link.",
    ["fake locky", "locky ransomware prank", "fake ransomware screen", "files locked prank"]),
  s("bad-rabbit", "ransomware", "Bad Rabbit", "Red-on-black \"Oops! Your files have been encrypted\" note",
    "Fake Bad Rabbit Ransomware Prank Screen",
    "The Bad Rabbit ransomware boot messages and red-on-black ransom note, rebuilt as a safe prank. Free fullscreen link, nothing is encrypted.",
    ["fake bad rabbit", "bad rabbit ransomware prank", "fake ransomware screen", "ascii ransomware screen"]),
  s("fbi-warning", "ransomware", "FBI Warning", "Your computer has been locked. Pay the fine.",
    "Fake FBI Warning Screen Prank (Computer Locked)",
    "A fake FBI Anti-Piracy \"your computer has been locked\" warning with a countdown, webcam box and MoneyPak fine demand. A classic joke you can send as a free, harmless link.",
    ["fake fbi warning", "fbi warning prank", "fake locked computer screen", "fbi prank", "fake police warning screen"], true),

  // ───────────────────────── Hacker ─────────────────────────
  s("malware-infection", "hacker", "Malware Infection", "Full system takeover simulation - webpage to infection",
    "Fake Malware Infection Prank Screen",
    "A full fake malware infection from sketchy download page to total system takeover, with popups, terminal output and fake data theft. Safe prank.",
    ["fake malware", "malware prank", "fake virus infection", "fake hacked computer", "computer virus prank"]),
  s("matrix", "hacker", "Matrix Terminal", "Hollywood-style hacking terminal",
    "Fake Matrix Hacker Terminal Prank Screen",
    "Green Matrix rain turns into a Hollywood-style hacking terminal running fake exploits. A free \"you've been hacked\" prank link, fullscreen.",
    ["fake hacker screen", "matrix hacker prank", "hollywood hacker terminal", "fake hacking screen", "matrix rain prank"], true),
  s("webcam", "hacker", "Webcam Activated", "Someone is watching you",
    "Fake \"Webcam Activated\" Hacked Camera Prank",
    "A fake \"someone is watching you\" webcam activated screen with an absurd fake location. Safe: it never touches your real camera. Send the link.",
    ["fake webcam hacked", "webcam prank", "fake camera activated", "someone watching you prank", "hacked webcam screen"]),
  s("system32", "hacker", "System32 Deleting", "Deleting critical system files",
    "Fake System32 Deleting Prank Screen",
    "Watch System32 appear to be deleted file by file. A classic fake delete-system32 prank that's free, fullscreen and 100% harmless.",
    ["delete system32 prank", "fake system32 deleting", "fake file deletion screen", "fake system error", "system32 prank"]),
  s("data-theft", "hacker", "Data Theft", "Files being exfiltrated to remote server",
    "Fake Data Theft & Hacked Files Prank Screen",
    "A fake data exfiltration screen showing files and passwords being uploaded to a hacker's server. Harmless and free: just share the link.",
    ["fake data theft", "fake hacked screen", "data exfiltration prank", "you've been hacked prank"]),
  s("file-download-hack", "hacker", "File Download Hack", "Trojan downloading and executing",
    "Fake Trojan Download & Execution Prank Screen",
    "A fake trojan that downloads and executes itself on screen, complete with scary progress output. A free browser-only hacker prank link.",
    ["fake trojan download", "fake virus download", "fake hack prank", "trojan prank screen"]),
  s("keylogger", "hacker", "Keylogger Active", "Recording all your keystrokes",
    "Fake Keylogger Active Prank Screen",
    "A fake keylogger screen claiming every keystroke is being recorded. It records nothing: it's a free, harmless fullscreen prank link.",
    ["fake keylogger", "keylogger prank", "fake recording keystrokes", "fake hacker prank"]),
  s("remote-access", "hacker", "Remote Access Trojan", "Attacker controlling your PC",
    "Fake Remote Access Trojan (RAT) Prank Screen",
    "A fake remote access trojan screen where an \"attacker\" seems to be controlling the PC. Free, fullscreen and completely harmless.",
    ["fake remote access", "fake rat trojan", "remote access prank", "someone controlling my pc prank"]),
  s("crypto-miner", "hacker", "Crypto Miner", "Mining cryptocurrency on your hardware",
    "Fake Crypto Miner Prank (Bitcoin Mining)",
    "A fake cryptojacking screen showing a miner maxing out your CPU and GPU. Free and harmless: it never mines anything. Send the link.",
    ["fake crypto miner", "cryptojacking prank", "fake bitcoin miner", "fake cpu usage prank"]),

  // ───────────────────────── Phishing & Scams ─────────────────────────
  s("tech-support-scam", "phishing", "Tech Support Scam", "Fake Microsoft support popup",
    "Fake Tech Support Scam Popup Prank",
    "A fake \"Microsoft support\" scam with spamming warnings and a scary phone number. Great for scam awareness too. Free and safe.",
    ["fake tech support scam", "tech support scam prank", "fake microsoft warning", "scam awareness prank", "fake virus warning"]),
  s("fake-antivirus", "phishing", "Fake Antivirus", "47 viruses detected!",
    "Fake Antivirus Scan Prank (Viruses Detected!)",
    "A fake antivirus scan that \"finds\" dozens of nasty viruses and offers to clean them. A free, harmless scareware prank and a lesson in fake AV.",
    ["fake antivirus", "fake virus scan", "fake virus warning", "scareware prank", "fake malware detected"]),
  s("browser-hijack", "phishing", "Browser Hijack", "Endless redirects and popups",
    "Fake Browser Hijack Prank (Endless Redirects)",
    "A fake hijacked browser page full of spammy offers and redirects. Harmless, runs entirely in your tab, and easy to send as a link.",
    ["browser hijack prank", "fake browser hijacker", "fake redirect page", "fake search redirect"]),
  s("fake-flash-update", "phishing", "Fake Flash Update", "Classic malware delivery trick",
    "Fake Adobe Flash Player Update Prank Screen",
    "The classic fake Adobe Flash Player update popup, a favourite malware trick, recreated as a harmless prank and phishing awareness demo.",
    ["fake flash update", "adobe flash prank", "fake flash player update", "phishing awareness demo"]),

  // ───────────────────────── System Chaos ─────────────────────────
  s("format", "chaos", "Hard Drive Format", "Formatting C: drive... 99%",
    "Fake Hard Drive Format Prank (Formatting C:)",
    "A fake \"formatting C: drive\" screen with a progress bar that creeps to 99%. A free, fullscreen prank that doesn't touch a single file.",
    ["fake format c drive", "fake hard drive format", "formatting c prank", "fake disk format screen"]),
  s("bios", "chaos", "BIOS Corruption", "Critical firmware failure",
    "Fake BIOS Corruption Prank Screen",
    "A fake BIOS \"checksum failed\" screen ending in SYSTEM HALTED. Looks serious, is harmless, and is free to send as a link. Fullscreen on any device.",
    ["fake bios corruption", "bios error prank", "fake firmware failure", "fake bios screen"]),

  // ───────────────────────── Screen Damage ─────────────────────────
  s("cracked-screen", "screen-damage", "Cracked Screen", "Spiderweb glass cracks with LCD ink bleed, spreading over time",
    "Cracked Screen Prank (Fake Broken Glass)",
    "A realistic shattered glass effect with LCD bleed that makes it look like their monitor just cracked. Free fullscreen prank link for any display.",
    ["cracked screen prank", "fake broken screen", "broken screen prank", "shattered screen effect", "fake cracked monitor"], true),
  s("broken-lcd", "screen-damage", "Broken LCD", "Failed panel: stuck colored columns, dead stripes and a flickering corrupted band",
    "Broken LCD Screen Prank (Vertical Line Damage)",
    "A broken LCD effect with vertical dead pixel columns and coloured stripes. Free fullscreen prank that fools people into thinking the display failed.",
    ["broken lcd prank", "fake broken lcd screen", "vertical lines screen prank", "fake dead pixel lines"]),
  s("dead-pixels", "screen-damage", "Dead Pixels", "Tiny stuck and dead pixels you have to hunt for",
    "Dead Pixels Prank (Fake Stuck Pixel Screen)",
    "Tiny fake stuck and dead pixels, drawn at real pixel size so people lean in and rub the screen. A free prank link that makes everyone check their monitor.",
    ["dead pixels prank", "fake stuck pixels", "fake dead pixel screen", "monitor prank"]),

  // ───────────────────────── Comedy ─────────────────────────
  s("cats-took-over", "comedy", "The Cats Have Taken Over", "Cats seize the computer, plus an endless news ticker",
    "\"The Cats Have Taken Over\" Funny Computer Prank",
    "The Feline Collective takes over the screen with a list of increasingly specific demands and a slow, endless news ticker of deadpan headlines. A funny, harmless prank.",
    ["cat prank", "funny computer prank", "cats took over prank", "funny hacker cat screen", "cat lover prank"]),
  s("corner-watch", "comedy", "The Corner Watch", "A bouncing logo and a stadium full of people waiting for it to hit the corner",
    "Funny Bouncing Logo Corner Prank (The Corner Watch)",
    "A bouncing screensaver logo turned into a live sports event: near misses, groaning crowds and an explosion of confetti when it finally hits the corner. Free and harmless.",
    ["bouncing logo prank", "dvd logo corner prank", "funny screensaver prank", "corner hit prank", "funny computer prank"], true),
  s("mouse-sports-network", "comedy", "Mouse Sports Network", "Two announcers do live play-by-play of your mouse. Out loud.",
    "Funny Mouse Commentary Prank (Mouse Sports Network)",
    "Two sports announcers narrate every move of your mouse with live commentary, instant replays and a cheering crowd when you come back. Free, harmless and very silly.",
    ["mouse commentary prank", "funny mouse prank", "sports announcer prank", "funny computer prank", "live commentary prank"], true),
  s("flooded-desktop", "comedy", "Flooded Desktop", "Water is rising on your desktop. There is a duck. Then a shark.",
    "Funny Flooded Desktop Prank (Water, Duck and a Shark)",
    "Your desktop slowly floods: icons float, a rubber duck drifts by, fish swim past and a shark fin shows up. Understood from across the room. Free and harmless.",
    ["flooded desktop prank", "water screen prank", "funny desktop prank", "rubber duck prank", "funny computer prank"], true),
  s("gravity-update", "comedy", "Windows Gravity Update", "Gravity has been enabled. Your icons are falling. Then they fall sideways.",
    "Fake Windows Gravity Update Prank (Icons Fall Down)",
    "A fake Windows update turns gravity on: desktop icons fall, pile up, float to the ceiling and roll sideways. Grab them and throw them around. Free and harmless.",
    ["gravity prank", "falling icons prank", "windows gravity update", "funny physics prank", "funny desktop prank"], true),
  s("departures-board", "comedy", "Departures Board", "An airport split-flap board listing your computer's life. With announcements.",
    "Funny Airport Departures Board Prank (Computer Edition)",
    "A clattering split-flap airport board lists flights like Wi-Fi to Hope (cancelled) and Your Productivity (departed), with deadpan announcements. Free and harmless.",
    ["departures board prank", "airport board prank", "split flap display prank", "funny airport prank", "funny computer prank"]),
  s("ant-parade", "comedy", "Ant Parade", "A line of ants carries off your desktop icons. Gary isn't helping.",
    "Funny Ants Carrying Icons Prank (Ant Parade)",
    "A line of tiny ants marches across the desktop and carries away the icons one by one, arguing about who is lifting. Then they bring them back in the wrong places. Free and harmless.",
    ["ants on screen prank", "ants carrying icons", "funny ants prank", "bug on screen prank", "funny desktop prank"], true),
  s("on-hold", "comedy", "Your Call Is On Hold", "Hold music, a robot voice and a queue position that goes up when you press a key",
    "Funny Computer On Hold Prank (Hold Music and Queue)",
    "Your computer has been placed on hold with lobby music and a polite robot voice. Your queue position keeps getting worse, and pressing keys makes it worse faster. Free and harmless.",
    ["on hold prank", "hold music prank", "funny phone prank", "customer service prank", "funny computer prank"]),
  s("the-fly", "comedy", "The Fly", "A very realistic fly lands on the screen and rubs its hands. It keeps coming back.",
    "Fake Fly on Screen Prank (Very Realistic)",
    "A tiny realistic fly walks across the screen, rubs its hands and takes off with a buzz when you reach for it. More show up over time. Free and harmless.",
    ["fly on screen prank", "bug on screen prank", "fake fly prank", "fly on monitor", "funny computer prank"], true),
  s("windows-xp-tour", "comedy", "Clippy's Revenge", "A very annoying paperclip assistant",
    "Windows XP Clippy's Revenge Prank",
    "An over-helpful Windows XP style paperclip assistant that will not leave you alone. A nostalgic, funny and harmless fullscreen prank.",
    ["clippy prank", "windows xp clippy", "annoying paperclip assistant", "funny windows xp prank", "clippy revenge"]),
  s("minecraft-update", "comedy", "Minecraft Update", "A Minecraft update gone terribly wrong",
    "Fake Minecraft Update Gone Wrong Prank",
    "A Minecraft update that goes hilariously wrong, with Herobrine and Creepers crashing the party. A funny, harmless fullscreen prank link for gamers.",
    ["minecraft prank", "fake minecraft update", "minecraft creeper prank", "gamer prank", "funny gaming prank"]),
  s("printer-error", "comedy", "Printer Error", "The printer wins. It always wins.",
    "Funny Printer Error Prank (Printer Rage Popups)",
    "Absurd printer error popups pile up until someone rage-quits. Everyone who has fought an office printer will relate. Free and harmless.",
    ["printer error prank", "funny printer error", "office prank", "printer rage", "fake printer error popup"]),
  s("win12-lock", "windows-12", "Windows 12 Lock Screen", "Aurora wallpaper, giant clock, an AI that has noticed things, a face scan that fails",
    "Fake Windows 12 Lock Screen Prank (It Doesn't Exist Yet)",
    "A futuristic fake Windows 12 lock screen with an aurora wallpaper, a Copilot that comments on your life and a face scan that does not recognize you. Free fullscreen prank link.",
    ["windows 12 prank", "fake windows 12", "windows 12 lock screen", "windows 12 leak", "futuristic lock screen prank", "new windows prank"], true),
  s("win12-update", "windows-12", "Windows 12 Upgrade", "Upgrading to Windows 12: learning how you work, building your digital twin",
    "Fake Windows 12 Upgrade Prank (AI Takes Over Your PC)",
    "A sleek fake Windows 12 upgrade that is reorganizing your desktop and building your digital twin, with an orbital loader that stalls at 99%. Free and harmless.",
    ["windows 12 update prank", "fake windows 12 upgrade", "windows 12 install prank", "ai windows prank", "future windows prank"]),
  s("win12-desktop", "windows-12", "Windows 12 Desktop & Copilot", "A floating-dock desktop with an AI that tidied your Downloads folder away",
    "Fake Windows 12 Desktop and Copilot Prank",
    "A fake Windows 12 desktop with a floating dock and an AI assistant you can chat with. It has opinions, and it tidied your Downloads folder out of existence.",
    ["windows 12 desktop prank", "fake windows 12 desktop", "ai copilot prank", "windows 12 copilot", "fake ai assistant prank"]),
  s("win12-unsupported", "windows-12", "Windows 12: PC Not Supported", "This PC can't run Windows 12. Windows 12 is already installed.",
    "Fake \"This PC Can't Run Windows 12\" Prank",
    "A fake Windows 12 compatibility screen: your PC fails the requirements, Windows 12 is already installed, and a countdown is running. Free, harmless, mildly terrifying.",
    ["windows 12 requirements prank", "pc can't run windows 12", "unsupported pc prank", "windows 12 compatibility", "tpm prank"]),
  s("win12-recall", "windows-12", "Windows 12 Recall", "Windows remembers everything: a timeline of things you did at 2 AM",
    "Fake Windows 12 Recall Timeline Prank",
    "A fake Windows 12 Recall feature with a scrubbable timeline of what your PC remembers about you. Funny, a little creepy and completely harmless.",
    ["windows recall prank", "windows 12 recall", "fake recall timeline", "windows remembers prank", "ai memory prank"]),
]

export const CATEGORIES: Category[] = [
  {
    slug: "windows", name: "Windows Updates & Crashes", shortName: "Windows",
    icon: "Monitor", color: "from-cyan-500 to-blue-600", gridColor: "rgba(0,255,255,0.05)",
    cardBlurb: "From Windows 3.1 to Windows 11, plus an ultra-realistic update stuck at 92%",
    title: "Fake Windows Update & BSOD Prank Screens",
    description: "Fake Windows update and crash screens from Windows 3.1 to Windows 11: blue screens, Vista UAC, XP \"not genuine\" and update-stuck-at-99%. Free, fullscreen and harmless.",
    intro: "Every era of Windows, faked. Send a link to a convincing update screen, blue screen of death or retro error spiral, and watch your friends, coworkers or family decide whether to restart. All of these run only in the browser and never touch the real computer.",
    keywords: ["fake windows update", "windows prank", "fake bsod", "windows update prank", "fake windows crash", "retro windows prank"],
  },
  {
    slug: "windows-12", name: "Windows 12 (Doesn't Exist Yet)", shortName: "Windows 12",
    icon: "Monitor", color: "from-violet-500 to-cyan-400", gridColor: "rgba(139,92,246,0.06)",
    cardBlurb: "A futuristic Windows 12: lock screen, AI upgrade, Copilot desktop, Recall and an unsupported PC",
    title: "Fake Windows 12 Prank Screens: Lock Screen, Upgrade & Copilot",
    description: "Fake Windows 12 prank screens: an AI lock screen, a futuristic upgrade, a Copilot desktop, Recall and a PC that cannot run it. Windows 12 doesn't exist yet, which is why it's scary.",
    intro: "Windows 12 doesn't exist yet, which is exactly why it is so convincing. These screens imagine a glassy, AI-first Windows, from a lock screen that doesn't recognize your face to a Copilot that has been reading your files.",
    keywords: ["windows 12 prank", "fake windows 12", "windows 12 lock screen", "windows 12 update prank", "windows 12 copilot", "windows recall prank"],
  },
  {
    slug: "other-os", name: "Other OS Updates", shortName: "Other OS",
    icon: "Laptop", color: "from-purple-500 to-pink-600", gridColor: "rgba(168,85,247,0.05)",
    cardBlurb: "macOS, iOS, Android, Ubuntu, ChromeOS and Kernel Panics",
    title: "Fake macOS, iOS, Android & Ubuntu Update Pranks",
    description: "Fake system update and crash screens for macOS, iPhone, iPad, Android, Ubuntu Linux and Chromebooks, plus a kernel panic. Free link pranks for any device.",
    intro: "Not everyone runs Windows. These fake update screens cover Apple, Android, Linux and ChromeOS devices, plus a macOS kernel panic, so you can prank whoever sits at whatever machine.",
    keywords: ["fake macos update", "fake ios update", "fake android update", "fake ubuntu update", "chromebook prank", "kernel panic prank"],
  },
  {
    slug: "os-screens", name: "Fake OS Lock & Home Screens", shortName: "Lock Screens",
    icon: "Lock", color: "from-sky-500 to-indigo-600", gridColor: "rgba(56,189,248,0.05)",
    cardBlurb: "Windows 11 lock screen on a Mac, macOS on a PC, iPhone and Android locks",
    title: "Fake Lock Screen & Login Screen Pranks (Windows, Mac, iPhone)",
    description: "Fake lock screens and desktops for Windows 11, 10, 7, XP, macOS, iPhone, Android and Ubuntu. Show a Mac user a Windows lock screen. Free fullscreen prank links.",
    intro: "Imagine a hardcore Mac fan suddenly seeing the Windows 11 lock screen, or a Windows loyalist staring at a macOS login that will not accept a password. These realistic lock, login and desktop screens work on any device, and the passwords never work.",
    keywords: ["fake lock screen", "fake login screen prank", "windows lock screen prank", "mac lock screen prank", "fake os prank", "prank friend computer"],
  },
  {
    slug: "ransomware", name: "Fake Ransomware", shortName: "Ransomware",
    icon: "Skull", color: "from-red-500 to-pink-600", gridColor: "rgba(239,68,68,0.05)",
    cardBlurb: "CryptoLocker, WannaCry, Petya, Locky, BadRabbit & FBI Warning",
    title: "Fake Ransomware Prank Screens (WannaCry & More)",
    description: "Harmless fake ransomware screens: CryptoLocker, WannaCry, Petya, Locky, Bad Rabbit and the FBI warning. Nothing is encrypted. Free prank links.",
    intro: "Famous ransomware, rebuilt as harmless browser pranks. No file is ever encrypted or touched. They also make good security-awareness demos.",
    keywords: ["fake ransomware", "ransomware prank", "fake wannacry", "fake cryptolocker", "fake petya", "fake fbi warning"],
  },
  {
    slug: "hacker", name: "Hacker Attacks", shortName: "Hacker",
    icon: "Terminal", color: "from-green-500 to-emerald-600", gridColor: "rgba(34,197,94,0.05)",
    cardBlurb: "Matrix, keyloggers, remote access, data theft & more",
    title: "Fake Hacker Screens: Matrix, Keylogger & Webcam",
    description: "Fake hacking screens: Matrix terminal, keylogger, webcam activated, remote access trojan, data theft, crypto miner and System32 deleting. Free and harmless.",
    intro: "Hollywood-grade hacking, minus the hacking. These screens simulate terminals, trojans, keyloggers and data theft entirely in the page. Nothing is installed, recorded or sent anywhere.",
    keywords: ["fake hacker screen", "fake hacking screen", "matrix hacker prank", "fake webcam hacked", "fake keylogger", "hacker prank"],
  },
  {
    slug: "phishing", name: "Phishing & Scams", shortName: "Phishing & Scams",
    icon: "AlertTriangle", color: "from-orange-500 to-red-600", gridColor: "rgba(249,115,22,0.05)",
    cardBlurb: "Tech support scams, fake antivirus, browser hijacks",
    title: "Fake Tech Support Scam & Fake Antivirus Prank Screens",
    description: "Fake tech support scam popups, fake antivirus scans, browser hijacks and fake Flash updates. Funny pranks that double as scam-awareness demos.",
    intro: "The scams everyone has seen, recreated so you can laugh at them safely. They are also handy for showing family or coworkers what a real scam popup looks like, without any of the risk.",
    keywords: ["fake tech support scam", "fake antivirus", "fake virus warning", "browser hijack prank", "scam awareness"],
  },
  {
    slug: "chaos", name: "System Chaos", shortName: "System Chaos",
    icon: "Zap", color: "from-yellow-500 to-orange-600", gridColor: "rgba(234,179,8,0.05)",
    cardBlurb: "Hard drive formatting, BIOS corruption",
    title: "Fake Format C: and BIOS Corruption Prank Screens",
    description: "Fake system chaos pranks: a hard drive format creeping to 99% and a critical BIOS corruption warning. Free, fullscreen and harmless.",
    intro: "When the scary message isn't from the OS at all. A drive format that never finishes and a firmware failure that looks very final. Both are completely harmless.",
    keywords: ["fake format c drive", "fake bios corruption", "fake system error", "fake hard drive format"],
  },
  {
    slug: "screen-damage", name: "Screen Damage", shortName: "Screen Damage",
    icon: "MonitorOff", color: "from-indigo-500 to-violet-600", gridColor: "rgba(99,102,241,0.05)",
    cardBlurb: "Cracked glass, broken LCD vertical stripes, dead pixels",
    title: "Broken Screen Pranks: Cracked Glass & Dead Pixels",
    description: "Fake broken screen pranks: realistic cracked glass, broken LCD stripes and clusters of dead pixels. Free fullscreen links that fool anyone.",
    intro: "Make a perfectly good monitor look wrecked. These effects are drawn over the page, so the real display is never harmed, but they look convincing enough to make people wince.",
    keywords: ["cracked screen prank", "broken screen prank", "fake broken lcd", "dead pixels prank", "fake cracked monitor"],
  },
  {
    slug: "comedy", name: "Absurd & Comedy", shortName: "Comedy",
    icon: "Laugh", color: "from-yellow-400 to-pink-500", gridColor: "rgba(250,204,21,0.05)",
    cardBlurb: "A bouncing logo stadium, a flooding desktop, falling icons, ants, a fly, cats, Clippy, Minecraft and printers",
    title: "Funny Computer Pranks: Flooding Desktops, Falling Icons, Ants & Cats",
    description: "Funny computer pranks: a bouncing-logo stadium, a flooding desktop, falling icons, an ant parade, a fly on the screen, cats, Clippy and printer rage. Free and harmless.",
    intro: "Not every prank has to be scary. These are silly, absurd and designed to get a laugh rather than a panic.",
    keywords: ["funny computer prank", "cat prank", "clippy prank", "minecraft prank", "printer error prank"],
  },
]

// ───────────────────────── Lookups ─────────────────────────

export const TOTAL_SCREENS = SCREENS.length

export const getScreen = (slug: string): Screen => {
  const found = SCREENS.find((x) => x.slug === slug)
  if (!found) throw new Error(`Unknown screen slug: ${slug}`)
  return found
}

export const getCategory = (slug: CategorySlug): Category => {
  const found = CATEGORIES.find((c) => c.slug === slug)
  if (!found) throw new Error(`Unknown category slug: ${slug}`)
  return found
}

export const screensInCategory = (slug: CategorySlug): Screen[] =>
  SCREENS.filter((x) => x.category === slug)

export const screenPath = (slug: string) => `/screens/${slug}`
export const guidePath = (slug: string) => `/guide/${slug}`
export const categoryPath = (slug: CategorySlug) => `/category/${slug}`

/** Most launched screens in the first week of Vercel Analytics (Nov 2026), plus new comedy. Shown right under the home hero. */
export const TRENDING_SLUGS = ["webcam", "minecraft-update", "crypto-miner", "cats-took-over", "fake-antivirus", "corner-watch"]
export const trendingScreens = (): Screen[] => TRENDING_SLUGS.map((x) => getScreen(x))

export const popularScreens = (): Screen[] => SCREENS.filter((x) => x.popular)
