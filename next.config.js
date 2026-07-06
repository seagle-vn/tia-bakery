/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve these modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }
    return config;
  },
  // Suppress the warnings about these modules
  experimental: {
    esmExternals: 'loose',
  },
  // Redirects for old page routes to new single-page sections
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/#gallery',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/#about',
        permanent: false,
      },
      {
        source: '/faq',
        destination: '/#faq',
        permanent: false,
      },
      {
        source: '/checkout',
        destination: '/#quote',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
