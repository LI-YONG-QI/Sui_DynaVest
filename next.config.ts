import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cryptologos.cc",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // 在構建過程中不檢查生成的文件
    ignoreDuringBuilds: true,
    // 或者，只檢查特定目錄
    // dirs: ['app', 'components', 'lib', 'hooks', 'types', 'utils']
  },
};

export default nextConfig;
