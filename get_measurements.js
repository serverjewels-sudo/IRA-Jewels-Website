const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:3000/shop/solitaire-diamond-ring', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  const measurements = await page.evaluate(() => {
    let divs = Array.from(document.querySelectorAll('div'));
    
    // Size Box
    let sizeBox = divs.find(d => d.innerText && d.innerText.includes('SELECT SIZE:') && d.className.includes('w-fit'));
    // Karat Box
    let karatBox = divs.find(d => d.innerText && d.innerText.includes('KARAT:') && d.className.includes('w-fit'));
    // Engraving Box
    let engravingBox = divs.find(d => d.innerText && d.innerText.toUpperCase().includes('ENGRAVING') && d.className.includes('w-fit'));
    
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
      sizeBoxHtml: sizeBox ? sizeBox.outerHTML.substring(0, 150) : null,
      karatBoxHtml: karatBox ? karatBox.outerHTML.substring(0, 150) : null,
      engravingBoxHtml: engravingBox ? engravingBox.outerHTML.substring(0, 200) : null,
    };
  });

  console.log(JSON.stringify(measurements, null, 2));
  await browser.close();
})();
