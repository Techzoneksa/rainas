/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  transpilePackages: ["@raina/ui", "@raina/api-contracts", "@raina/shared-types"],
  typedRoutes: true
};

export default nextConfig;
