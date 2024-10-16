/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
          {
            source: '/api/:path*',
            destination:
              process.env.NODE_ENV === 'development'
                ? 'http://127.0.0.1:8000/:path*'
                : '/api/',
          },
        ]
      },

    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }
      return config;
    },
};

export default nextConfig;
