import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://www.tatvaan.com';

  // 1. Static pages
  const staticPages = [
    '',
    '/shop',
    '/offers',
    '/blog',
    '/about',
    '/about-tatvaan',
    '/our-craft',
    '/why-tatvaan',
    '/contact',
    '/custom-order',
    '/track-order',
    '/size-guide',
    '/care',
    '/certificate',
    '/learn',
    '/connect',
    '/faq',
    '/privacy-policy',
    '/terms-and-conditions',
    '/return-refund-policy'
  ];

  const staticEntries = staticPages.map((route) => {
    let priority = 0.5;
    let changeFrequency = 'monthly';

    if (route === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/shop') {
      priority = 0.9;
      changeFrequency = 'daily';
    } else if (['/offers', '/blog'].includes(route)) {
      priority = 0.8;
      changeFrequency = 'weekly';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  // 2. Dynamic Product Pages
  let productEntries = [];
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('slug, updated_at, created_at')
      .eq('is_active', true);

    if (!error && products) {
      productEntries = products.map((product) => ({
        url: `${baseUrl}/shop/${product.slug}`,
        lastModified: product.updated_at 
          ? new Date(product.updated_at) 
          : (product.created_at ? new Date(product.created_at) : new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else if (error) {
      console.error("Failed to fetch products for sitemap:", error);
    }
  } catch (err) {
    console.error("Unexpected error fetching products for sitemap:", err);
  }

  return [...staticEntries, ...productEntries];
}
