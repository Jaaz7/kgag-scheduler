const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@refinedev/antd"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@': path.resolve(__dirname, 'src')
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
};

module.exports = nextConfig;
