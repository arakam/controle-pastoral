const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <- Isso ignora erros de lint no build
  }
}

module.exports = withPWA(nextConfig)
