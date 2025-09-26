/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/open-social' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/open-social/' : ''
}

module.exports = nextConfig
