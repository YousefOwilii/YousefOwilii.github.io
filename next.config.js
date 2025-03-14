/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['via.placeholder.com'],
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
  // Disable font optimization
  optimizeFonts: false,
  // Disable minification
  swcMinify: false,
  // Ensure CSS is properly included
  experimental: {
    forceSwcTransforms: true,
  },
  // Disable CSS modules
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 