"use strict";

const CONTROL_DEFS = [
  { id: "mfa", name: "Phishing-resistant MFA", map: "Credential hardening · identity" },
  { id: "patching", name: "Edge vulnerability management", map: "Platform hardening · exposure" },
  { id: "edr", name: "EDR & endpoint isolation", map: "Process analysis · containment" },
  { id: "pam", name: "Privileged access controls", map: "Credential hardening · authorization" },
  { id: "segmentation", name: "Network segmentation", map: "Network isolation · filtering" },
  { id: "backups", name: "Immutable, tested backups", map: "Restore access · resilience" },
  { id: "monitoring", name: "24×7 monitoring & response", map: "Behavior analysis · response" }
];

const SCENARIOS = {
  credential: {
    title: "Credential-led ransomware affiliate",
    note: "Purchased or stolen credentials → privilege expansion → lateral movement → encryption or extortion.",
    bases: [.72,.78,.80,.67,.64,.80,.63,.78,.74,.60],
    access: 1.05, capability: .90, execution: .92, value: 1.0
  },
  vulnerability: {
    title: "Vulnerability-led enterprise ransomware",
    note: "Internet-facing exploitation → persistence → privileged access → enterprise-wide impact.",
    bases: [.64,.81,.82,.70,.68,.82,.67,.80,.77,.64],
    access: 1.40, capability: 1.35, execution: 1.28, value: 1.35
  },
  extortion: {
    title: "Data theft & extortion operator",
    note: "Initial access → discovery → collection → exfiltration → pressure without requiring encryption.",
    bases: [.69,.78,.76,.62,.64,.84,.59,.84,.79,.66],
    access: 1.0, capability: .82, execution: .86, value: .74
  }
};

const STAGES = ["Initial access","Execution","Persistence","Privilege escalation","Credential access","Discovery","Lateral movement","Collection","Exfiltration","Monetization"];
const COST_COLORS = ["#2f72ff", "#5de4c7", "#8267d6", "#ee735e", "#f0b44d"];
const COST_NAMES = ["Preparation", "Access", "Capability", "Execution", "Realization"];
const STATUS_SCORE = { none: 0, unknown: .12, partial: .55, implemented: 1 };

let latestResult = null;
let updateTimer = null;

function el(id) { return document.getElementById(id); }
function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function logit(p) { return Math.log(p / (1 - p)); }
function logistic(x) { return 1 / (1 + Math.exp(-x)); }

function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function normal(rng) {
  const u = Math.max(1e-12, rng());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}
function lognormal(rng, median, sigma) { return median * Math.exp(sigma * normal(rng)); }
function triangular(rng, low, mode, high) {
  const u = rng(), c = (mode - low) / (high - low);
  return u < c ? low + Math.sqrt(u * (high - low) * (mode - low)) : high - Math.sqrt((1-u)*(high-low)*(high-mode));
}
function gamma(rng, shape) {
  if (shape < 1) return gamma(rng, shape + 1) * Math.pow(rng(), 1 / shape);
  const d = shape - 1/3, c = 1 / Math.sqrt(9*d);
  while (true) {
    let x, v;
    do { x = normal(rng); v = 1 + c*x; } while (v <= 0);
    v = v*v*v;
    const u = rng();
    if (u < 1 - .0331*x*x*x*x || Math.log(u) < .5*x*x + d*(1-v+Math.log(v))) return d*v;
  }
}
function beta(rng, a, b) { const x = gamma(rng,a), y = gamma(rng,b); return x/(x+y); }
function quantile(sorted, p) {
  const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi]-sorted[lo])*(i-lo);
}
function summary(values) {
  const sorted = values.slice().sort((a,b)=>a-b);
  return { p05: quantile(sorted,.05), p25: quantile(sorted,.25), median: quantile(sorted,.5), p75: quantile(sorted,.75), p95: quantile(sorted,.95), mean: values.reduce((a,b)=>a+b,0)/values.length };
}
function money(v) {
  const a = Math.abs(v);
  if (a >= 1e9) return `${v < 0 ? "−" : ""}$${(a/1e9).toFixed(a >= 1e10 ? 1 : 2)}B`;
  if (a >= 1e6) return `${v < 0 ? "−" : ""}$${(a/1e6).toFixed(a >= 1e7 ? 1 : 2)}M`;
  if (a >= 1e3) return `${v < 0 ? "−" : ""}$${Math.round(a/1e3)}k`;
  return `${v < 0 ? "−" : ""}$${Math.round(a).toLocaleString()}`;
}
function pct(v, digits=1) { return `${(v*100).toFixed(digits)}%`; }

function getInputs() {
  const controls = {};
  CONTROL_DEFS.forEach(c => controls[c.id] = el(`control-${c.id}`).value);
  return {
    country: el("country").value,
    industry: el("industry").value,
    revenue: +el("revenue").value,
    employees: +el("employees").value,
    environment: el("environment").value,
    archetype: el("archetype").value,
    recoveryAnchor: +el("recoveryAnchor").value,
    ransomAnchor: +el("ransomAnchor").value,
    paymentProbability: +el("paymentProbability").value / 100,
    seed: clamp(+el("seed").value || 20260925, 1, 2147483646),
    controls
  };
}

function stageAdjustments(inputs) {
  const c = Object.fromEntries(Object.entries(inputs.controls).map(([k,v]) => [k, STATUS_SCORE[v]]));
  const reductions = Array(10).fill(0);
  const s = inputs.archetype;
  reductions[0] += c.mfa * (s === "credential" ? .48 : .16);
  reductions[0] += c.patching * (s === "vulnerability" ? .45 : .10);
  reductions[1] += c.edr * .27; reductions[2] += c.edr * .24;
  reductions[3] += c.pam * .34; reductions[4] += c.pam * .30;
  reductions[5] += c.monitoring * .14; reductions[7] += c.monitoring * .20; reductions[8] += c.monitoring * .22;
  reductions[6] += c.segmentation * .40; reductions[5] += c.segmentation * .06;
  reductions[9] += c.backups * (s === "extortion" ? .07 : .15);
  return reductions.map(v => clamp(v, 0, .72));
}

function model(inputs, draws=20000) {
  const rng = mulberry32(inputs.seed + draws);
  const scenario = SCENARIOS[inputs.archetype];
  const revScale = clamp(Math.pow(inputs.revenue / 75000000, .16), .48, 2.35);
  const empScale = clamp(Math.pow(inputs.employees / 150, .14), .58, 2.05);
  const recoveryScale = clamp(Math.pow(inputs.revenue / 75000000, .18) * Math.pow(inputs.employees / 150, .16), .22, 3.25);
  const environmentScale = inputs.environment === "hybrid" ? 1.08 : inputs.environment === "onprem" ? 1.12 : .96;
  const industryScale = ({financial:1.16, healthcare:1.12, manufacturing:1.08, technology:1.04, government:1.08, energy:1.14, education:.94, retail:.98, professional:1, transport:1.03, other:1})[inputs.industry] || 1;
  const reductions = stageAdjustments(inputs);
  const controls = Object.fromEntries(Object.entries(inputs.controls).map(([k,v]) => [k, STATUS_SCORE[v]]));
  const costLift = {
    access: 1 + .24*controls.mfa*(inputs.archetype === "credential") + .20*controls.patching*(inputs.archetype === "vulnerability"),
    execution: 1 + .12*controls.segmentation + .10*controls.edr + .08*controls.pam,
    realization: 1 + .09*controls.monitoring
  };
  const valueReduction = controls.backups * (inputs.archetype === "extortion" ? .18 : .52) + controls.monitoring * .08;
  const recoveryReduction = controls.backups * .24 + controls.monitoring * .10 + controls.edr * .08;

  const out = { teac:[], success:[], viable:0, loss:[], proceeds:[], expectedLoss:[], costs:[[],[],[],[],[]], stageSums:Array(10).fill(0) };
  for (let i=0; i<draws; i++) {
    const prep = triangular(rng,100,1000,10000) * (0.88 + .12*revScale);
    const access = lognormal(rng,2500 * scenario.access * Math.pow(revScale,.45) * costLift.access,1.5);
    const capability = triangular(rng,500,5000,50000) * scenario.capability;
    const execution = triangular(rng,1000,10000,100000) * scenario.execution * empScale * environmentScale * costLift.execution;
    const realization = triangular(rng,100,1000,10000) * scenario.value * costLift.realization;
    const costs = [prep,access,capability,execution,realization];
    const teac = costs.reduce((a,b)=>a+b,0);

    const shared = normal(rng) * .22;
    let success = 1;
    for (let j=0; j<10; j++) {
      const base = scenario.bases[j];
      const concentration = 34;
      let stage = beta(rng, base*concentration, (1-base)*concentration);
      stage = logistic(logit(clamp(stage,.01,.99)) + shared);
      stage *= 1 - reductions[j];
      stage = clamp(stage,.01,.98);
      success *= stage;
      out.stageSums[j] += stage;
    }

    const monetizable = lognormal(rng, inputs.ransomAnchor * scenario.value * Math.pow(revScale,.72) * industryScale * (1-clamp(valueReduction,0,.70)), .95);
    const expectedProceeds = success * monetizable;
    const payment = rng() < inputs.paymentProbability ? lognormal(rng, inputs.ransomAnchor * Math.pow(revScale,.55), .82) : 0;
    const recovery = lognormal(rng, inputs.recoveryAnchor * recoveryScale * industryScale * (1-clamp(recoveryReduction,0,.55)), .72);
    const conditionalLoss = recovery + payment;
    const expectedLoss = success * conditionalLoss;

    out.teac.push(teac); out.success.push(success); out.loss.push(conditionalLoss); out.proceeds.push(expectedProceeds); out.expectedLoss.push(expectedLoss);
    costs.forEach((v,k)=>out.costs[k].push(v));
    if (expectedProceeds > teac) out.viable++;
  }
  return {
    inputs,
    draws,
    teac: summary(out.teac),
    success: summary(out.success),
    loss: summary(out.loss),
    proceeds: summary(out.proceeds),
    expectedLoss: summary(out.expectedLoss),
    viability: out.viable / draws,
    costs: out.costs.map(summary),
    stageMedians: out.stageSums.map(v=>v/draws),
    lossSamples: out.loss
  };
}

function recommendations(inputs, baseline) {
  return CONTROL_DEFS.filter(c => inputs.controls[c.id] !== "implemented").map((control, index) => {
    const changed = JSON.parse(JSON.stringify(inputs));
    changed.controls[control.id] = "implemented";
    changed.seed = inputs.seed;
    const alt = model(changed, 3500);
    return {
      control,
      successDelta: alt.success.median - baseline.success.median,
      lossDelta: alt.expectedLoss.median - baseline.expectedLoss.median,
      teacDelta: alt.teac.median - baseline.teac.median,
      alt
    };
  }).sort((a,b) => a.lossDelta - b.lossDelta).slice(0,3);
}

function render() {
  const inputs = getInputs();
  const scenario = SCENARIOS[inputs.archetype];
  el("scenarioNote").innerHTML = `<strong>${scenario.title}</strong>${scenario.note}`;
  el("paymentOutput").textContent = `${Math.round(inputs.paymentProbability*100)}%`;
  el("results-panel")?.setAttribute("aria-busy","true");

  const result = model(inputs);
  latestResult = result;
  el("teacValue").textContent = money(result.teac.median);
  el("teacRange").textContent = `90% range ${money(result.teac.p05)}–${money(result.teac.p95)}`;
  el("successValue").textContent = pct(result.success.median,1);
  el("successRange").textContent = `90% range ${pct(result.success.p05,1)}–${pct(result.success.p95,1)}`;
  el("viableValue").textContent = pct(result.viability,1);
  el("lossValue").textContent = money(result.loss.median);
  el("lossRange").textContent = `90% range ${money(result.loss.p05)}–${money(result.loss.p95)}`;
  el("proceedsValue").textContent = money(result.proceeds.median);
  el("expectedLossValue").textContent = money(result.expectedLoss.median);

  const viabilityText = result.viability < .1 ? "economically unattractive in most sampled conditions" : result.viability < .35 ? "economically viable in a meaningful minority of sampled conditions" : "economically viable across a substantial share of sampled conditions";
  const asymmetry = result.loss.median / Math.max(1,result.teac.median);
  el("interpretation").innerHTML = `<strong>Readout:</strong> This path is ${viabilityText}. If it succeeds, median modeled defender loss is about <strong>${asymmetry.toFixed(0)}×</strong> median attacker cost. That asymmetry is the main decision signal—not a single risk score.`;
  renderCosts(result);
  renderStages(result);
  renderLossChart(result.lossSamples, result.loss);
  renderRecommendations(inputs, result);
  el("results-panel")?.setAttribute("aria-busy","false");
}

function renderCosts(result) {
  const total = result.costs.reduce((s,x)=>s+x.median,0);
  el("pacerBar").innerHTML = result.costs.map((x,i) => `<div class="pacer-segment" style="width:${(x.median/total)*100}%;background:${COST_COLORS[i]}" title="${COST_NAMES[i]} ${money(x.median)}"></div>`).join("");
  el("pacerLegend").innerHTML = result.costs.map((x,i) => `<div class="legend-item"><span><i style="background:${COST_COLORS[i]}"></i>${COST_NAMES[i]}</span><strong>${money(x.median)}</strong></div>`).join("");
}

function renderStages(result) {
  el("stageChart").innerHTML = result.stageMedians.map((v,i) => `<div class="stage-row"><span title="${STAGES[i]}">${STAGES[i]}</span><div class="stage-track"><div class="stage-fill" style="width:${v*100}%"></div></div><output>${pct(v,0)}</output></div>`).join("");
}

function renderLossChart(values, stats) {
  const svg = el("lossChart"), width=520, height=220, left=42, right=14, top=20, bottom=36;
  const lo=0, hi=stats.p95*1.08, bins=28, counts=Array(bins).fill(0);
  values.forEach(v => { const j = clamp(Math.floor((Math.min(v,hi)-lo)/(hi-lo)*bins),0,bins-1); counts[j]++; });
  const max=Math.max(...counts), pw=width-left-right, ph=height-top-bottom, bw=pw/bins;
  const bars=counts.map((c,i)=>{const h=c/max*ph; return `<rect x="${left+i*bw+1}" y="${top+ph-h}" width="${Math.max(1,bw-2)}" height="${h}" fill="#2f72ff" opacity="${.45+.5*i/bins}"/>`;}).join("");
  const medX=left+(stats.median/hi)*pw;
  svg.innerHTML = `<line x1="${left}" y1="${top+ph}" x2="${width-right}" y2="${top+ph}" stroke="#9badab"/>${bars}<line x1="${medX}" y1="${top}" x2="${medX}" y2="${top+ph}" stroke="#06171b" stroke-width="2"/><text x="${medX+5}" y="${top+12}" font-size="11" fill="#06171b">median ${money(stats.median)}</text><text x="${left}" y="${height-10}" font-size="10" fill="#607074">$0</text><text x="${width-right}" y="${height-10}" text-anchor="end" font-size="10" fill="#607074">${money(hi)}</text>`;
}

function renderRecommendations(inputs, baseline) {
  const rows = recommendations(inputs, baseline);
  if (!rows.length) {
    el("recommendationList").innerHTML = `<div class="recommendation-row"><div class="recommendation-name"><strong>All modeled controls are implemented</strong><span>Use the selectors to test a weaker or partial posture.</span></div></div>`;
    return;
  }
  el("recommendationList").innerHTML = rows.map((r,i) => `<div class="recommendation-row"><div class="recommendation-name"><strong>${i+1}. ${r.control.name}</strong><span>${r.control.map}</span></div><div class="delta good"><span>Success probability</span><strong>${r.successDelta <= 0 ? "" : "+"}${pct(r.successDelta,1)}</strong></div><div class="delta good"><span>Expected loss / attempt</span><strong>${r.lossDelta <= 0 ? "" : "+"}${money(r.lossDelta)}</strong></div><div class="delta"><span>Attacker cost</span><strong>${r.teacDelta >= 0 ? "+" : ""}${money(r.teacDelta)}</strong></div></div>`).join("");
}

function setupControls() {
  const defaults = { mfa:"partial", patching:"partial", edr:"partial", pam:"none", segmentation:"partial", backups:"implemented", monitoring:"partial" };
  el("controlsList").innerHTML = CONTROL_DEFS.map(c => `<div class="control-row"><label for="control-${c.id}">${c.name}<span>${c.map}</span></label><select id="control-${c.id}"><option value="implemented">Implemented</option><option value="partial" ${defaults[c.id]==="partial"?"selected":""}>Partial</option><option value="none" ${defaults[c.id]==="none"?"selected":""}>Not implemented</option><option value="unknown">Unknown</option></select></div>`).join("");
}

function scheduleRender() { clearTimeout(updateTimer); updateTimer=setTimeout(render,70); }

function reset() {
  el("modelForm").reset();
  const defaults = { mfa:"partial", patching:"partial", edr:"partial", pam:"none", segmentation:"partial", backups:"implemented", monitoring:"partial" };
  CONTROL_DEFS.forEach(c => el(`control-${c.id}`).value=defaults[c.id]);
  render();
}

function exportAssessment() {
  if (!latestResult) return;
  const payload = {
    schema: "pacer-assessment/1.0",
    exported_at: new Date().toISOString(),
    model_version: "2026.09",
    model_status: "Scenario model. Not validated for organization-specific prediction.",
    simulation: { draws: latestResult.draws, seed: latestResult.inputs.seed },
    inputs: latestResult.inputs,
    outputs: {
      teac_usd: latestResult.teac,
      scenario_success_probability: latestResult.success,
      probability_expected_roa_gt_1: latestResult.viability,
      loss_if_successful_usd: latestResult.loss,
      expected_attacker_proceeds_usd: latestResult.proceeds,
      expected_defender_loss_per_attempt_usd: latestResult.expectedLoss,
      pacer_cost_components: Object.fromEntries(COST_NAMES.map((n,i)=>[n.toLowerCase(), latestResult.costs[i]]))
    },
    evidence_boundary: {
      observed_anchors: ["Verizon 2026 DBIR", "Sophos State of Ransomware 2026", "Coveware Q4 2025", "Chainalysis 2026 Crypto Crime Report"],
      modeled_assumptions: ["PACER cost priors", "stage success priors", "cohort elasticities", "control effect sizes"]
    }
  };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `pacer-assessment-${new Date().toISOString().slice(0,10)}.json`; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function setupDialogs() {
  document.querySelectorAll("[data-dialog]").forEach(btn => btn.addEventListener("click",()=>el(`${btn.dataset.dialog}Dialog`).showModal()));
  document.querySelectorAll(".close-dialog").forEach(btn => btn.addEventListener("click",()=>btn.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));
}

function setupTooltip() {
  const tip=el("tooltip");
  document.querySelectorAll("[data-tip]").forEach(node => {
    node.addEventListener("mouseenter",e=>{tip.textContent=node.dataset.tip; tip.classList.add("show"); const r=node.getBoundingClientRect(); tip.style.left=`${Math.min(innerWidth-270,r.left)}px`; tip.style.top=`${r.bottom+8}px`;});
    node.addEventListener("mouseleave",()=>tip.classList.remove("show"));
    node.addEventListener("focus",()=>node.dispatchEvent(new Event("mouseenter")));
    node.addEventListener("blur",()=>tip.classList.remove("show"));
  });
}

setupControls();
el("modelForm").addEventListener("input", scheduleRender);
el("modelForm").addEventListener("change", scheduleRender);
el("resetBtn").addEventListener("click", reset);
el("exportBtn").addEventListener("click", exportAssessment);
setupDialogs(); setupTooltip(); render();
