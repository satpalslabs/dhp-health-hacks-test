import type { NextConfig } from "next";
const { version } = require('./package.json');

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true, // enable source maps in prod
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  images: {
    domains: ["img.youtube.com", "storage.googleapis.com"],

  },
  /* config options here */
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      config.devtool = 'source-map'; // emit source maps in development
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverActions: {
      bodySizeLimit: '50mb' // Increased from 2mb to 50mb
    },
  },
  async redirects() {
    return [{
      destination: "/articles",
      source: "/",
      permanent: true,
    }]
  },
};

export default nextConfig;