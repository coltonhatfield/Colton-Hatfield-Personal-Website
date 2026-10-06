/* Curated defensive scenario model. Prices are listing medians, not per-technique prices. */
(function (root, factory) {
  const result = factory();
  if (typeof module === "object" && module.exports) module.exports = result;
  root.PacerPaths = result;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const VERSION = "2026.10.paths-5";
  const SOURCES = {
    prices: "https://global.ptsecurity.com/en/research/analytics/cybercrime-as-a-service/",
    bridge: "https://d3fend.mitre.org/mappings/attack-mitigations/",
    ransomwareTiming: "https://cloud.google.com/blog/topics/threat-intelligence/ransomware-attacks-surge-rely-on-public-legitimate-tools",
    redTeamTiming: "https://cloud.google.com/blog/topics/threat-intelligence/m-trends-2024",
    ransomwarePayment: "https://www.chainalysis.com/blog/crypto-crime-ransomware-victim-extortion-2025/"
  };
  // Each defensive pairing below is an ATT&CK mitigation plus a D3FEND technique
  // listed in MITRE's mitigation bridge. It is not a direct 1:1 ATT&CK↔D3FEND edge.
  const CONTROLS = {
    mfa: {name:"Multi-factor authentication", mitigation:"M1032", defend:"Multi-factorAuthentication", rate:.34},
    account: {name:"Account-use monitoring", mitigation:"M1036", defend:"AuthenticationEventThresholding", rate:.18},
    segment: {name:"Network segmentation", mitigation:"M1030", defend:"InboundTrafficFiltering", rate:.27},
    egress: {name:"Outbound traffic filtering", mitigation:"M1031", defend:"OutboundTrafficFiltering", rate:.23},
    network: {name:"Network traffic analysis", mitigation:"M1031", defend:"NetworkTrafficAnalysis", rate:.16},
    endpoint: {name:"Endpoint process analysis", mitigation:"M1049", defend:"ProcessAnalysis", rate:.25},
    allowlist: {name:"Executable allowlisting", mitigation:"M1038", defend:"ExecutableAllowlisting", rate:.30},
    patch: {name:"Software updating", mitigation:"M1051", defend:"SoftwareUpdate", rate:.34},
    exploit: {name:"Exploit protection", mitigation:"M1050", defend:"ApplicationHardening", rate:.23},
    permissions: {name:"Cloud data permissions", mitigation:"M1022", defend:"LocalFilePermissions", rate:.24},
    behavior: {name:"Behavior-based response", mitigation:"M1040", defend:"ResourceAccessPatternAnalysis", rate:.21}
  };
  const STEPS = {
    phishing: {id:"T1566", name:"Phishing", controls:["network","endpoint"]},
    accounts: {id:"T1078", name:"Valid accounts", controls:["mfa","account"]},
    remote: {id:"T1021.001", name:"Remote desktop movement", controls:["segment","network"]},
    cloud: {id:"T1530", name:"Data from cloud storage", controls:["permissions","behavior"]},
    local: {id:"T1005", name:"Data from local system", controls:["permissions","behavior"]},
    exfil: {id:"T1567", name:"Exfiltration over web service", controls:["egress","network"]},
    execution: {id:"T1059", name:"Command and scripting interpreter", controls:["endpoint","allowlist"]},
    web: {id:"T1190", name:"Exploit public-facing application", controls:["patch","exploit"]},
    recovery: {id:"T1490", name:"Inhibit system recovery", controls:["behavior","endpoint"]},
    encrypt: {id:"T1486", name:"Data encrypted for impact", controls:["endpoint","allowlist","behavior"]},
    email: {id:"T1114", name:"Email collection", controls:["mfa","account"]},
    forwarding: {id:"T1114.003", name:"Email forwarding rule", controls:["account","behavior"]},
    repository: {id:"T1213.003", name:"Data from code repositories", controls:["permissions","behavior"]},
    database: {id:"T1213.006", name:"Data from databases", controls:["permissions","behavior"]},
    theft: {id:"T1657", name:"Financial theft / extortion", controls:[], outcome:true}
  };
  const PATHS = [
    {id:"broker-data",name:"Purchased access → data exfiltration",surface:"remote",goal:"data",steps:["accounts","remote","local","exfil"],resource:[{name:"Initial access listing",amount:600,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"broker-ransom",name:"Purchased access → ransomware",surface:"remote",goal:"ransom",steps:["accounts","remote","recovery","encrypt","theft"],resource:[{name:"Initial access listing",amount:600,source:"PT median"},{name:"Ransomware tooling",amount:1000,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"broker-double",name:"Purchased access → double extortion",surface:"remote",goal:"double",steps:["accounts","remote","local","exfil","recovery","encrypt","theft"],resource:[{name:"Initial access listing",amount:600,source:"PT median"},{name:"Ransomware tooling",amount:1000,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"phish-cloud",name:"Phishing → cloud data theft",surface:"email",goal:"data",steps:["phishing","accounts","cloud","exfil"],resource:[{name:"Phishing panel",amount:150,source:"PT example"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"phish-ransom",name:"Phishing → ransomware",surface:"email",goal:"ransom",steps:["phishing","execution","remote","encrypt","theft"],resource:[{name:"Phishing panel",amount:150,source:"PT example"},{name:"Ransomware tooling",amount:1000,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"web-data",name:"Public-app exploit → data exfiltration",surface:"web",goal:"data",steps:["web","execution","local","exfil"],resource:[{name:"Exploit listing",amount:27500,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"web-ransom",name:"Public-app exploit → ransomware",surface:"web",goal:"ransom",steps:["web","execution","remote","encrypt","theft"],resource:[{name:"Exploit listing",amount:27500,source:"PT median"},{name:"Ransomware tooling",amount:1000,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"phish-financial",name:"Phishing → payment diversion",surface:"email",goal:"cash",steps:["phishing","accounts","email","theft"],resource:[{name:"Phishing panel",amount:150,source:"PT example"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"broker-cloud",name:"Purchased access → cloud storage theft",surface:"remote",goal:"data",steps:["accounts","cloud","exfil"],resource:[{name:"Initial access listing",amount:600,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"broker-repository",name:"Purchased access → code repository theft",surface:"remote",goal:"ip",steps:["accounts","repository","exfil"],resource:[{name:"Initial access listing",amount:600,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"broker-financial",name:"Purchased access → payment diversion",surface:"remote",goal:"cash",steps:["accounts","email","theft"],resource:[{name:"Initial access listing",amount:600,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"phish-double",name:"Phishing → data theft and ransomware",surface:"email",goal:"double",steps:["phishing","execution","remote","local","exfil","recovery","encrypt","theft"],resource:[{name:"Phishing panel",amount:150,source:"PT example"},{name:"Ransomware tooling",amount:1000,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"phish-repository",name:"Phishing → code repository theft",surface:"email",goal:"ip",steps:["phishing","accounts","repository","exfil"],resource:[{name:"Phishing panel",amount:150,source:"PT example"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"phish-forwarding",name:"Phishing → mailbox forwarding and payment diversion",surface:"email",goal:"cash",steps:["phishing","accounts","forwarding","theft"],resource:[{name:"Phishing panel",amount:150,source:"PT example"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"web-database",name:"Public-app exploit → database theft",surface:"web",goal:"data",steps:["web","execution","database","exfil"],resource:[{name:"Exploit listing",amount:27500,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]},
    {id:"web-double",name:"Public-app exploit → data theft and ransomware",surface:"web",goal:"double",steps:["web","execution","remote","local","exfil","recovery","encrypt","theft"],resource:[{name:"Exploit listing",amount:27500,source:"PT median"},{name:"Ransomware tooling",amount:1000,source:"PT median"},{name:"Infrastructure",amount:8,source:"PT median"}]}
  ];
  // Planning windows, not measured path-specific averages or probability bounds.
  // The ransomware objective anchor is Mandiant's six-day observed median;
  // every other component and all payout delays are explicit PACER assumptions.
  const TIMING_WINDOWS = {
    data: {objective:[2,10],collection:[7,30],objectiveName:"data theft",collectionName:"data sale"},
    ip: {objective:[2,10],collection:[14,90],objectiveName:"repository theft",collectionName:"buyer/payment"},
    cash: {objective:[1,14],collection:[0,3],objectiveName:"payment diversion",collectionName:"transfer/collection"},
    ransom: {objective:[6,6],collection:[3,14],objectiveName:"ransomware deployment",collectionName:"negotiation/payment"},
    double: {objective:[6,6],collection:[7,21],objectiveName:"theft and ransomware deployment",collectionName:"negotiation/payment"}
  };
  function clamp(n,lo,hi) { return Math.max(lo,Math.min(hi,Number(n)||0)); }
  function onePath(template, input, additions) {
    const selected = new Set([...(input.defendProfile?.techniqueIds||[]),...additions]);
    const quality = clamp(input.controlEffectiveness,.1,1);
    let reach = 1, labor = 0;
    const steps = template.steps.map(key => {
      const step = STEPS[key], entry = reach;
      const active = step.controls.filter(id => selected.has(CONTROLS[id].defend));
      // 0.92 baseline progression and control reductions are explicit scenario assumptions.
      // Combined credits are capped; no single control is treated as a guaranteed block.
      const reduction = Math.min(.65,active.reduce((p,id) => 1-(1-p)*(1-CONTROLS[id].rate*quality),0));
      const pass = step.outcome?1:.92*(1-reduction);
      if (!step.outcome) labor += entry*250; // Assumption, not a measured criminal wage.
      reach *= pass;
      return {id:step.id,name:step.name,outcome:Boolean(step.outcome),entryProbability:entry,conditionalPass:pass,cumulativeProbability:reach,
        defenses:step.controls.map(id => ({key:id,...CONTROLS[id],selected:selected.has(CONTROLS[id].defend)}))};
    });
    const customer = clamp(input.customerRecords,0,1e10)*7*.35;
    const dataValue = customer+clamp(input.intellectualProperty,0,1e11)*.2+clamp(input.otherRevenue,0,1e11)*.5;
    const ransomValue = clamp(input.ransom,0,1e11)*.48;
    const payout = template.goal==="data" ? dataValue : template.goal==="ip" ? clamp(input.intellectualProperty,0,1e11)*.2 : template.goal==="ransom" ? ransomValue : template.goal==="cash" ? clamp(input.cashTheft,0,1e11)*.75 : dataValue+ransomValue;
    const expectedRevenue = reach*payout;
    const upfront = template.resource.reduce((n,r)=>n+r.amount,0);
    const collectionFee = expectedRevenue*(template.goal==="ransom"?.25:template.goal==="double"?.18:.10);
    const costs = {upfront,labor,collectionFee};
    const totalCost = upfront+labor+collectionFee;
    const window=TIMING_WINDOWS[template.goal];
    const timing={label:`${window.objective[0]+window.collection[0]}–${window.objective[1]+window.collection[1]} days`,
      kind:"illustrative access-to-payout window",from:"initial access",to:"attacker payout, if collected",
      objectiveDays:window.objective,collectionDays:window.collection,objectiveName:window.objectiveName,
      collectionName:window.collectionName,objectiveEvidence:["ransom","double"].includes(template.goal)?"Mandiant 2023 median":"PACER assumption",
      collectionEvidence:"PACER assumption",source:["ransom","double"].includes(template.goal)?SOURCES.ransomwareTiming:SOURCES.redTeamTiming,
      payoutTimeIncluded:true};
    return {...template,steps,timing,probability:reach,payout,expectedRevenue,costs,totalCost,profit:expectedRevenue-totalCost,
      profitable:expectedRevenue>totalCost};
  }
  function analyze(input) {
    if (!input.defendProfile) throw new Error("A D3FEND profile is required.");
    const surfaces = input.surfaces||{remote:true,email:true,web:true};
    const candidates = PATHS.filter(p=>surfaces[p.surface]).map(p=>onePath(p,input,[])).sort((a,b)=>b.profit-a.profit);
    const profitable = candidates.filter(p=>p.profitable);
    const baselineBest = Math.max(0,...candidates.map(p=>p.profit));
    const recommendations = Object.entries(CONTROLS).filter(([,c])=>!input.defendProfile.techniqueIds.includes(c.defend)).map(([key,c])=>{
      const after = PATHS.filter(p=>surfaces[p.surface]).map(p=>onePath(p,input,[c.defend]));
      const afterBest = Math.max(0,...after.map(p=>p.profit));
      return {key,...c,reduction:baselineBest-afterBest,remainingBest:afterBest,affected:candidates.filter(p=>p.steps.some(s=>s.defenses.some(d=>d.key===key))).length};
    }).sort((a,b)=>b.reduction-a.reduction || b.affected-a.affected);
    return {version:VERSION,candidates,profitable,top:profitable.slice(0,3),recommendations:recommendations.slice(0,3),
      evaluatedCount:candidates.length,bestProfit:baselineBest,profileName:input.defendProfile.profileName,
      assumptions:{stepPass:.92,stepLabor:250,recordAskingPrice:7,recordRealization:.35,ransomPayment:.48,
        dataFees:.10,ransomFees:.25,controlQuality:input.controlEffectiveness},sources:SOURCES};
  }
  return {VERSION,SOURCES,CONTROLS,STEPS,PATHS,analyze};
});
