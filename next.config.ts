import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: 'https', 
        hostname: 'images.unsplash.com',
      },
      {
        protocol:'https',
        hostname:'i.pravatar.cc'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      }
    ],
  }
};

export default nextConfig;
