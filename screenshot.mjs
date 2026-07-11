import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    console.log('Navigating to http://127.0.0.1:3002');
    // Increase timeout since Next.js dev server can take time on first compile
    await page.goto('http://127.0.0.1:3002', { waitUntil: 'networkidle2', timeout: 60000 });
    
    const widths = [375, 768, 1024, 1440, 1920];
    const outDir = 'C:/Users/dipak/.gemini/antigravity/brain/20a78ac9-7957-4074-a31c-7a075e57eaa4';
    
    for (const width of widths) {
      console.log(`Taking screenshot for width ${width}`);
      await page.setViewport({ width, height: 1080 });
      
      const footer = await page.$('footer');
      if (footer) {
        await page.evaluate(el => el.scrollIntoView(), footer);
        await new Promise(r => setTimeout(r, 1000));
        await footer.screenshot({ path: path.join(outDir, `footer_${width}.png`) });
      } else {
        console.log(`Footer not found at width ${width}`);
      }
    }
    
    await browser.close();
    console.log('Screenshots done');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
