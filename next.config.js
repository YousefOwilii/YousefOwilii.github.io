/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'export',
  // For username.github.io repositories, both basePath and assetPrefix should be empty strings
  basePath: '',
  assetPrefix: '',
  // Add trailingSlash to ensure proper routing with static export
  trailingSlash: true,
  // Ensure CSS is properly included in the static export
  optimizeFonts: false,
  // Disable CSS optimization to ensure styles are properly included
  swcMinify: false,
};

module.exports = nextConfig; 