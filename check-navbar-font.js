const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Track font network requests and errors
  const networkLogs = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('font') || url.includes('.woff') || url.includes('.ttf')) {
      networkLogs.push({ url, status: 'pending' });
    }
  });

  page.on('requestfinished', request => {
    const url = request.url();
    const item = networkLogs.find(log => log.url === url);
    if (item) {
      item.status = 'loaded';
    }
  });

  page.on('requestfailed', request => {
    const url = request.url();
    const item = networkLogs.find(log => log.url === url);
    if (item) {
      item.status = 'failed';
      item.errorText = request.failure().errorText;
    }
  });

  try {
    // Navigate to the site
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Evaluate styles on the logo text
    const logoData = await page.evaluate(() => {
      // Find the logo text span (the one containing TATVAAN inside the header)
      const span = Array.from(document.querySelectorAll('header span')).find(el => el.textContent.trim() === 'TATVAAN');
      if (!span) return null;
      
      const computedStyle = window.getComputedStyle(span);
      
      // Let's also check if CSS variables are defined on the document element (html/body)
      const htmlStyle = window.getComputedStyle(document.documentElement);
      const fontCormorantVar = htmlStyle.getPropertyValue('--font-cormorant');
      const fontInterVar = htmlStyle.getPropertyValue('--font-inter');
      
      return {
        className: span.className,
        computedFontFamily: computedStyle.fontFamily,
        fontCormorantVar,
        fontInterVar,
      };
    });

    console.log('--- DIAGNOSTIC RESULTS ---');
    if (logoData) {
      console.log(`Computed Font Family: ${logoData.computedFontFamily}`);
      console.log(`Exact className: "${logoData.className}"`);
      console.log(`Document CSS Var --font-cormorant: "${logoData.fontCormorantVar}"`);
      console.log(`Document CSS Var --font-inter: "${logoData.fontInterVar}"`);
    } else {
      console.log('Navbar logo text element not found.');
    }

    console.log('\n--- FONT NETWORK REQUESTS ---');
    if (networkLogs.length === 0) {
      console.log('No font network requests captured. (Fonts might be cached or embedded inline)');
    } else {
      networkLogs.forEach(log => {
        console.log(`URL: ${log.url} -> Status: ${log.status} ${log.errorText ? '(' + log.errorText + ')' : ''}`);
      });
    }

  } catch (error) {
    console.error('Error during execution:', error.message);
  } finally {
    await browser.close();
  }
})();
