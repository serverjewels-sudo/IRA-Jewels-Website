const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for a desktop layout
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to home page for footer screenshot...");
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle0' });
  
  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  // Wait a bit for any animations
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\a2d1aed2-4c50-4b63-89b9-b0d1051f6f99\\footer-screenshot.png' });
  console.log("Footer screenshot saved.");

  console.log("Navigating to order confirmed page...");
  await page.goto('http://localhost:3001/order-confirmed/test', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\a2d1aed2-4c50-4b63-89b9-b0d1051f6f99\\order-confirmed-screenshot.png' });
  console.log("Order confirmed screenshot saved.");

  await browser.close();
})();
