/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@raina/ui", "@raina/api-contracts", "@raina/shared-types"],
  typedRoutes: true
};

export default nextConfig;
