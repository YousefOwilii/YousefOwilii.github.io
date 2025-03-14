/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
  },
  output: 'export',
  // For username.github.io repositories, both basePath and assetPrefix should be empty strings
  // This is correct for your case since your repo is YousefOwilii.github.io
  basePath: '',
  assetPrefix: '',
  // Add trailingSlash to ensure proper routing with static export
  trailingSlash: true,
};

module.exports = nextConfig; 