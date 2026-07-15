const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 1200 });
  await page.goto('http://localhost:3000/shop/solitaire-diamond-ring', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000)); // allow time for images and fonts to load

  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\c9dc925b-236a-4e3c-b2fe-ff2898c3f029\\layout.png', fullPage: true });

  await browser.close();
  console.log("Screenshot taken.");
})();
