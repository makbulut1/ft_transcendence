/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'cloudflare-ipfs.com',
      'cdn.intra.42.fr',

    ],
  },
  async redirects() {
    return [
      {
        source: '/black',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
