const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for a desktop layout
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to customer login page...");
  await page.goto('http://localhost:3001/account/login', { waitUntil: 'networkidle0' });
  
  // Wait a bit for any animations
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\26fc892d-1fee-4d87-9177-1e7bf005bf6b\\login-page.png' });
  console.log("Login page screenshot saved.");

  console.log("Clicking Forgot Password link...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Forgot Password?'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\26fc892d-1fee-4d87-9177-1e7bf005bf6b\\forgot-pwd-form.png' });
  console.log("Forgot password form screenshot saved.");

  console.log("Navigating to customer reset password page...");
  await page.goto('http://localhost:3001/account/reset-password', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'C:\\Users\\dipak\\.gemini\\antigravity\\brain\\26fc892d-1fee-4d87-9177-1e7bf005bf6b\\reset-pwd-page.png' });
  console.log("Reset password page screenshot saved.");

  await browser.close();
})();
