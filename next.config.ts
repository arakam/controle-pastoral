const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pode manter outras configs aqui, se já tiver
}

module.exports = withPWA(nextConfig)
