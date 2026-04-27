/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'projectk-media.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
  serverExternalPackages: ['@react-pdf/renderer'],
};

module.exports = nextConfig;
