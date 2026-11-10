/** @type {import('next').NextConfig} */
const REMOVED = [
  "keyboard-subscription", "update-delivery", "rogue-cursor", "autocomplete-gone-feral",
  "meeting-you-forgot", "free-trial-expired", "windows-wants-to-talk", "computer-resignation",
]

const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Retired comedy screens: send old links (and search results) to the comedy category.
  async redirects() {
    return REMOVED.flatMap((slug) => [
      { source: `/screens/${slug}`, destination: "/category/comedy", permanent: true },
      { source: `/guide/${slug}`, destination: "/category/comedy", permanent: true },
    ])
  },
}

export default nextConfig
