/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
    domains: [
        // Replace with your Supabase project URL
      'images.unsplash.com'
    ]
  },
  trailingSlash: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
