/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    useFormStatus: true,
  },
};

module.exports = nextConfig;
