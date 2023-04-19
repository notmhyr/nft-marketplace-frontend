/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "_colors.scss";`,
  },
  images: {
    domains: ["ipfs.io"],
  },
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;
