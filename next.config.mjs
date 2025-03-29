/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zrlzmigtsxfhfhedkqzy.supabase.co',
        port: '', // Leave empty for default ports
        pathname: '/storage/v1/object/public/**', // Match all images in the public storage bucket
      },
    ],
  },
};

export default nextConfig;
