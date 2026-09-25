import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Self-contained server output (server.js + only the node_modules it
  // actually needs) — this is what the production Docker image copies.
  // Only enabled for that build (Dockerfile sets DOCKER_BUILD=1): with
  // it always on, the bare-metal PM2 deployment's `next start` prints
  // a "does not work with output: standalone" warning on every boot,
  // even though it runs fine either way.
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
  // Strip the X-Powered-By: Next.js header from responses.
  poweredByHeader: false,
  // Enable gzip on the built-in server; on Vercel/edge this is a no-op
  // but locally it shaves response size.
  compress: true,
  // Only tree-shake at the barrel level for the two heaviest UI deps.
  // lucide-react and framer-motion both re-export hundreds of symbols;
  // this cuts the shipped client bundle noticeably without changing
  // any authoring surface.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
