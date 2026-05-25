import { withSentryConfig } from "@sentry/nextjs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the Docker
  // image for Cloud Run stays minimal and doesn't need the full node_modules.
  output: "standalone",
  // Pin the file-tracing root to this app dir. Without it, Next walks up to the
  // parent repo's lockfile (this is a git worktree under .claude/) and nests
  // standalone/server.js under a subpath, breaking the Dockerfile COPY.
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.178.61"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "eureka-lg",
  project: "eureka-nextjs-prod",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Upload a wider set of source maps for readable client stack traces.
  widenClientFileUpload: true,
  // Route events through our own domain so ad-blockers don't drop them.
  tunnelRoute: "/monitoring",
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
