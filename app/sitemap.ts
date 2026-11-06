import type { MetadataRoute } from "next"

const BASE_URL = "https://pranksims.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const screens = [
    // Windows Updates
    "/screens/win31",
    "/screens/win98-bsod",
    "/screens/win95-update",
    "/screens/winme-update",
    "/screens/win2000-update",
    "/screens/winxp",
    "/screens/vista-uac",
    "/screens/win7-update",
    "/screens/win8-update",
    "/screens/win10-update",
    "/screens/win11-update",
    "/screens/windows-update",
    // Other OS
    "/screens/macos-update",
    "/screens/ios-update",
    "/screens/android-update",
    "/screens/ubuntu-update",
    "/screens/chromeos-update",
    "/screens/kernel-panic",
    // Ransomware
    "/screens/cryptolocker",
    "/screens/wannacry",
    "/screens/petya",
    "/screens/locky",
    "/screens/bad-rabbit",
    "/screens/fbi-warning",
    // Hacker
    "/screens/malware-infection",
    "/screens/matrix",
    "/screens/webcam",
    "/screens/system32",
    "/screens/data-theft",
    "/screens/file-download-hack",
    "/screens/keylogger",
    "/screens/remote-access",
    "/screens/crypto-miner",
    // Phishing
    "/screens/tech-support-scam",
    "/screens/fake-antivirus",
    "/screens/browser-hijack",
    "/screens/fake-flash-update",
    // System Chaos
    "/screens/format",
    "/screens/bios",
    "/screens/cracked-screen",
    "/screens/broken-lcd",
    "/screens/dead-pixels",
    "/screens/win10-realistic",
    // Comedy
    "/screens/cats-took-over",
    "/screens/windows-xp-tour",
    "/screens/minecraft-update",
    "/screens/printer-error",
  ]

  const categories = [
    "/category/windows",
    "/category/other-os",
    "/category/ransomware",
    "/category/hacker",
    "/category/phishing",
    "/category/chaos",
    "/category/comedy",
  ]

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...categories.map((cat) => ({
      url: `${BASE_URL}${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...screens.map((screen) => ({
      url: `${BASE_URL}${screen}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
