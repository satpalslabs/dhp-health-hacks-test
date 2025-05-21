import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  webpack(config) {
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