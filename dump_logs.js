const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  await page.goto('http://localhost:5173');
  console.log("Navigated to page");

  // Wait for the start button
  await page.waitForSelector('button');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => b.textContent.includes('Start Game') || b.textContent.includes('MULAI') || b.textContent.includes('Mulai'));
    if (startBtn) startBtn.click();
  });
  console.log("Clicked start button");

  await page.waitForTimeout(3000);
  console.log("Pressing SPACE to open CCTV...");
  // Press space to trigger CCTV
  await page.keyboard.press('Space');
  
  await page.waitForTimeout(5000); // Wait for capture to happen

  await browser.close();
})();
