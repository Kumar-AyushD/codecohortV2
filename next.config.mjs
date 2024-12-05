/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aceternity.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Add this for Google images
        port: '',
        pathname: '/a/**', // or any other pattern you need
      },
    ],
  },
};

export default nextConfig;
