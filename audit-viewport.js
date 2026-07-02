const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const outDir = 'C:\\Users\\dipak\\.geminiantigravity\\brain\\3b9f1a52-383a-45cd-8903-7ee34fc33f41\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Sample raw product database (Supabase table format)
const mockProductsRaw = [
  {
    id: "26ec14af-0daf-4dd5-aaf1-3dc2b44530a0",
    name: "Solitaire Diamond Ring",
    slug: "solitaire-diamond-ring",
    category: "Rings",
    price: 18500,
    compare_price: 23125,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"],
    size_options: ["10", "12", "14", "16"],
    colour_options: ["White Gold", "Yellow Gold", "Rose Gold"],
    description: "A timeless solitaire ring featuring a brilliant lab-grown diamond set in elegant white gold.",
    is_featured: true,
    is_active: true,
    stock_quantity: 5,
    weight_grams: 2.3,
    karat: "14K",
    metal_type: "White Gold",
    stone_type: "Lab Diamond"
  },
  {
    id: "e5ac1c5c-86d0-4b71-95ea-80d61763b3b1",
    name: "Tennis Diamond Bracelet",
    slug: "tennis-diamond-bracelet",
    category: "Bracelets",
    price: 42000,
    compare_price: 48000,
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80"],
    size_options: ["6.5\"", "7.0\"", "7.5\""],
    colour_options: ["Yellow Gold", "White Gold"],
    description: "An elegant line of brilliant-cut lab-grown diamonds set in 18K yellow gold.",
    is_featured: true,
    is_active: true,
    stock_quantity: 3,
    weight_grams: 6.5,
    karat: "18K",
    metal_type: "Yellow Gold",
    stone_type: "Lab Diamond"
  }
];

const mockReviewsRaw = [
  {
    id: "rev_1",
    product_id: "26ec14af-0daf-4dd5-aaf1-3dc2b44530a0",
    rating: 5,
    review_title: "Absolutely gorgeous",
    review_text: "The diamond has incredible sparkle, and the white gold band is perfect.",
    customer_name: "Sarah M.",
    is_approved: true,
    created_at: "2026-06-25T10:00:00Z"
  }
];

const mockProductsApi = mockProductsRaw.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  price: p.price,
  compare_price: p.compare_price,
  stock_quantity: p.stock_quantity,
  is_active: p.is_active,
  images: p.images
}));

const mockOrders = [
  {
    id: "ord_1",
    order_number: "IRA-2026-98712",
    customer_name: "John Doe",
    customer_email: "john.doe@example.com",
    customer_phone: "+91 98765 43210",
    created_at: "2026-07-02T10:15:30Z",
    total: 42199,
    payment_method: "cod",
    payment_status: "pending",
    status: "placed"
  },
  {
    id: "ord_2",
    order_number: "IRA-2026-98711",
    customer_name: "Jane Smith",
    customer_email: "jane.smith@example.com",
    customer_phone: "+91 99999 88888",
    created_at: "2026-07-01T15:30:00Z",
    total: 18500,
    payment_method: "razorpay",
    payment_status: "paid",
    status: "delivered"
  }
];

const token = {
  "access_token": "dummy-token",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "dummy-refresh",
  "user": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "admin@irajewels.com",
    "email_confirmed_at": "2026-06-01T00:00:00Z",
    "phone": "",
    "confirmed_at": "2026-06-01T00:00:00Z",
    "last_sign_in_at": "2026-06-01T00:00:00Z",
    "app_metadata": { "provider": "email" },
    "user_metadata": { "full_name": "Admin User" },
    "created_at": "2026-06-01T00:00:00Z",
    "updated_at": "2026-06-01T00:00:00Z"
  },
  "expires_at": 9999999999
};

const dbProductId = "26ec14af-0daf-4dd5-aaf1-3dc2b44530a0";

const cart = [
  {
    "productId": `${dbProductId}-default-default`,
    "id": dbProductId,
    "slug": "solitaire-diamond-ring",
    "name": "Solitaire Diamond Ring",
    "price": "₹18,500",
    "priceVal": 18500,
    "image": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    "selectedSize": null,
    "selectedColour": null,
    "quantity": 1
  }
];

const wishlist = [dbProductId];

const pages = [
  { name: '1-homepage', path: '/' },
  { name: '2-shop-products', path: '/shop' },
  { name: '3-product-detail', path: '/shop/solitaire-diamond-ring' },
  { name: '4-cart', path: '/cart' },
  { name: '5-checkout-online', path: '/checkout', action: async (page) => {
    // Select Pay Online if not selected by default
    await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const payOnlineDiv = divs.find(el => el.textContent.includes('Pay Online') && el.textContent.includes('UPI, Cards'));
      if (payOnlineDiv) payOnlineDiv.click();
    });
    await new Promise(r => setTimeout(r, 500));
  }},
  { name: '6-checkout-cod', path: '/checkout', action: async (page) => {
    // Select Cash on Delivery
    await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const codDiv = divs.find(el => el.textContent.includes('Cash on Delivery') && el.textContent.includes('Pay at your doorstep'));
      if (codDiv) codDiv.click();
    });
    await new Promise(r => setTimeout(r, 500));
  }},
  { name: '7-wishlist', path: '/wishlist' },
  { name: '8-account-login', path: '/account/login', clearAuth: true },
  { name: '9-account-register', path: '/account/register', clearAuth: true },
  { name: '10-account-dashboard', path: '/account' },
  { name: '11-admin-login', path: '/admin/login', clearAuth: true },
  { name: '12-admin-products-list', path: '/admin/products' },
  { name: '13-admin-add-product-form', path: '/admin/products/new' },
  { name: '14-admin-orders-list', path: '/admin/orders' },
  { name: '15-blog', path: '/blog' },
  { name: '16-offers', path: '/offers' },
  { name: '17-contact-us', path: '/contact' },
  { name: '18-about-us', path: '/about' },
  { name: '19-size-guide', path: '/size-guide' },
  { name: '20-care-instructions', path: '/care' },
  { name: '21-certificate-info', path: '/certificate' },
  { name: '22-learn', path: '/learn' },
  { name: '23-connect', path: '/connect' },
  { name: '24-custom-order', path: '/custom-order' },
  { name: '25-track-order', path: '/track-order' },
  { name: '26-mobile-menu', path: '/', action: async (page) => {
    // Click mobile menu open button
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Open menu"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800)); // wait for transition
  }}
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400'
};

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set Viewport to 375px width (small mobile)
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });

  // Enable request interception
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    const method = request.method();
    
    // Intercept Admin products API
    if (url.includes('/api/admin/products')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProductsApi)
      });
    }
    // Intercept Admin orders API
    else if (url.includes('/api/admin/orders')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrders)
      });
    }
    // Intercept Supabase products call
    else if (url.includes('supabase.co/rest/v1/products')) {
      if (method === 'OPTIONS') {
        request.respond({
          status: 200,
          headers: corsHeaders
        });
      } else {
        const isSingle = url.includes('slug=eq.');
        const responseBody = isSingle ? mockProductsRaw[0] : mockProductsRaw;
        request.respond({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify(responseBody)
        });
      }
    }
    // Intercept Supabase reviews call
    else if (url.includes('supabase.co/rest/v1/reviews')) {
      if (method === 'OPTIONS') {
        request.respond({
          status: 200,
          headers: corsHeaders
        });
      } else {
        request.respond({
          status: 200,
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify(mockReviewsRaw)
        });
      }
    }
    // Continue all other requests
    else {
      request.continue();
    }
  });

  for (const p of pages) {
    console.log(`Processing page: ${p.name} (${p.path})...`);
    
    // Inject auth token and mock storage state before loading document
    await page.evaluateOnNewDocument((p, token, cart, wishlist) => {
      if (p.clearAuth) {
        localStorage.removeItem("sb-vlfxeyrhbsftlxczlgrs-auth-token");
      } else {
        localStorage.setItem("sb-vlfxeyrhbsftlxczlgrs-auth-token", JSON.stringify(token));
      }
      localStorage.setItem("ira_jewels_cart", JSON.stringify(cart));
      localStorage.setItem("ira-wishlist", JSON.stringify(wishlist));
    }, p, token, cart, wishlist);

    try {
      await page.goto(`http://localhost:3001${p.path}`, { waitUntil: 'load', timeout: 30000 });
      
      // Wait for layout rendering and hydration
      await new Promise(r => setTimeout(r, 4000));

      if (p.action) {
        await p.action(page);
      }

      const imgPath = path.join(outDir, `${p.name}.png`);
      // Take fullPage screenshot to see all responsive issues down the page
      await page.screenshot({ path: imgPath, fullPage: true });
      console.log(`Saved screenshot to: ${imgPath}`);
    } catch (e) {
      console.error(`Error processing page ${p.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log("All screenshots taken successfully!");
})();
