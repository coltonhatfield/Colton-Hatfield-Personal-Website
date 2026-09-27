const {chromium}=require('C:/Users/colto/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('file:///'+path.join(__dirname,'index.html').replaceAll('\\','/'));
    assert.equal(await page.locator('#modelVersion').textContent(),'2026.09.6');
    await page.locator('#defendProfileFile').setInputFiles(path.join(__dirname,'highly-secure-org-profile.json'));
    await page.locator('#calculatedResult').waitFor({state:'visible'});
    assert.match(await page.locator('#profileSummary').textContent(),/38 techniques/);
    assert.equal(await page.locator('#stageList .stage-row').count(),4);
    assert.equal(await page.locator('#assumptionList > div').count(),6);
    for(const width of [1280,390]) {
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
    }
    await page.locator('#controlEffectiveness').selectOption('60');
    await page.waitForTimeout(150);
    const weak=await page.locator('#successValue').textContent();
    await page.locator('#controlEffectiveness').selectOption('100');
    await page.waitForTimeout(150);
    assert.ok(parseFloat(await page.locator('#successValue').textContent())<parseFloat(weak));
    await page.locator('#resetBtn').click();
    assert.ok(await page.locator('#emptyResult').isVisible());
    assert.deepEqual(errors,[]);
    console.log('Browser checks passed: real file upload, results, four stages, six assumption rows, quality, reset, desktop/mobile overflow, no runtime errors.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
