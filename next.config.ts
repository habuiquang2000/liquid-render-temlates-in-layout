import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.html$/i,
      loader: "html-loader",
    });
    config.module.rules.push({
      test: /\.liquid$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: [
        {
          loader: 'html-loader',
          options: {
            minimize: false,
            // TUYỆT ĐỐI TẮT xử lý src/href… để bundler không "require" hình
            sources: false,
            // Đảm bảo xuất CommonJS, tránh esModule import quirks
            esModule: false,
          }
        }
      ]
    });

    return config;
  },
};

export default nextConfig;
