/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <== THÊM DÒNG NÀY ĐỂ TẠO THƯ MỤC "out"
  images: {
    unoptimized: true, // <== THÊM DÒNG NÀY để hình ảnh không bị lỗi khi deploy tĩnh
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;