/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for demo mode, disable for full GitHub auth
  ...(process.env.DEMO_MODE === 'true' && {
    output: 'export',
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/open-social' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/open-social/' : ''
  }),
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
