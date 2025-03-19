/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",  // Enables static export
  images: {
    unoptimized: true,  // Required if using Next.js Image component
  },
  trailingSlash: true,  // Helps with correct routing on Netlify
  productionBrowserSourceMaps: false,
};

export default nextConfig;
