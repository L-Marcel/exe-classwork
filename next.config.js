module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{
          key: "X-DNS-Prefetch-Control",
          value: "on"
        }]
      }
    ]
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      runtime: 'experimental-edge'
    };
    return config;
  },
  i18n: {
    locales: ["en-US", "pt-BR"],
    defaultLocale: "en-US",
  }
}
