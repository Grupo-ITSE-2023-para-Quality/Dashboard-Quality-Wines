/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Permite todas las rutas dentro de este dominio
      },
    ],
  },
};

export default nextConfig;