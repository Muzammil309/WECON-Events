/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    const frameAncestors = process.env.ALLOWED_FRAME_ANCESTORS || "*";
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: `frame-ancestors ${frameAncestors}` },
          { key: "Access-Control-Allow-Origin", value: process.env.WORDPRESS_EMBED_ALLOWED_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With" }
        ]
      }
    ];
  }
};

export default nextConfig;
