const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to preview page...");
  await page.goto('http://localhost:3001/preview-admins', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Hide the modal for the first screenshot
  await page.evaluate(() => {
    document.getElementById('delete-modal').style.display = 'none';
  });
  await new Promise(r => setTimeout(r, 200));

  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\791fffd0-5d2f-40b6-a253-335bc5b7d02d\\admins-page-with-both-buttons.png' });
  console.log("Admins page with both buttons saved.");

  // Show the modal for the second screenshot
  await page.evaluate(() => {
    document.getElementById('delete-modal').style.display = 'flex';
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\791fffd0-5d2f-40b6-a253-335bc5b7d02d\\admins-delete-account-modal.png' });
  console.log("Delete modal screenshot saved.");

  await browser.close();
})();
