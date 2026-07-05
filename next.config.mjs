/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracing: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'vlfxeyrhbsftlxczlgrs.supabase.co' },
    ]
  }
};

export default nextConfig;
