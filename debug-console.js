const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER ERROR] ${err.toString()}`);
  });

  console.log("Navigating to /shop...");
  await page.goto('http://localhost:3001/shop', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  console.log("Navigating to /shop/solitaire-diamond-ring...");
  await page.goto('http://localhost:3001/shop/solitaire-diamond-ring', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
})();
