/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
  },
  output: 'export',
  // Set the base path to match your GitHub repository name
  // For example, if your repo is username.github.io, leave it as empty string
  // If your repo is my-website, set it to '/my-website'
  basePath: '',
  // Disable image optimization for static export
  assetPrefix: '',
};

module.exports = nextConfig; 