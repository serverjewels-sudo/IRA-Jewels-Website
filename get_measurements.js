const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/shop/solitaire-diamond-ring', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const measurements = await page.evaluate(() => {
    let divs = Array.from(document.querySelectorAll('div'));
    
    // Size Box
    let sizeBox = divs.find(d => d.innerText && d.innerText.includes('SELECT SIZE:') && d.className.includes('w-fit'));
    // Karat Box
    let karatBox = divs.find(d => d.innerText && d.innerText.includes('KARAT:') && d.className.includes('w-fit'));
    // Engraving Box
    let engravingBox = divs.find(d => d.innerText && d.innerText.includes('Engraving') && d.className.includes('w-fit'));
    
    // Also get the link
    let link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Size Guide'));
    // And get the buttons
    let sizeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('SELECT SIZE'));

    const getMetrics = (el) => {
      if (!el) return null;
      return el.getBoundingClientRect().height;
    };

    return {
      sizeBoxHeight: getMetrics(sizeBox),
      karatBoxHeight: getMetrics(karatBox),
      engravingBoxHeight: getMetrics(engravingBox),
      sizeGuideLinkHeight: getMetrics(link),
      sizeBtnHeight: getMetrics(sizeBtn),
    };
  });

  console.log(JSON.stringify(measurements, null, 2));
  await browser.close();
})();
