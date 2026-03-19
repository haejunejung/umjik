import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath: process.env.DOCS_BASE_PATH || '',
  typescript: {
    // React 18 types from monorepo root conflict with Next.js 15's React 19 types.
    // Runtime behavior is unaffected — skip type checking during build.
    ignoreBuildErrors: true,
  },
};

export default withMDX(config);
