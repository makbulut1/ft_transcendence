/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'cloudflare-ipfs.com'],
  },
  async redirects() {
    return [
      {
        source: '/black',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
