import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
