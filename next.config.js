/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/open-social' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/open-social/' : '',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
