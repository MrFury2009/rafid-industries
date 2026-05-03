/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gsap'],
  },
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig
