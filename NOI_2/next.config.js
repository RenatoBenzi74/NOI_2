/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
}

// Configura PWA solo se next-pwa è installato
let withPWA
try {
  withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })
} catch {
  // next-pwa non installato — usa config base (funziona ugualmente in dev)
  withPWA = (config) => config
}

module.exports = withPWA(nextConfig)
