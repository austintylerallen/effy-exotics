/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ─── hide the “building…” indicator ─────────────────────────────────
  devIndicators: {
    buildActivity: false,
  },

  // ─── tweak webpack dev middleware to disable polling ─────────────────
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      // keep your existing watchOptions (if any), but turn off polling
      ...(config.watchOptions || {}),
      aggregateTimeout: 200,
      poll: false,
    };
    return config;
  },
};

export default nextConfig;
