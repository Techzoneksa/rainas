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
  typedRoutes: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-raina.promksa.com/api/v1"
  }
};

export default nextConfig;
