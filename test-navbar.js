const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set a standard viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to http://localhost:3000 ...');
  let success = false;
  for (let i = 0; i < 12; i++) {
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
      success = true;
      break;
    } catch (e) {
      console.log(`Attempt ${i+1} failed, retrying in 5s...`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  if (!success) {
    console.log('Error navigating, dev server not ready.');
    await browser.close();
    process.exit(1);
  }

  // Helper to get element position
  const getPositions = await page.evaluate(() => {
    // Attempt to find the logo
    // Based on typical Next.js apps, we might look for text "TATVAAN"
    const elements = Array.from(document.querySelectorAll('*'));
    
    let logo = null;
    let shopLink = null;
    let banner = null;
    
    for (const el of elements) {
      if (el.textContent && el.textContent.trim() === 'TATVAAN' && !logo) {
        logo = el;
      }
      if (el.textContent && el.textContent.trim() === 'Shop' && !shopLink) {
        // Need to make sure it's actually in the nav, but first match might be okay if it's the header
        shopLink = el;
      }
      if (el.textContent && el.textContent.toLowerCase().includes('free shipping') && !banner) {
          banner = el;
      }
    }

    return {
      logo: logo ? logo.getBoundingClientRect().toJSON() : null,
      shopLink: shopLink ? shopLink.getBoundingClientRect().toJSON() : null,
      banner: banner ? banner.getBoundingClientRect().toJSON() : null,
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
      windowScrollY: window.scrollY
    };
  });

  console.log('--- BEFORE SCROLL ---');
  console.log('Logo:', getPositions.logo);
  console.log('Shop Link:', getPositions.shopLink);
  console.log('Banner:', getPositions.banner);
  console.log('Scrollbar width:', getPositions.scrollbarWidth);
  console.log('ScrollY:', getPositions.windowScrollY);

  // Scroll to exactly 60px
  console.log('\nScrolling to 60px...');
  await page.evaluate(() => {
    window.scrollTo(0, 60);
  });
  
  // Wait for any animations/transitions
  await new Promise(r => setTimeout(r, 500));

  const getPositionsAfter = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    let logo = null;
    let shopLink = null;
    let banner = null;
    
    for (const el of elements) {
      if (el.textContent && el.textContent.trim() === 'TATVAAN' && !logo) {
        logo = el;
      }
      if (el.textContent && el.textContent.trim() === 'Shop' && !shopLink) {
        shopLink = el;
      }
      if (el.textContent && el.textContent.toLowerCase().includes('free shipping') && !banner) {
          banner = el;
      }
    }

    return {
      logo: logo ? logo.getBoundingClientRect().toJSON() : null,
      shopLink: shopLink ? shopLink.getBoundingClientRect().toJSON() : null,
      banner: banner ? banner.getBoundingClientRect().toJSON() : null,
      scrollbarWidth: window.innerWidth - document.documentElement.clientWidth,
      windowScrollY: window.scrollY
    };
  });

  console.log('\n--- AFTER SCROLL ---');
  console.log('Logo:', getPositionsAfter.logo);
  console.log('Shop Link:', getPositionsAfter.shopLink);
  console.log('Banner:', getPositionsAfter.banner);
  console.log('Scrollbar width:', getPositionsAfter.scrollbarWidth);
  console.log('ScrollY:', getPositionsAfter.windowScrollY);

  if (getPositions.logo && getPositionsAfter.logo) {
    console.log('\n--- ANALYSIS ---');
    console.log(`Logo Y shifted by: ${getPositionsAfter.logo.y - getPositions.logo.y}px`);
    console.log(`Shop Link Y shifted by: ${getPositionsAfter.shopLink ? getPositionsAfter.shopLink.y - getPositions.shopLink.y : 'N/A'}px`);
  }

  await browser.close();
})();
