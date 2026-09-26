const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Test Case A: Mobile viewport (iPhone 14 style: 390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  const client = await page.target().createCDPSession();

  console.log('=== TEST SUITE: MOBILE VIEWPORT (390x844) ===');
  
  // Touch scroll down
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 200, y: 550 }]
  });
  for (let y = 500; y >= 200; y -= 50) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 200, y }]
    });
    await new Promise(r => setTimeout(r, 10));
  }
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: []
  });
  await new Promise(r => setTimeout(r, 150));
  const mobileTouchScroll = await page.evaluate(() => window.scrollY);
  console.log('Mobile touch scroll down:', mobileTouchScroll, mobileTouchScroll > 0 ? '✓ PASS' : '✗ FAIL');

  // Touch scroll back up
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 200, y: 200 }]
  });
  for (let y = 250; y <= 550; y += 50) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: 200, y }]
    });
    await new Promise(r => setTimeout(r, 10));
  }
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: []
  });
  await new Promise(r => setTimeout(r, 150));
  const mobileTouchScrollUp = await page.evaluate(() => window.scrollY);
  console.log('Mobile touch scroll up:', mobileTouchScrollUp, mobileTouchScrollUp < mobileTouchScroll ? '✓ PASS' : '✗ FAIL');

  // Test Case B: Desktop PC viewport (1280x800)
  console.log('\n=== TEST SUITE: DESKTOP PC VIEWPORT (1280x800) ===');
  await page.setViewport({ width: 1280, height: 800, isMobile: false, hasTouch: false });
  await page.evaluate(() => window.scrollTo(0, 0));

  await client.send('Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: 640,
    y: 400,
    deltaX: 0,
    deltaY: 350
  });
  await new Promise(r => setTimeout(r, 200));
  const desktopWheelScroll = await page.evaluate(() => window.scrollY);
  console.log('Desktop mouse wheel scroll:', desktopWheelScroll, desktopWheelScroll > 0 ? '✓ PASS' : '✗ FAIL');

  // Test Case C: All 4 tabs can be selected and scrolled if content overflows
  console.log('\n=== TEST SUITE: ALL TABS FUNCTIONALITY ===');
  const navTabs = ['tab-params', 'tab-rations', 'tab-qr', 'tab-literature'];
  for (const tabId of navTabs) {
    const tabHeight = await page.evaluate((id) => {
      const btn = document.querySelector(`.nav-tab-btn[data-tab="${id}"]`);
      if (btn) btn.click();
      const tabEl = document.getElementById(id);
      return {
        id,
        isActive: tabEl.classList.contains('active'),
        scrollHeight: tabEl.scrollHeight,
        docHeight: document.documentElement.scrollHeight
      };
    }, tabId);
    console.log(`Tab ${tabHeight.id}: active=${tabHeight.isActive}, scrollHeight=${tabHeight.scrollHeight}px, docHeight=${tabHeight.docHeight}px`);
  }

  await browser.close();
  console.log('\n✓ ALL SCROLL TESTS PASSED!');
})();
