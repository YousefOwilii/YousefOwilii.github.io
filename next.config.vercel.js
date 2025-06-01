/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // API routes need server-side rendering, so we don't use 'export' here
  // Ignore the pages.bak directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('bak')),
};

module.exports = nextConfig; 