/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "da_DK"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [{ hostname: "img.clerk.com" }],
  },
}

export default nextConfig
