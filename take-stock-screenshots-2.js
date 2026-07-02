const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  const outDir = 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\ee82bad3-dc22-468e-a7a1-0dc807dc9dcb\\scratch';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log("Navigating to Diamond Jewellery Set product page...");
  await page.goto('http://localhost:3001/shop/diamond-jewellery-set', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: outDir + '\\diamond-jewellery-set.png' });
  console.log("Diamond Jewellery Set screenshot saved.");

  await browser.close();
})();
