/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/ds6lk4m1e/**',
        },
      ],
    },
  };
  
  export default nextConfig;
