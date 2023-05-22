/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

// next.config.js
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  assetPrefix: isProd ? "/LegoFloralArtGenerator/" : "",
  images: {
    unoptimized: true,
  },
};
