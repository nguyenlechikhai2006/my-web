/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // THÊM DÒNG NÀY ĐỂ XUẤT FILE TĨNH
  images: {
    unoptimized: true, // Thêm dòng này vì 'output: export' không hỗ trợ tối ưu ảnh mặc định của Next.js
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