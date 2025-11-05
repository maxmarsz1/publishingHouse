import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

};

// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
  async redirects() {
    return [
      {
        source: '/',
        destination: '/myspace',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
