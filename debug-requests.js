const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('request', req => {
    console.log(`[REQ] ${req.method()} ${req.url()}`);
  });

  page.on('requestfailed', req => {
    console.log(`[REQ FAILED] ${req.url()} - ${req.failure().errorText}`);
  });

  page.on('response', res => {
    console.log(`[RES] ${res.status()} ${res.url()}`);
  });

  console.log("Navigating to /shop/solitaire-diamond-ring...");
  await page.goto('http://localhost:3001/shop/solitaire-diamond-ring', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 4000));

  await browser.close();
})();
