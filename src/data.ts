/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Review, PromoCode } from './types';

export const METALS = [
  { name: '18K Yellow Gold', colorClass: 'bg-[#E5D3B3] border-amber-400' },
  { name: '18K White Gold', colorClass: 'bg-[#EAEAEA] border-gray-300' },
  { name: '18K Rose Gold', colorClass: 'bg-[#ECC4BC] border-rose-300' },
  { name: 'Platinum', colorClass: 'bg-[#F4F4F6] border-zinc-200' },
  { name: '22K Traditional Yellow Gold', colorClass: 'bg-[#DAA520] border-amber-550' }
];

export const RING_SIZES = ['10', '11', '12', '13', '14', '15', '16']; // Indian Ring Sizing Standards

export const PRODUCTS: Product[] = [
  // ==================== CATEGORY 1: RINGS ====================
  {
    id: 'ananya-solitaire-diamond-ring',
    name: 'Ananya Solitaire Diamond Ring',
    category: 'Rings',
    categorySlug: 'rings',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'A magnificent solitaire diamond ring that acts as a beacon of commitment. Crafted inside our Mumbai atelier using standard conflict-free settings, this jewel captures light with high internal dispersion.',
    materials: ['Solitaire Brilliant Cut Diamond (1.20 Carats)', '18K Solid Gold / Joint settings', 'Clarity: VS1', 'Color: F'],
    details: ['Artisan-cast prongs', 'Individually GIA certified solitaire center-stone', 'BIS Hallmark Registered', 'Lifetime complimentary polishing'],
    care: 'Clean using warm dilute soapy water and a soft-bristle brush. Avoid direct contact with abrasive chemicals.',
    rating: 5.0,
    reviewsCount: 38,
    options: { metals: ['18K Yellow Gold', '18K White Gold', 'Platinum'], sizes: RING_SIZES },
    inStock: true,
    featured: true,
    bestseller: true,
    sku: 'LL-RNG-ANA-01'
  },
  {
    id: 'meera-ruby-cocktail-ring',
    name: 'Meera Ruby Cocktail Ring',
    category: 'Rings',
    categorySlug: 'rings',
    price: 245000,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1596568300556-a3b68c9c5b4e?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Centering an exceptional cushion-cut ruby of intense royal red tones, accented by magnificent concentric gold elements.',
    materials: ['Zambian Ruby (1.50 Carats)', '18K Pure Yellow Gold band'],
    details: ['Ethically sourced natural ruby', 'BIS Dual Hallmarked', 'Comes in silk interior box packaging'],
    care: 'Protect rubies from severe friction, steam extraction, or thermal changes.',
    rating: 5.0,
    reviewsCount: 22,
    options: { metals: ['18K Yellow Gold', '18K White Gold'], sizes: RING_SIZES },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-RNG-MEE-02'
  },
  // ==================== CATEGORY 2: EARRINGS ====================
  {
    id: 'sona-gold-jhumka-drops',
    name: 'Sona Gold Jhumka Drops',
    category: 'Earrings',
    categorySlug: 'earrings',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Classic heritage jhumka drops styled in solid gold with elaborate Indian bridal engravings.',
    materials: ['22K Traditional Yellow Gold', 'Floral filigree accents'],
    details: ['Handmade by Jaipur artisans', 'BIS 916 Hallmark certified', 'Symmetric hanging tier design'],
    care: 'Wipe with soft chamois cloth. Store in individual separate dry compartments.',
    rating: 5.0,
    reviewsCount: 45,
    options: { metals: ['22K Traditional Yellow Gold'] },
    inStock: true,
    featured: true,
    bestseller: true,
    sku: 'LL-EAR-SON-01'
  },
  {
    id: 'tara-diamond-chandbali',
    name: 'Tara Diamond Chandbali',
    category: 'Earrings',
    categorySlug: 'earrings',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Moon-shaped chandeliers of exquisite design set with selected brilliant diamonds and drop pearls.',
    materials: ['Brilliant Diamonds (0.75 Carat total)', '18K Gold frame', 'Selected seed pearls'],
    details: ['Secure push back posts', 'GIA & IGI certifications', 'Velvet gift wrap included'],
    care: 'Gently wipe after use. Clean with mild velvet puff.',
    rating: 5.0,
    reviewsCount: 15,
    options: { metals: ['18K Yellow Gold', '18K Rose Gold'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-EAR-TAR-02'
  },
  // ==================== CATEGORY 3: PENDANTS ====================
  {
    id: 'pari-diamond-solitaire-pendant',
    name: 'Pari Diamond Solitaire Pendant',
    category: 'Pendants',
    categorySlug: 'pendants',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1626784215021-2e39cb3de415?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'An elegant solitaire pendant featuring a singular pure brilliant cut conflict-free diamond.',
    materials: ['Solitaire Diamond (0.80 Carats)', '18K White Gold Chain'],
    details: ['Fluid loop clasp', 'Adjustable 16-18 inch chain length', 'BIS registered hallmark stamp'],
    care: 'Gently wipe with soft cloth. Avoid direct soap exposure.',
    rating: 5.0,
    reviewsCount: 19,
    options: { metals: ['18K Yellow Gold', '18K White Gold', 'Platinum'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-PDT-PAR-01'
  },
  {
    id: 'noor-emerald-drop-pendant',
    name: 'Noor Emerald Drop Pendant',
    category: 'Pendants',
    categorySlug: 'pendants',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Stunning drop design featuring a mesmerizing deep green Columbian emerald.',
    materials: ['Columbian Drop Emerald (1.20 Carats)', 'Dual diamond accents', '18K Rose Gold chain'],
    details: ['Secure loop bail', 'Certificate of gem origin', 'Atelier branded leather box'],
    care: 'Keep emeralds isolated and flat. Avoid high pressure washing.',
    rating: 5.0,
    reviewsCount: 31,
    options: { metals: ['18K Yellow Gold', '18K Rose Gold'] },
    inStock: true,
    featured: true,
    bestseller: true,
    sku: 'LL-PDT-NOO-02'
  },
  // ==================== CATEGORY 4: NECKLACES ====================
  {
    id: 'rani-plain-gold-haar',
    name: 'Rani Plain Gold Haar',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    price: 285000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Traditional solid gold rani haar crafted in pure gold without stones for an eternal minimal shine.',
    materials: ['22K pure yellow gold', 'Traditional woven thread back lock'],
    details: ['Heavy high density feel', 'BIS 916 Hallmark stamp', 'Jaipur Royal collection'],
    care: 'Wipe with soft warm flannel cloth. Avoid harsh scrubbing.',
    rating: 5.0,
    reviewsCount: 27,
    options: { metals: ['22K Traditional Yellow Gold'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-NKL-RAN-01'
  },
  {
    id: 'devika-simple-gold-chain',
    name: 'Devika Simple Gold Chain',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1611085583191-a3f181a8c9e1?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3f181a8c9e1?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Dainty daily wear standard gold chain designed with smooth flexible joints.',
    materials: ['18K solid yellow gold', 'Comfort lock clasp'],
    details: ['Durable weave', 'Perfect for lightweight pendants', 'Complimentary replacement plan'],
    care: 'Excellent for daily water exposure. Remove before sleeping to prevent entanglement.',
    rating: 5.0,
    reviewsCount: 52,
    options: { metals: ['18K Yellow Gold', '18K Rose Gold', '18K White Gold'] },
    inStock: true,
    featured: true,
    bestseller: true,
    sku: 'LL-NKL-DEV-02'
  },
  // ==================== CATEGORY 5: BANGLES ====================
  {
    id: 'puja-22k-gold-bangle-set',
    name: 'Puja 22K Gold Bangle Set',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Traditional heavy gold bangles set of 2 in premium gold with traditional Indian carvings.',
    materials: ['22K Solid Yellow Gold', 'Hand chiselled carvings'],
    details: ['Standard 2.4 / 2.6 size range', 'Certified BIS 916', 'Royal heritage engraving'],
    care: 'Clean with warm tap water without chemicals.',
    rating: 5.0,
    reviewsCount: 16,
    options: { metals: ['22K Traditional Yellow Gold'], sizes: ['2.4', '2.6', '2.8'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-BGL-PUJ-01'
  },
  {
    id: 'suvarni-diamond-bangle-pair',
    name: 'Suvarni Diamond Bangle Pair',
    category: 'Bangles',
    categorySlug: 'bangles',
    price: 285000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Ultra luxurious pairing of dual diamond eternity bangles crafted to capture maximum luxury.',
    materials: ['Selected brilliant cut diamonds (3.40 Carats cumulative)', '18K Gold Frame'],
    details: ['Dual hinges, safety catch pins', 'GIA diamond report files', 'BIS hallmarked gold metal'],
    care: 'Gently wipe and clean. Protect from hard impacts.',
    rating: 5.0,
    reviewsCount: 10,
    options: { metals: ['18K Yellow Gold', '18K White Gold'], sizes: ['2.4', '2.6'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-BGL-SUV-02'
  },
  // ==================== CATEGORY 6: BRACELETS ====================
  {
    id: 'shakti-diamond-tennis-bracelet',
    name: 'Shakti Diamond Tennis Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'An elegant brilliant-cut diamond tennis bracelet offering fluid wrist movement and timeless luxury style.',
    materials: ['Eternity micro diamonds (2.50 Carats)', '18K Solid Gold / Joint settings'],
    details: ['Invisible box clasp with dual clip safety', 'Symmetric basket settings', 'BIS Hallmark approved'],
    care: 'Gently wash with soapy water, wipe with chamois cloth.',
    rating: 5.0,
    reviewsCount: 23,
    options: { metals: ['18K Yellow Gold', '18K White Gold', 'Platinum'] },
    inStock: true,
    featured: true,
    bestseller: true,
    sku: 'LL-BRC-SHA-01'
  },
  {
    id: 'amara-sapphire-gold-bracelet',
    name: 'Amara Sapphire Gold Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'A brilliant contemporary line bracelet featuring alternation of vibrant sapphires and delicate gold links.',
    materials: ['Vibrant Royal Blue Sapphires (1.80 Carats)', '18K Solid Yellow Gold link'],
    details: ['Comfort-fit dynamic hinges', 'Origin Authenticed gems', 'LuxeLoom certification cards'],
    care: 'Store in protective felt pouch. Hand clean in moderate lukewarm water.',
    rating: 5.0,
    reviewsCount: 14,
    options: { metals: ['18K Yellow Gold', '18K White Gold'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-BRC-AMA-02'
  },
  // ==================== CATEGORY 7: NOSEPINS ====================
  {
    id: 'bindiya-diamond-nosepin',
    name: 'Bindiya Diamond Nosepin',
    category: 'Nosepins',
    categorySlug: 'nosepins',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Dainty diamond nosepin in standard screw style suitable for everyday traditional grandeur.',
    materials: ['Single Brilliant Solitaire Diamond (0.15 Carat)', '18K Solid Gold wire'],
    details: ['BIS Hallmark stamped', 'IGI clarity certified solitaire', 'Humble floral motif casing'],
    care: 'Wipe with sanitized cotton tips. Handle screw clasp carefully.',
    rating: 5.0,
    reviewsCount: 68,
    options: { metals: ['18K Yellow Gold', '18K White Gold', '18K Rose Gold'] },
    inStock: true,
    featured: true,
    bestseller: true,
    sku: 'LL-NSP-BIN-01'
  },
  {
    id: 'aarti-pearl-nath-nosepin',
    name: 'Aarti Pearl Nath Nosepin',
    category: 'Nosepins',
    categorySlug: 'nosepins',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=600&h=600',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=600&h=600',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600&h=600'
    ],
    description: 'Bridal traditional pearl nath featuring a beautiful gold ring set with selected seed pearls.',
    materials: ['Basra Pearls', '18K Yellow Gold wire frame'],
    details: ['Detachable delicate gold side chain', 'Handcrafted detailing', 'Signature secure hoop lock'],
    care: 'Avoid heavy wetting. Clean with pure velvet towel.',
    rating: 5.0,
    reviewsCount: 11,
    options: { metals: ['18K Yellow Gold', '22K Traditional Yellow Gold'] },
    inStock: true,
    featured: true,
    bestseller: false,
    sku: 'LL-NSP-AAR-02'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Priya Sharma, Mumbai',
    rating: 5,
    comment: 'The craftsmanship is unmatched. My Ananya ring gets compliments everywhere I go.',
    date: '2026-04-12',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Deepika Agarwal, Delhi',
    rating: 5,
    comment: 'Received my bridal set in perfect packaging. The BIS hallmark gives so much confidence.',
    date: '2026-05-20',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Neha Patel, Surat',
    rating: 5,
    comment: 'Ordered for my daughter\'s engagement. The quality is truly luxury-grade.',
    date: '2026-05-29',
    verified: true
  }
];

export const PROMO_CODES: PromoCode[] = [
  { code: 'LUXELOOM10', discountType: 'percentage', value: 10 },
  { code: 'GOLDENGIFT', discountType: 'fixed', value: 25000 },
  { code: 'WELCOME15', discountType: 'percentage', value: 15 }
];

export const STORIES = [
  {
    title: 'The Golden Thread of Jaipur & Antwerp',
    content: 'Our diamonds and emeralds are ethically selected by our master gemologists immediately at source points in Surat, Jaipur, and Antwerp. Only 1% of the world’s conflict-free stones ever pass our criteria.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=600&fit=crop&q=80'
  },
  {
    title: 'Inherited Artistry, Reimagined Forever',
    content: 'Using ancient fire-casting and Meenakari hand-enameling methods preserved across generations in Jaipur, we merge vintage Indian heritage with revolutionary software rendering to create pieces engineered to turn into life-long family heirlooms.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop&q=80'
  }
];
