/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiBase = process.env.PHP_API_URL || 'http://localhost/radio-escolar';
    return [
      { source: '/api/:path*', destination: `${apiBase}/api/:path*` },
    ];
  },
};
module.exports = nextConfig;
