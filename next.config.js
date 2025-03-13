/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
  },
  output: 'export',
  // For username.github.io repositories, both basePath and assetPrefix should be empty strings
  // as the site will be served from the root domain
  basePath: '',
  assetPrefix: '',
  // Add trailingSlash to ensure proper routing with static export
  trailingSlash: true,
};

module.exports = nextConfig; 