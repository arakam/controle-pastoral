const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Desabilita algumas funcionalidades experimentais que podem causar problemas
    serverComponentsExternalPackages: [],
  },
  // Configurações para melhor estabilidade
  swcMinify: true,
  poweredByHeader: false,
}

module.exports = withPWA(nextConfig)
