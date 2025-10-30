/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['jzezbecvjquqxjnilvya.supabase.co'],
  },
  // ✅ IGNORA completamente a pasta backend
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/@aws-sdk/**',
        'node_modules/**/@next/swc/**',
        '**/backend/**', // ✅ IGNORA BACKEND
        '**/node_modules/pg/**', // ✅ IGNORA PostgreSQL
      ]
    },
  },
  // Ignora TODOS os erros durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desativa a verificação de tipos durante o build
  staticPageGenerationTimeout: 1000,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    // ✅ IGNORA módulos do backend
    config.externals = config.externals || [];
    config.externals.push('pg', 'pg-native', 'bcrypt');
    
    return config;
  },
}

module.exports = nextConfig

