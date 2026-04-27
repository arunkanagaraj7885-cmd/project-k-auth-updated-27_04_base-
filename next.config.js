/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['projectk-media.s3.ap-south-1.amazonaws.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};

module.exports = nextConfig;
