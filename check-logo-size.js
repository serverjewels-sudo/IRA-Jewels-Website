const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to any page that has the footer, e.g., the homepage or track-order page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Select the logo image inside the footer
    const imgSize = await page.evaluate(() => {
      const img = document.querySelector('footer img[alt="TATVAAN"]');
      if (!img) return null;
      
      const rect = img.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(img);
      const parentStyle = window.getComputedStyle(img.parentElement);
      
      return {
        width: rect.width,
        height: rect.height,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        objectFit: computedStyle.objectFit,
        aspectRatio: computedStyle.aspectRatio,
        parentFlexDirection: parentStyle.flexDirection,
        parentAlignItems: parentStyle.alignItems,
      };
    });

    if (imgSize) {
      console.log('--- DIAGNOSTIC RESULTS ---');
      console.log(`Rendered Width: ${imgSize.width}px`);
      console.log(`Rendered Height: ${imgSize.height}px`);
      console.log(`Natural Image Size: ${imgSize.naturalWidth}x${imgSize.naturalHeight}`);
      console.log(`Computed object-fit: ${imgSize.objectFit}`);
      console.log(`Parent flex-direction: ${imgSize.parentFlexDirection}`);
      console.log(`Parent align-items: ${imgSize.parentAlignItems}`);
    } else {
      console.log('Logo image not found in the footer.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
