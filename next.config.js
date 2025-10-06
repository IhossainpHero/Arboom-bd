/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dghqkfz7d/image/upload/**",
      },
    ],
  },
};

module.exports = nextConfig;
