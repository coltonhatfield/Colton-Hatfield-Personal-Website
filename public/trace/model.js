"use strict";
(function(root, factory) {
  const api = factory(typeof module !== "undefined" && module.exports ? require("./d3fend-catalog.js") : root.PacerCatalog);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PacerModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function(catalog) {
  if (!catalog) throw new Error("TRACE requires the bundled D3FEND catalog.");
  const MODEL_VERSION = "2026.09.6";
  const CUSTOMER_RECORD_VALUE = 7; // Account asking-price proxy, not a measured generic-record price.
  const BASE_SUCCESS_PROBABILITY = .56; // Survey encryption outcome, not a no-defense measurement.
  const DEFAULT_CONTROL_EFFECTIVENESS = .75;
  const RAAS_SHARE = .25;
  const TACTICS = ["model", "harden", "detect", "isolate", "deceive", "evict"].map(key => ({
    key, name: key === "evict" ? "Evict / Restore" : key[0].toUpperCase() + key.slice(1)
  }));
  // Assumed defense pressure by family for four conditional stages.
  // MITRE supplies taxonomy ONLY. Same-family techniques share maximum credit.
  const FAMILY_EFFECTS = {
    AgentAuthentication: [.55,.10,.05,0], CredentialHardening: [.25,.15,.10,0],
    ApplicationHardening: [.15,.40,.05,.10], PlatformHardening: [.10,.30,.05,.15],
    SourceCodeHardening: [.10,.25,0,.05], MessageHardening: [.20,.05,0,0],
    AccessMediation: [.20,.15,.30,.10], AccessPolicyAdministration: [.10,.15,.35,.15],
    ContentFiltering: [.30,.20,.05,.05], NetworkIsolation: [.20,.10,.45,.10],
    ExecutionIsolation: [.05,.40,.15,.20], OTVariableAccessRestriction: [0,0,0,0],
    FileAnalysis: [.05,.25,.05,.15], IdentifierAnalysis: [.20,.10,.05,.05],
    MessageAnalysis: [.25,.05,0,0], NetworkTrafficAnalysis: [.10,.10,.35,.15],
    OperatingSystemMonitoring: [0,.20,.10,.15], PlatformMonitoring: [0,.10,.05,.10],
    ProcessAnalysis: [0,.35,.15,.20], UserBehaviorAnalysis: [.10,.15,.25,.10],
    PhysicalAccessMonitoring: [0,0,0,0],
    CredentialEviction: [0,.15,.25,.20], ObjectEviction: [0,.15,.10,.25],
    ProcessEviction: [0,.25,.20,.35],
    DecoyEnvironment: [.05,.05,.10,.05], DecoyObject: [.05,.05,.10,.05],
    AssetInventory: [.05,.05,.05,.05], NetworkMapping: [.05,.05,.10,.05],
    OperationalActivityMapping: [0,.05,.05,.05], SystemMapping: [.05,.05,.05,.05],
    RestoreAccess: [0,0,0,0], RestoreObject: [0,0,0,0]
  };
  // Relative strengths are TRACE assumptions, never MITRE effectiveness scores.
  const STRENGTHS = {
    PasswordAuthentication: .10, ChangeDefaultPassword: .20, StrongPasswordPolicy: .30,
    "Multi-factorAuthentication": .85, "Certificate-basedAuthentication": .75,
    SoftwareUpdate: .85, NetworkTrafficFiltering: .40, InboundTrafficFiltering: .40,
    OutboundTrafficFiltering: .65, BroadcastDomainIsolation: .80, EncryptedTunnels: .15,
    ExecutableAllowlisting: .85, FileEncryption: .10, DiskEncryption: .10, FileHashing: .10,
    RestoreDiskImage: .80, RestoreDatabase: .70, RestoreFile: .60, RestoreEmail: .20,
    RestoreConfiguration: .50, RestoreSoftware: .60, PhysicalEnclosureHardening: 0,
    RadiationHardening: 0, ElectromagneticRadiationHardening: 0, RFShielding: 0
  };
  const ATTACK_STAGES = [
    {key:"access", name:"Initial foothold (scenario)", baseline:.90},
    {key:"execution", name:"Execution & persistence", baseline:.89},
    {key:"expansion", name:"Expansion & data access", baseline:.86},
    {key:"impact", name:"Encryption / impact", baseline:BASE_SUCCESS_PROBABILITY / (.90*.89*.86)}
  ];
  const DEFAULT_PARAMETERS = Object.freeze({
    baseline:.56, defenseScale:1, recordValue:7, ransomPayment:.48,
    cashRealization:.75, dataRealization:.35, ipRealization:.20, otherRealization:.50,
    recoveryEffect:.35, accessCost:8500, resourceScale:1, friction:1.5,
    raasShare:.25, resaleFee:.10, cashFee:.10, enforcement:2500
  });
  const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
  function finite(v, fallback=0) {
    if (v === undefined || v === null || v === "") return fallback;
    const n=Number(v); return Number.isFinite(n) ? n : fallback;
  }
  const quality = v => clamp(finite(v,DEFAULT_CONTROL_EFFECTIVENESS),0,1);
  const techniqueName = id => String(id || "").replace(/^d3f:/i,"");
  const aliases = new Map(Object.entries(catalog.techniques).flatMap(([name,item]) => [[name.toLowerCase(),name],[item.code.toLowerCase(),name]]));
  const canonical = id => aliases.get(techniqueName(id).toLowerCase()) || null;
  const classifyTechnique = id => catalog.techniques[canonical(id)]?.tactic || null;
  const displayTactic = tactic => tactic === "restore" ? "evict" : tactic;

  function parseD3fendProfile(document) {
    if (!document || !Array.isArray(document.profiles) || !document.profiles.length) throw new Error("This file does not look like a D3FEND profile export (profiles list not found).");
    const selector=document.selectedProfile;
    const selected=selector === undefined ? document.profiles[0] : document.profiles.find(p => p && String(p.id) === String(selector)) || (/^\d+$/.test(String(selector)) ? document.profiles[Number(selector)] : null);
    if (!selected || !Array.isArray(selected.includedLayers)) throw new Error("The selected D3FEND profile is missing or has no included layers.");
    const nodes={...(document.templates || {}),...(document.layers || {})};
    if (!selected.includedLayers.every(id => typeof id === "string")) throw new Error("Selected layer IDs must be strings.");
    const layerIds=[...new Set(selected.includedLayers)], techniques=new Set(), unknown=new Set(), visited=new Set(), layerNames=[];
    const pending=[...layerIds];
    while (pending.length) {
      const id=pending.pop();
      if (visited.has(id)) continue;
      visited.add(id);
      if (!Object.hasOwn(nodes,id) || !nodes[id] || typeof nodes[id] !== "object") throw new Error("The export is missing a selected layer or child layer. Export the complete profile and try again.");
      const node=nodes[id];
      if (node.checked === false) continue;
      if (node.name) layerNames.push(String(node.name).slice(0,120));
      if (node.techniques !== undefined && !Array.isArray(node.techniques)) throw new Error("Layer techniques must be a list.");
      if (node.children !== undefined && (!Array.isArray(node.children) || !node.children.every(x => typeof x === "string"))) throw new Error("Layer children must be a list of IDs.");
      for (const item of node.techniques || []) {
        if (!item || item.checked === false || typeof item.id !== "string") continue;
        const name=canonical(item.id);
        if (name) techniques.add(name); else unknown.add(item.id.slice(0,160));
      }
      pending.push(...(node.children || []));
    }
    const techniqueIds=[...techniques].sort();
    const tacticCounts=Object.fromEntries(TACTICS.map(t => [t.key,0]));
    const techniquesByTactic=Object.fromEntries(TACTICS.map(t => [t.key,[]]));
    for (const name of techniqueIds) {
      const key=displayTactic(classifyTechnique(name));
      tacticCounts[key]++; techniquesByTactic[key].push(name);
    }
    return {schema:"pacer-d3fend-profile/3.0",profileName:String(selected.name || "Imported D3FEND profile").slice(0,160),
      selectedLayerCount:layerIds.length,selectedLayerNames:[...new Set(layerNames)],techniqueCount:techniqueIds.length,
      techniqueIds,tacticCounts,techniquesByTactic,unknownTechniques:[...unknown].sort(),catalogVersion:catalog.version};
  }
  function profileNames(profile) {
    const names=profile?.techniqueIds || Object.values(profile?.techniquesByTactic || {}).flat();
    return [...new Set(names.map(canonical).filter(Boolean))];
  }
  const familyTactics={};
  for (const entry of Object.values(catalog.techniques)) for (const f of entry.families) familyTactics[f]=displayTactic(entry.tactic);
  function probabilityFromProfile(profile,omittedTactic=null,controlEffectiveness=DEFAULT_CONTROL_EFFECTIVENESS,params=DEFAULT_PARAMETERS) {
    const q=quality(controlEffectiveness),families={},counts=Object.fromEntries(TACTICS.map(t => [t.key,0]));
    for (const name of profileNames(profile)) {
      const entry=catalog.techniques[name],tactic=displayTactic(entry.tactic);
      if (tactic === omittedTactic) continue;
      counts[tactic]++;
      for (const family of entry.families) families[family]=Math.max(families[family] || 0,STRENGTHS[name] ?? (name === family ? .35 : .65));
    }
    const rows=TACTICS.map(t => {
      const relevant=Object.keys(FAMILY_EFFECTS).filter(f => familyTactics[f] === t.key);
      return {...t,count:counts[t.key],coverage:relevant.reduce((s,f) => s+(families[f] || 0),0)/(relevant.length || 1)};
    });
    const response=Math.max(families.CredentialEviction || 0,families.ObjectEviction || 0,families.ProcessEviction || 0);
    let cumulative=1;
    const stages=ATTACK_STAGES.map((stage,i) => {
      const pressure=Object.entries(families).reduce((sum,[f,strength]) => {
        // Detection needs response; a limited autonomous prevention allowance remains.
        const actionable=familyTactics[f] === "detect" || familyTactics[f] === "deceive" ? .25+.75*response*q : 1;
        return sum+strength*(FAMILY_EFFECTS[f]?.[i] || 0)*actionable;
      },0);
      const baseline=i === 3 ? params.baseline/(.90*.89*.86) : stage.baseline;
      // Saturation limits correlated families; residual routes remain at every stage.
      // The 40% maximum stage reduction is an assumption, not fitted efficacy.
      const probability=baseline*(1-.40*q*(1-Math.exp(-params.defenseScale*pressure))),reachProbability=cumulative;
      cumulative*=probability;
      return {...stage,baseline,pressure,probability,reachProbability,cumulativeProbability:cumulative};
    });
    return {probability:cumulative,reduction:1-cumulative/params.baseline,rows,stages,represented:rows.filter(r => r.count).length,
      controlEffectiveness:q,families,recovery:q*(families.RestoreObject || 0)};
  }
  function normalizeInputs(raw={}) {
    const money=v => clamp(finite(v),0,1e11);
    return {ransom:money(raw.ransom),cashTheft:money(raw.cashTheft),customerRecords:clamp(Math.trunc(finite(raw.customerRecords)),0,1e10),
      intellectualProperty:money(raw.intellectualProperty),otherRevenue:money(raw.otherRevenue),controlEffectiveness:quality(raw.controlEffectiveness),defendProfile:raw.defendProfile || null};
  }
  function evaluate(inputs,params=DEFAULT_PARAMETERS) {
    const p=probabilityFromProfile(inputs.defendProfile,null,inputs.controlEffectiveness,params),stage=p.stages;
    const revenues=[
      {key:"ransom",name:"Ransom",value:inputs.ransom,probability:p.probability,realization:params.ransomPayment*(1-params.recoveryEffect*p.recovery)},
      {key:"cash",name:"Cash or cash-equivalent theft",value:inputs.cashTheft,probability:stage[1].cumulativeProbability,realization:params.cashRealization},
      {key:"customer",name:"Customer-data resale",value:inputs.customerRecords*params.recordValue,probability:stage[2].cumulativeProbability,realization:params.dataRealization},
      {key:"ip",name:"Intellectual property",value:inputs.intellectualProperty,probability:stage[2].cumulativeProbability,realization:params.ipRealization},
      {key:"other",name:"Other revenue",value:inputs.otherRevenue,probability:p.probability,realization:params.otherRealization}
    ].map(r => ({...r,expectedValue:r.value*r.probability*r.realization}));
    const totalValue=revenues.reduce((s,r) => s+r.value,0),expectedRevenue=revenues.reduce((s,r) => s+r.expectedValue,0);
    const efforts=stage.map(s => 1+params.friction*inputs.controlEffectiveness*(1-Math.exp(-s.pressure)));
    // Paid on stage entry, including attempts failing at that stage.
    const resource=(amount,i) => amount*params.resourceScale*stage[i].reachProbability*efforts[i];
    const costs=[
      {key:"preparation",name:"Preparation",value:1250*params.resourceScale,evidence:"Upfront; TRACE assumption"},
      {key:"access",name:"Access acquisition",value:params.accessCost,evidence:"2021 business-admin asking-price anchor; upfront"},
      {key:"tools",name:"Tools & infrastructure",value:650*params.resourceScale,evidence:"Upfront service / infrastructure allowance; assumption"},
      {key:"labor",name:"Labor",value:[1500,2500,3500,2500].reduce((s,v,i) => s+resource(v,i),0),evidence:"Stage reach × effort; $10k full-path base assumption"},
      {key:"specialists",name:"Specialist services",value:resource(2500,2),evidence:"Expansion-stage reach × effort; assumption"},
      {key:"overhead",name:"Operational overhead",value:1000*params.resourceScale*stage.reduce((s,x,i) => s+x.reachProbability*efforts[i],0)/4,evidence:"Stage-weighted overhead; assumption"},
      {key:"monetization",name:"Monetization / RaaS share",value:revenues[0].expectedValue*params.raasShare+revenues[1].expectedValue*params.cashFee+revenues.slice(2).reduce((s,r) => s+r.expectedValue,0)*params.resaleFee,evidence:"25% of expected ransom; 10% other cash-out assumption"},
      {key:"enforcement",name:"Expected detection / apprehension",value:params.enforcement,evidence:"Unvalidated economic-risk allowance; not inferred from alerts"}
    ];
    const totalCost=costs.reduce((s,c) => s+c.value,0),profit=expectedRevenue-totalCost;
    return {inputs,profitable:profit>0,totalValue,expectedRevenue,totalCost,profit,revenues,costs,successProbability:p.probability,
      defenseReduction:p.reduction,tacticRows:p.rows,representedTactics:p.represented,attackStages:p.stages,probabilityDetails:p};
  }
  // Joint deterministic scenarios, NOT a confidence interval or a fitted posterior.
  function sensitivity(inputs) {
    const results=[];
    for (let bits=0;bits<64;bits++) {
      const high=i => Boolean(bits & (1<<i));
      results.push(evaluate(inputs,{...DEFAULT_PARAMETERS,
        baseline:high(0)?.65:.45,defenseScale:high(1)?1.5:.5,
        ransomPayment:high(2)?.70:.30,cashRealization:high(2)?1:.40,dataRealization:high(2)?.70:.10,
        ipRealization:high(2)?.50:.05,otherRealization:high(2)?.80:.20,recordValue:high(3)?7:.10,
        accessCost:high(4)?17000:1000,resourceScale:high(4)?2:.5,enforcement:high(5)?10000:0,recoveryEffect:high(5)?.60:.10
      }));
    }
    const central=evaluate(inputs);
    const bounds=key => ({low:Math.min(central[key],...results.map(r => r[key])),high:Math.max(central[key],...results.map(r => r[key]))});
    return {kind:"assumption sensitivity envelope; not a confidence interval",scenarios:64,profit:bounds("profit"),
      successProbability:bounds("successProbability"),expectedRevenue:bounds("expectedRevenue"),totalCost:bounds("totalCost")};
  }
  function calculate(raw) {
    const inputs=normalizeInputs(raw);
    if (!inputs.defendProfile) throw new Error("A D3FEND profile is required.");
    const result=evaluate(inputs),range=sensitivity(inputs);
    const influences=result.tacticRows.map(row => ({...row,probabilityPoints:Math.max(0,
      probabilityFromProfile(inputs.defendProfile,row.key,inputs.controlEffectiveness).probability-result.successProbability)
    })).sort((a,b) => b.probabilityPoints-a.probabilityPoints);
    const dollars=n => `${n<0?"−":""}$${Math.round(Math.abs(n)/1000).toLocaleString("en-US")}k`;
    return {...result,influences,uncertainty:range,assumptions:[
      {label:"Conditional impact anchor",value:"56%",note:"Survey encryption outcome; transfer to this scenario is assumed, not validated"},
      {label:"Control effectiveness",value:`${Math.round(inputs.controlEffectiveness*100)}%`,note:"Family-capped effects; selected coverage and operating quality"},
      {label:"Customer-data value",value:"$7 proxy",note:"Account asking price, not generic-record resale; 35% realization assumption"},
      {label:"Ransom collection",value:"48% reference",note:"Among encrypted victims; recovery reduces collection under a labeled assumption"},
      {label:"Profit sensitivity",value:`${dollars(range.profit.low)} to ${dollars(range.profit.high)}`,note:"Joint assumption scenarios, not a confidence interval"},
      {label:"Profile / scope",value:`${inputs.defendProfile.unknownTechniques?.length || 0} unrecognized`,note:"Unknown IDs get no credit. Cash, data and ransom have separate outcome paths."}
    ]};
  }
  return {MODEL_VERSION,CUSTOMER_RECORD_VALUE,BASE_SUCCESS_PROBABILITY,DEFAULT_CONTROL_EFFECTIVENESS,RAAS_SHARE,
    TACTICS,ATTACK_STAGES,FAMILY_EFFECTS,STRENGTHS,DEFAULT_PARAMETERS,classifyTechnique,parseD3fendProfile,
    probabilityFromProfile,normalizeInputs,calculate,evaluate,sensitivity};
});
