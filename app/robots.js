export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/cart',
        '/checkout',
        '/account',
        '/wishlist',
        '/order-confirmed',
        '/api',
      ],
    },
    sitemap: 'https://www.tatvaan.com/sitemap.xml',
  }
}
