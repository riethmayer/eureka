/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // reactStrictMode: true,
  distDir: "build",
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

const { withSuperjson } = require("next-superjson");

module.exports = withSuperjson()(nextConfig);
