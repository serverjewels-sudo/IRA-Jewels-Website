const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto('http://localhost:3001/shop/solitaire-diamond-ring', { waitUntil: 'networkidle0' });

    // Wait for the specific element to be in the DOM
    await page.waitForSelector('.contents');

    const getRects = await page.evaluate(() => {
      const cols = Array.from(document.querySelectorAll('.contents'));
      if (cols.length >= 2) {
        // filter children that are elements, since sometimes text nodes sneak in
        const leftChildren = Array.from(cols[0].children).filter(c => c.tagName === 'DIV');
        const rightChildren = Array.from(cols[1].children).filter(c => c.tagName === 'DIV');
        
        return { 
          leftCount: leftChildren.length,
          leftRects: leftChildren.map(c => c.getBoundingClientRect().top), 
          rightRects: rightChildren.map(c => c.getBoundingClientRect().top) 
        };
      }
      return null;
    });

    console.log('BEFORE WRAP:');
    if (!getRects) {
       console.log('Could not find the layout columns.');
    } else {
       console.log('Left Column Y positions:', getRects.leftRects);
    }
    
    await page.evaluate(() => {
      const cols = Array.from(document.querySelectorAll('.contents'));
      if (cols.length >= 2) {
        const rightChildren = Array.from(cols[1].children).filter(c => c.tagName === 'DIV');
        if (rightChildren.length > 0) {
          let wrapContainer = rightChildren[0].querySelector('.flex-wrap');
          if (!wrapContainer) {
             wrapContainer = document.createElement('div');
             wrapContainer.className = 'flex flex-wrap gap-3 mt-2';
             rightChildren[0].appendChild(wrapContainer);
          }
          for(let i=0; i<30; i++){
            const btn = document.createElement('button');
            btn.style.width = '100px';
            btn.style.height = '40px';
            btn.style.flexShrink = '0';
            btn.innerText = 'Extra';
            wrapContainer.appendChild(btn);
          }
        }
      }
    });
    
    await new Promise(r => setTimeout(r, 500));
    
    const getRectsAfter = await page.evaluate(() => {
      const cols = Array.from(document.querySelectorAll('.contents'));
      if (cols.length >= 2) {
        const leftChildren = Array.from(cols[0].children).filter(c => c.tagName === 'DIV');
        const rightChildren = Array.from(cols[1].children).filter(c => c.tagName === 'DIV');
        
        return { 
          leftRects: leftChildren.map(c => c.getBoundingClientRect().top), 
          rightRects: rightChildren.map(c => c.getBoundingClientRect().top) 
        };
      }
      return null;
    });
    
    console.log('\nAFTER WRAP:');
    if (!getRectsAfter) {
       console.log('Could not find the layout columns after wrap.');
    } else {
       console.log('Left Column Y positions:', getRectsAfter.leftRects);
    }
    
    await browser.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
