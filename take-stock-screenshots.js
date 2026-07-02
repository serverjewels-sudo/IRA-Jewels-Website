const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  const outDir = 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\ee82bad3-dc22-468e-a7a1-0dc807dc9dcb\\scratch';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log("Navigating to shop page for Product Card screenshot...");
  await page.goto('http://localhost:3001/shop', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: outDir + '\\product-card.png' });
  console.log("Product Card screenshot saved.");

  console.log("Navigating to out-of-stock product page...");
  await page.goto('http://localhost:3001/shop/solitaire-diamond-ring', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: outDir + '\\out-of-stock.png' });
  console.log("Out of stock screenshot saved.");

  console.log("Navigating to low-stock product page...");
  await page.goto('http://localhost:3001/shop/tennis-diamond-bracelet', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: outDir + '\\low-stock.png' });
  console.log("Low stock screenshot saved.");

  await browser.close();
})();
