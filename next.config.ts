import type { NextConfig } from "next";

// The backoffice stays at https://dev.layafood.com/. This site is served beside it.
const basePath = "/order";

const nextConfig: NextConfig = {
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "www.themealdb.com", pathname: "/images/ingredients/**" },
    ],
  },
};

export default nextConfig;
