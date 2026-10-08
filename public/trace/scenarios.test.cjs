"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const context=vm.createContext({});
for(const file of ["d3fend-catalog.js","model.js","path-model.js","scenarios.js"])
  vm.runInContext(fs.readFileSync(path.join(__dirname,file),"utf8"),context,{filename:file});
const {TraceScenarios:s,PacerModel:m,PacerPaths:p}=context;
const input=(size,portfolio)=>({...s.COMPANIES[size].revenues,
  defendProfile:m.parseD3fendProfile(s.profileDocument(portfolio)),
  controlEffectiveness:s.PORTFOLIOS[portfolio].effectiveness,
  surfaces:{remote:true,email:true,web:true}});
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);

test("portfolios parse as recognized D3FEND controls and retain earlier defenses",()=>{
  let previous=[];
  for(const [key,count] of [["poor",2],["moderate",7],["high",12]]){
    const profile=m.parseD3fendProfile(s.profileDocument(key));
    assert.equal(profile.techniqueCount,count);
    assert.equal(profile.unknownTechniques.length,0);
    for(const id of previous)assert.ok(profile.techniqueIds.includes(id));
    previous=profile.techniqueIds;
  }
  assert.throws(()=>s.profileDocument("missing"),/Unknown/);
});

test("all nine combinations reconcile payout, costs, profit and path reach",()=>{
  for(const size of Object.keys(s.COMPANIES))for(const portfolio of Object.keys(s.PORTFOLIOS)){
    const result=p.analyze(input(size,portfolio));
    assert.equal(result.evaluatedCount,16);
    assert.equal(result.top.length,Math.min(3,result.profitable.length));
    for(const candidate of result.candidates){
      close(candidate.probability,candidate.steps.reduce((reach,step)=>reach*step.conditionalPass,1));
      close(candidate.expectedRevenue,candidate.probability*candidate.payout);
      close(candidate.totalCost,Object.values(candidate.costs).reduce((a,b)=>a+b,0));
      close(candidate.profit,candidate.expectedRevenue-candidate.totalCost);
      assert.ok(candidate.probability>0&&candidate.probability<1);
      assert.ok(Number.isFinite(candidate.profit));
    }
  }
});

test("stronger portfolios reduce each attack's completion and profit at fixed size",()=>{
  for(const size of Object.keys(s.COMPANIES)){
    const comparison=s.compare(input(size,"moderate"),m.parseD3fendProfile,p.analyze);
    assert.equal(comparison.length,3);
    const maps=comparison.map(c=>new Map(c.result.candidates.map(x=>[x.id,x])));
    for(const candidate of maps[0].values()){
      const medium=maps[1].get(candidate.id),high=maps[2].get(candidate.id);
      assert.ok(candidate.probability>=medium.probability&&medium.probability>=high.probability,candidate.id);
      assert.ok(candidate.profit>=medium.profit&&medium.profit>=high.profit,candidate.id);
    }
  }
});

test("larger-company revenue estimates increase each payout without changing defense probabilities",()=>{
  for(const portfolio of Object.keys(s.PORTFOLIOS)){
    const maps=Object.keys(s.COMPANIES).map(size=>new Map(p.analyze(input(size,portfolio)).candidates.map(x=>[x.id,x])));
    for(const small of maps[0].values()){
      const medium=maps[1].get(small.id),large=maps[2].get(small.id);
      close(small.probability,medium.probability);close(medium.probability,large.probability);
      assert.ok(small.payout<medium.payout&&medium.payout<large.payout,small.id);
      assert.ok(small.profit<medium.profit&&medium.profit<large.profit,small.id);
    }
  }
});

test("comparison uses current custom revenue and scope but each preset's own coverage",()=>{
  const custom={...input("medium","high"),ransom:321000,customerRecords:12345,controlEffectiveness:1,surfaces:{remote:false,email:true,web:false}};
  for(const c of s.compare(custom,m.parseD3fendProfile,p.analyze)){
    assert.equal(c.result.assumptions.controlQuality,s.PORTFOLIOS[c.key].effectiveness);
    assert.ok(c.result.candidates.every(x=>x.surface==="email"));
    const expected=p.analyze({...custom,defendProfile:m.parseD3fendProfile(s.profileDocument(c.key)),controlEffectiveness:c.effectiveness});
    close(c.result.bestProfit,expected.bestProfit);
  }
});

test("zero monetizable value and no surfaces remain valid scenarios",()=>{
  const zero=input("small","poor");
  for(const field of s.REVENUE_FIELDS)zero[field]=0;
  for(const c of s.compare(zero,m.parseD3fendProfile,p.analyze)){
    assert.equal(c.result.profitable.length,0);assert.equal(c.result.bestProfit,0);
    assert.ok(c.result.candidates.every(x=>x.payout===0&&x.profit<0));
  }
  for(const c of s.compare({...zero,surfaces:{remote:false,email:false,web:false}},m.parseD3fendProfile,p.analyze)){
    assert.equal(c.result.evaluatedCount,0);assert.equal(c.result.bestProfit,0);
  }
});
