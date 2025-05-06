const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [
    /middleware-manifest\.json$/,
    /_buildManifest\.js$/,
    /_ssgManifest\.js$/,
  ],
  dynamicStartUrl: false,
});

// Base Next.js configuration
const baseConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
};

module.exports = withPWA(baseConfig);