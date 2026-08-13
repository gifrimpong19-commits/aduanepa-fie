const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshots() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1.5 });

  const baseUrl = 'https://aduanepa-fie.vercel.app';
  console.log('Navigating to:', baseUrl);

  // 1. Capture Homepage (Customer Mode)
  console.log('Capturing Homepage...');
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });
  await page.waitForTimeout ? page.waitForTimeout(2000) : new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, 'homepage.png'), fullPage: false });

  // 2. Capture Vendor Hub
  console.log('Capturing Vendor Hub...');
  // Click on "Vendor Hub" role button in navbar
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const vendorBtn = buttons.find(b => b.textContent && b.textContent.includes('Vendor Hub'));
    if (vendorBtn) vendorBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenshotsDir, 'vendor.png'), fullPage: false });

  // 3. Capture Rider Fleet
  console.log('Capturing Rider Fleet...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const riderBtn = buttons.find(b => b.textContent && b.textContent.includes('Rider Fleet'));
    if (riderBtn) riderBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenshotsDir, 'rider.png'), fullPage: false });

  // 4. Capture Admin Dashboard
  console.log('Capturing Super Admin Dashboard...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const adminBtn = buttons.find(b => b.textContent && b.textContent.includes('Admin Ops'));
    if (adminBtn) adminBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenshotsDir, 'admin.png'), fullPage: false });

  console.log('All screenshots captured successfully in /screenshots!');
  await browser.close();
}

captureScreenshots().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
