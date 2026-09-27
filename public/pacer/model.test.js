"use strict";
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const m=require('./model.js');
const catalog=require('./d3fend-catalog.js');
let checks=0;
function test(name,fn) { fn(); checks++; console.log('PASS '+name); }
const read=name => JSON.parse(fs.readFileSync(path.join(__dirname,name),'utf8'));
const fixture=name => m.parseD3fendProfile(read(name));
const profile=names => m.parseD3fendProfile({profiles:[{id:0,includedLayers:['a']}],selectedProfile:0,layers:{a:{checked:true,techniques:names.map(id => ({id:'d3f:'+id})),children:[]}}});
const sample={ransom:115000,cashTheft:10000,customerRecords:10000,intellectualProperty:30000,otherRevenue:10000,controlEffectiveness:1};
const close=(a,b) => assert.ok(Math.abs(a-b) <= 1e-9*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`);
const fixtures=['vulnerable-org-profile.json','moderately-secure-org-profile.json','highly-secure-org-profile.json','d3fend-profile-all-selected.json'].map(fixture);
test('all supplied techniques recognized by official ontology',() => {
  assert.deepEqual(fixtures.map(p => p.techniqueCount),[3,18,38,223]);
  for (const p of fixtures) assert.deepEqual(p.unknownTechniques,[]);
});
test('official classification fixes permissions, locking and restore',() => {
  assert.equal(m.classifyTechnique('UserAccountPermissions'),'isolate');
  assert.equal(m.classifyTechnique('AccountLocking'),'evict');
  assert.equal(m.classifyTechnique('RestoreFile'),'restore');
  assert.equal(m.classifyTechnique('ImaginaryFirewall'),null);
  for (const item of Object.values(catalog.techniques)) for (const f of item.families) assert.ok(m.FAMILY_EFFECTS[f],f);
});
test('no controls and zero implementation retain reference',() => {
  close(m.probabilityFromProfile(profile([])).probability,.56);
  close(m.probabilityFromProfile(fixtures[3],null,0).probability,.56);
});
test('stage products and reach reconcile across profiles and quality settings',() => {
  for (const p of fixtures) for (const q of [0,.6,.75,.9,1]) {
    const result=m.calculate({...sample,controlEffectiveness:q,defendProfile:p});
    let cumulative=1;
    for (const s of result.attackStages) {
      close(s.reachProbability,cumulative);
      assert.ok(s.probability>0 && s.probability<=1);
      cumulative*=s.probability;
      close(s.cumulativeProbability,cumulative);
    }
    close(result.successProbability,cumulative);
    close(result.totalCost,result.costs.reduce((s,c) => s+c.value,0));
    close(result.expectedRevenue,result.revenues.reduce((s,r) => s+r.expectedValue,0));
    close(result.profit,result.expectedRevenue-result.totalCost);
    assert.ok(result.expectedRevenue<=result.totalValue);
    assert.ok(result.costs.every(c => Number.isFinite(c.value) && c.value>=0));
    assert.ok(result.uncertainty.profit.low<=result.profit && result.uncertainty.profit.high>=result.profit);
  }
});
test('sample order and stronger implementation lower impact probability',() => {
  for (const q of [.6,.75,.9,1]) {
    const probs=fixtures.map(p => m.probabilityFromProfile(p,null,q).probability);
    for (let i=1;i<probs.length;i++) assert.ok(probs[i]<probs[i-1]);
  }
  for (const p of fixtures) assert.ok(m.probabilityFromProfile(p,null,1).probability<m.probabilityFromProfile(p,null,.6).probability);
});
test('adding any known technique never increases impact probability',() => {
  for (const p of [profile([]),...fixtures.slice(0,3)]) {
    const base=m.probabilityFromProfile(p).probability;
    for (const name of Object.keys(catalog.techniques)) {
      const extended=profile([...p.techniqueIds,name]);
      assert.ok(m.probabilityFromProfile(extended).probability<=base+1e-12,name);
    }
  }
});
test('duplicate, case, short code and parent selections do not stack',() => {
  const a=profile(['Multi-factorAuthentication']);
  const b=profile(['Multi-factorAuthentication','multi-factorauthentication','D3-MFA','AgentAuthentication']);
  close(m.probabilityFromProfile(a).probability,m.probabilityFromProfile(b).probability);
  assert.equal(profile(['Multi-factorAuthentication','D3-MFA']).techniqueCount,1);
});
test('unchecked techniques/layers, cycles and unknown IDs handled',() => {
  const d={profiles:[{id:0,includedLayers:['a','a']}],selectedProfile:0,layers:{a:{techniques:[{id:'d3f:SoftwareUpdate',checked:false},{id:'d3f:Fake'},{id:'d3f:PasswordAuthentication'}],children:['a','b']},b:{checked:false,techniques:[{id:'d3f:SoftwareUpdate'}]}}};
  const p=m.parseD3fendProfile(d);
  assert.equal(p.techniqueCount,1); assert.deepEqual(p.unknownTechniques,['d3f:Fake']);
  d.layers.a.children.push('missing'); assert.throws(() => m.parseD3fendProfile(d),/missing/);
  d.selectedProfile=99; assert.throws(() => m.parseD3fendProfile(d),/selected/);
  assert.throws(() => m.parseD3fendProfile({}),/profiles/);
});
test('selected profile resolved by ID and unselected layers ignored',() => {
  const d={selectedProfile:'two',profiles:[{id:'one',includedLayers:['missing']},{id:'two',includedLayers:[]}],layers:{}};
  assert.equal(m.parseD3fendProfile(d).techniqueCount,0);
});
test('recovery changes ransom collection but never prior theft or encryption',() => {
  const base=m.calculate({...sample,defendProfile:profile([])});
  const restored=m.calculate({...sample,defendProfile:profile(['RestoreDiskImage','RestoreDatabase'])});
  close(base.successProbability,restored.successProbability);
  assert.ok(restored.revenues[0].expectedValue<base.revenues[0].expectedValue);
  for (let i=1;i<5;i++) close(base.revenues[i].expectedValue,restored.revenues[i].expectedValue);
});
test('enforcement is not inferred from detection and zero value has no revenue fees',() => {
  const r=m.calculate({defendProfile:fixtures[3]});
  assert.equal(r.expectedRevenue,0); assert.equal(r.costs.find(c => c.key==='monetization').value,0);
  assert.equal(r.costs.find(c => c.key==='enforcement').value,2500); assert.ok(!r.profitable);
});
test('RaaS fee applies only to collected ransom',() => {
  for (const [key,fee] of [['ransom',.25],['cashTheft',.10],['intellectualProperty',.10],['otherRevenue',.10],['customerRecords',.10]]) {
    const r=m.calculate({[key]:1000,defendProfile:fixtures[0]});
    close(r.costs.find(c => c.key==='monetization').value,r.expectedRevenue*fee);
  }
});
test('stage cost includes failed attempts and avoids charging unreached full path',() => {
  const r=m.calculate({...sample,defendProfile:profile([])});
  close(r.costs.find(c => c.key==='labor').value,1500+2500*.9+3500*.9*.89+2500*.9*.89*.86);
  close(r.costs.find(c => c.key==='specialists').value,2500*.9*.89);
});
test('nonfinite and extreme inputs remain finite, deterministic, immutable',() => {
  const raw={ransom:Infinity,cashTheft:NaN,customerRecords:1e99,intellectualProperty:-100,otherRevenue:'bad',controlEffectiveness:0,defendProfile:fixtures[0]};
  const a=m.calculate(raw),b=m.calculate(raw);
  assert.deepEqual(a,b); assert.ok(Number.isFinite(a.profit)); assert.equal(a.inputs.ransom,0);
  assert.equal(a.inputs.controlEffectiveness,0); assert.equal(raw.ransom,Infinity);
  assert.throws(() => m.calculate({}),/profile is required/);
});
test('browser bundle matches CommonJS without network or storage',() => {
  const context=vm.createContext({});
  for (const file of ['d3fend-catalog.js','model.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,file),'utf8'),context);
  const raw={...sample,defendProfile:fixtures[0]};
  close(context.PacerModel.calculate(raw).profit,m.calculate(raw).profit);
});
console.log(`${checks} test groups passed, including >1,000 control-addition checks.`);
