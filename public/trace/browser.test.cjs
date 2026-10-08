"use strict";
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||"playwright");
const path=require("node:path");
const fs=require("node:fs");
const os=require("node:os");
const {pathToFileURL}=require("node:url");
const assert=require("node:assert/strict");
(async()=>{
  const browser=await chromium.launch({channel:process.env.TRACE_BROWSER_CHANNEL||(process.platform==="win32"?"msedge":undefined),headless:true});
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),"trace-scenarios-"));
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],externalRequests=[];
    page.on("pageerror",e=>errors.push(e.message));
    page.on("request",r=>{if(/^https?:/.test(r.url())&&!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(r.url()))externalRequests.push(r.url());});
    await page.goto(process.env.TRACE_TEST_URL||pathToFileURL(path.join(__dirname,"index.html")).href);
    assert.equal(await page.locator("#modelVersion").textContent(),"2026.10.paths-5");
    assert.equal(await page.locator("#companySize").inputValue(),"medium");
    assert.equal(await page.locator("#defensePortfolio").inputValue(),"moderate");
    assert.equal(await page.locator("#ransom").inputValue(),"250000");
    assert.equal(await page.locator("#comparisonRows tr").count(),16);
    assert.equal(await page.locator("#comparisonRows .selected-portfolio").count(),16);
    const initialProfit=await page.evaluate(()=>latest.bestProfit);
    for(const size of ["small","medium","large"])for(const portfolio of ["poor","moderate","high"]){
      await page.locator("#companySize").selectOption(size);
      await page.locator("#defensePortfolio").selectOption(portfolio);
      const state=await page.evaluate(()=>({size:document.getElementById("companySize").value,
        portfolio:document.getElementById("defensePortfolio").value,quality:inputs().controlEffectiveness,
        revenues:scenarios.REVENUE_FIELDS.map(id=>inputs()[id]),
        expected:scenarios.REVENUE_FIELDS.map(id=>scenarios.COMPANIES[document.getElementById("companySize").value].revenues[id]),
        profit:latest.bestProfit,comparison:comparison.find(c=>c.key===document.getElementById("defensePortfolio").value).result.bestProfit}));
      assert.equal(state.size,size);assert.equal(state.portfolio,portfolio);assert.deepEqual(state.revenues,state.expected);
      assert.equal(state.quality,{poor:.6,moderate:.75,high:.9}[portfolio]);assert.equal(state.profit,state.comparison);
    }
    await page.locator("#ransom").fill("321000");
    await page.waitForFunction(()=>document.getElementById("companySize").value==="custom");
    await page.locator("#defensePortfolio").selectOption("poor");assert.equal(await page.locator("#ransom").inputValue(),"321000");
    await page.locator("#controlEffectiveness").selectOption("100");
    await page.waitForFunction(()=>document.getElementById("defensePortfolio").value==="custom"&&latest.assumptions.controlQuality===1);
    await page.locator("#companySize").selectOption("small");
    assert.equal(await page.locator("#controlEffectiveness").inputValue(),"100");assert.equal(await page.locator("#defensePortfolio").inputValue(),"custom");
    const doc=await page.evaluate(()=>scenarios.profileDocument("high"));
    doc.profiles[0].name='<img src=x onerror="alert(1)"> Uploaded';
    await page.locator("#defendProfileFile").setInputFiles({name:"profile.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(doc))});
    await page.waitForFunction(()=>!exampleLoaded);
    assert.equal(await page.locator("#defensePortfolio").inputValue(),"custom");assert.equal(await page.locator("#exampleBanner").isVisible(),false);
    assert.equal(await page.locator("#defendProfileStatus img").count(),0);
    await page.locator("#companySize").selectOption("medium");
    assert.equal(await page.locator("#defensePortfolio").inputValue(),"custom");
    assert.equal(await page.locator("#exampleBanner").isVisible(),false);
    assert.equal(await page.evaluate(()=>loadedProfile.techniqueCount),12);
    const uploadedProfit=await page.evaluate(()=>latest.bestProfit);
    for(const bad of ["{oops",JSON.stringify({profiles:[]})]){
      await page.locator("#defendProfileFile").setInputFiles({name:"invalid.json",mimeType:"application/json",buffer:Buffer.from(bad)});
      await page.waitForFunction(()=>document.getElementById("defendProfileStatus").classList.contains("error"));
      assert.equal(await page.evaluate(()=>latest.bestProfit),uploadedProfit);
    }
    await page.locator("#defendProfileFile").setInputFiles({name:"large.json",mimeType:"application/json",buffer:Buffer.alloc(10*1024*1024+1,32)});
    assert.match(await page.locator("#defendProfileStatus").textContent(),/exceeds 10 MB/);assert.equal(await page.evaluate(()=>latest.bestProfit),uploadedProfit);
    await page.locator("#defensePortfolio").selectOption("moderate");assert.equal(await page.locator("#exampleBanner").isVisible(),true);
    await page.locator("#resetBtn").click();
    assert.equal(await page.locator("#companySize").inputValue(),"medium");assert.equal(await page.locator("#defensePortfolio").inputValue(),"moderate");
    assert.equal(await page.evaluate(()=>latest.bestProfit),initialProfit);
    // Exports must flush the debounced input change and include reproducible scenario metadata.
    await page.locator("#ransom").fill("432000");
    const jsonDownload=page.waitForEvent("download");await page.locator("#downloadJson").click();
    const jsonFile=path.join(temp,"result.json");await (await jsonDownload).saveAs(jsonFile);
    const exported=JSON.parse(fs.readFileSync(jsonFile,"utf8"));
    assert.equal(exported.inputs.ransom,432000);assert.equal(exported.scenario.companySize,"custom");
    assert.equal(exported.comparison.length,3);assert.equal(exported.result.profileName,"Moderately defended example company");
    const csvDownload=page.waitForEvent("download");await page.locator("#downloadCsv").click();
    const csvFile=path.join(temp,"result.csv");await (await csvDownload).saveAs(csvFile);
    const csv=fs.readFileSync(csvFile,"utf8");assert.match(csv,/"company_size","defense_portfolio","control_effectiveness"/);assert.equal(csv.split("\r\n").length,17);
    for(const id of ["surfaceRemote","surfaceEmail","surfaceWeb"])await page.locator("#"+id).uncheck();
    await page.waitForFunction(()=>latest.evaluatedCount===0);assert.match(await page.locator("#comparisonRows").textContent(),/No attack surfaces/);
    for(const id of ["ransom","cashTheft","customerRecords","intellectualProperty","otherRevenue"])await page.locator("#"+id).fill("0");
    await page.locator("#surfaceEmail").check();await page.waitForFunction(()=>latest.evaluatedCount>0&&latest.bestProfit===0);
    assert.equal(await page.locator("#pathList .attack-path").count(),0);await page.locator("#resetBtn").click();
    for(const width of [1440,1024,820,390,320]){
      await page.setViewportSize({width,height:1000});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`no page overflow at ${width}`);
      assert.ok(await page.locator("#companySize").isVisible());assert.ok(await page.locator("#defensePortfolio").isVisible());
      if(width<=820){
        assert.equal(await page.locator("#modelForm").isVisible(),false);await page.locator("#opportunityToggle").click();
        assert.equal(await page.locator("#modelForm").isVisible(),true);await page.locator("#opportunityToggle").click();
      }
      await page.locator(".scenario-assumptions > summary").click();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`expanded assumptions fit at ${width}`);
      await page.locator(".scenario-assumptions > summary").click();
    }
    if(process.env.TRACE_SCREENSHOT_DIR){
      await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(process.env.TRACE_SCREENSHOT_DIR,"desktop.png"),fullPage:true});
      await page.setViewportSize({width:390,height:1000});await page.screenshot({path:path.join(process.env.TRACE_SCREENSHOT_DIR,"mobile.png"),fullPage:true});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(externalRequests,[]);
    console.log("Browser checks passed: all nine presets, independent edits, upload/error handling, safe names, JSON/CSV, reset, zero values/surfaces, five viewport widths, local privacy and no runtime errors.");
  }finally{await browser.close();fs.rmSync(temp,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
