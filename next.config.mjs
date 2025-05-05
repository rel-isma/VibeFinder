/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static exports
  },
  output: 'export', // Add this line for static generation
  trailingSlash: true, // Recommended for static exports
}

export default nextConfig