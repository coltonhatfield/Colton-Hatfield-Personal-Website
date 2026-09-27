"use strict";

(function attachPacerModel(root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PacerModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function buildPacerModel() {
  const MODEL_VERSION = "2026.09.5";
  const CUSTOMER_RECORD_VALUE = 7;
  const BASE_SUCCESS_PROBABILITY = 0.56;
  const MAX_DEFENSE_REDUCTION = 0.90;
  const DEFAULT_CONTROL_EFFECTIVENESS = 0.75;
  const DEFENSE_RESPONSE = 3;
  const RAAS_SHARE = 0.25;

  const TACTICS = [
    { key: "model", name: "Model", weight: 0.08, referenceCount: 6 },
    { key: "harden", name: "Harden", weight: 0.27, referenceCount: 69 },
    { key: "detect", name: "Detect", weight: 0.26, referenceCount: 81 },
    { key: "isolate", name: "Isolate", weight: 0.17, referenceCount: 33 },
    { key: "deceive", name: "Deceive", weight: 0.07, referenceCount: 9 },
    { key: "evict", name: "Evict", weight: 0.15, referenceCount: 25 }
  ];

  // The stage baselines multiply to the observed 56% conditional outcome.
  // They are not annual breach probabilities: they describe progression after
  // an organization is already in the population experiencing an attack.
  const ATTACK_STAGES = [
    { key: "access", name: "Initial access", baseline: 0.90, influences: { harden: 0.40, isolate: 0.35, detect: 0.15, deceive: 0.10 } },
    { key: "execution", name: "Execution & persistence", baseline: 0.89, influences: { harden: 0.40, detect: 0.35, isolate: 0.15, model: 0.10 } },
    { key: "expansion", name: "Expansion & exfiltration", baseline: 0.86, influences: { isolate: 0.30, detect: 0.30, harden: 0.15, deceive: 0.15, model: 0.10 } },
    { key: "impact", name: "Impact & monetization", baseline: BASE_SUCCESS_PROBABILITY / (0.90 * 0.89 * 0.86), influences: { evict: 0.40, detect: 0.20, isolate: 0.15, harden: 0.15, deceive: 0.10 } }
  ];

  const FIXED_COSTS = [
    { key: "preparation", name: "Preparation", value: 1250, evidence: "PACER assumption" },
    { key: "access", name: "Access acquisition", value: 8500, evidence: "Observed market average" },
    { key: "tools", name: "Tools & infrastructure", value: 650, evidence: "Published service prices + assumption" },
    { key: "labor", name: "Labor", value: 10000, evidence: "PACER assumption" },
    { key: "specialists", name: "Specialist services", value: 2500, evidence: "PACER assumption" },
    { key: "overhead", name: "Operational overhead", value: 1000, evidence: "PACER assumption" },
    { key: "enforcement", name: "Expected detection / apprehension", value: 2500, evidence: "1% × $250k PACER assumption" }
  ];

  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  function techniqueName(id) { return String(id || "").replace(/^d3f:/i, ""); }

  function classifyTechnique(id) {
    const name = techniqueName(id);
    if (/Decoy|Honeynet|Honeypot/i.test(name)) return "deceive";
    if (/Eviction|Deletion|Erasure|Formatting|Shutdown|Reboot|Termination|Suspension|Reissue|Restore|Unlock|Revocation|CacheInvalidation|Excision|Quarantine|Takedown|AccountLocking|EmailRemoval/i.test(name)) return "evict";
    if (/Isolation|Filtering|Allowlisting|Denylisting|Mediation|Restriction|EncryptedTunnel|DirectionalNetworkLink|BroadcastDomain|ProcessIsolation|AccessPolicy/i.test(name)) return "isolate";
    if (/Modeling|Mapping|Inventory|Enumeration|Dependency|Topology|Scope|AssetIdentification/i.test(name)) return "model";
    if (/Analysis|Monitoring|Detection|Profiling|Reputation|Thresholding|Verification|Beacon|Carving|Tracking|Comparisons|Anomaly|Inspection|Audit/i.test(name)) return "detect";
    return "harden";
  }

  function parseD3fendProfile(document) {
    if (!document || typeof document !== "object" || !Array.isArray(document.profiles)) {
      throw new Error("This file does not look like a D3FEND profile export (profiles list not found). ");
    }
    const selected = document.profiles.find(profile => String(profile.id) === String(document.selectedProfile)) || document.profiles[Number(document.selectedProfile)] || document.profiles[0];
    if (!selected || !Array.isArray(selected.includedLayers)) throw new Error("The selected D3FEND profile has no included layers.");

    const nodes = { ...(document.templates || {}), ...(document.layers || {}) };
    const layerIds = [...new Set(selected.includedLayers.filter(id => typeof id === "string"))];
    const missing = layerIds.filter(id => !nodes[id]);
    if (missing.length) throw new Error(`The export is missing ${missing.length} selected layer${missing.length === 1 ? "" : "s"}. Export the complete profile and try again.`);

    const techniques = new Set();
    const layerNames = [];
    const visited = new Set();
    function visit(id) {
      if (visited.has(id)) return;
      visited.add(id);
      const node = nodes[id];
      if (!node || node.checked === false) return;
      if (node.name && !layerNames.includes(node.name)) layerNames.push(String(node.name).slice(0, 120));
      (node.techniques || []).forEach(item => {
        if (typeof item?.id === "string" && /^d3f:/i.test(item.id)) techniques.add(item.id);
      });
      (node.children || []).forEach(visit);
    }
    layerIds.forEach(visit);

    const tacticCounts = Object.fromEntries(TACTICS.map(tactic => [tactic.key, 0]));
    const techniquesByTactic = Object.fromEntries(TACTICS.map(tactic => [tactic.key, []]));
    [...techniques].sort().forEach(id => {
      const tactic = classifyTechnique(id);
      tacticCounts[tactic] += 1;
      techniquesByTactic[tactic].push(techniqueName(id));
    });

    return {
      schema: "pacer-d3fend-profile/2.0",
      profileName: String(selected.name || "Imported D3FEND profile").slice(0, 160),
      selectedLayerCount: layerIds.length,
      selectedLayerNames: layerNames,
      techniqueCount: techniques.size,
      tacticCounts,
      techniquesByTactic
    };
  }

  function tacticCoverage(count, referenceCount) {
    if (count <= 0) return 0;
    const normalized = clamp(count / referenceCount, 0, 1);
    return (1 - Math.exp(-3 * normalized)) / (1 - Math.exp(-3));
  }

  function probabilityFromProfile(profile, omittedTactic = null, controlEffectiveness = DEFAULT_CONTROL_EFFECTIVENESS) {
    const rows = TACTICS.map(tactic => {
      const count = omittedTactic === tactic.key ? 0 : Number(profile?.tacticCounts?.[tactic.key]) || 0;
      const coverage = tacticCoverage(count, tactic.referenceCount);
      return { ...tactic, count, coverage, weightedCoverage: coverage * tactic.weight };
    });
    const represented = rows.filter(row => row.count > 0).length;
    const breadthMultiplier = represented === 0 ? 0 : 0.80 + 0.20 * (represented / TACTICS.length);
    const weightedCoverage = rows.reduce((sum, row) => sum + row.weightedCoverage, 0);
    const quality = clamp(Number(controlEffectiveness) || DEFAULT_CONTROL_EFFECTIVENESS, 0.40, 1);
    const coverageByTactic = Object.fromEntries(rows.map(row => [row.key, row.coverage]));
    const stages = ATTACK_STAGES.map(stage => {
      const pressure = Object.entries(stage.influences).reduce(
        (sum, [tactic, weight]) => sum + (coverageByTactic[tactic] || 0) * weight,
        0
      );
      const exponent = 1 + DEFENSE_RESPONSE * quality * breadthMultiplier * pressure;
      return {
        key: stage.key,
        name: stage.name,
        baseline: stage.baseline,
        pressure,
        probability: Math.pow(stage.baseline, exponent)
      };
    });
    const probability = stages.reduce((product, stage) => product * stage.probability, 1);
    const reduction = clamp(1 - probability / BASE_SUCCESS_PROBABILITY, 0, MAX_DEFENSE_REDUCTION);
    return {
      probability: clamp(probability, BASE_SUCCESS_PROBABILITY * (1 - MAX_DEFENSE_REDUCTION), BASE_SUCCESS_PROBABILITY),
      represented,
      breadthMultiplier,
      weightedCoverage,
      controlEffectiveness: quality,
      reduction,
      rows,
      stages
    };
  }

  function normalizeMoney(value) { return clamp(Number(value) || 0, 0, 1e11); }
  function normalizeInputs(raw) {
    return {
      ransom: normalizeMoney(raw.ransom),
      cashTheft: normalizeMoney(raw.cashTheft),
      customerRecords: clamp(Math.trunc(Number(raw.customerRecords) || 0), 0, 1e10),
      intellectualProperty: normalizeMoney(raw.intellectualProperty),
      otherRevenue: normalizeMoney(raw.otherRevenue),
      controlEffectiveness: clamp(Number(raw.controlEffectiveness) || DEFAULT_CONTROL_EFFECTIVENESS, 0.40, 1),
      defendProfile: raw.defendProfile || null
    };
  }

  function calculate(raw) {
    const inputs = normalizeInputs(raw);
    if (!inputs.defendProfile) throw new Error("A D3FEND profile is required.");
    const probability = probabilityFromProfile(inputs.defendProfile, null, inputs.controlEffectiveness);
    const revenues = [
      { key: "ransom", name: "Ransom", value: inputs.ransom },
      { key: "cash", name: "Cash or cash-equivalent theft", value: inputs.cashTheft },
      { key: "customer", name: "Customer-data resale", value: inputs.customerRecords * CUSTOMER_RECORD_VALUE },
      { key: "ip", name: "Intellectual property", value: inputs.intellectualProperty },
      { key: "other", name: "Other revenue", value: inputs.otherRevenue }
    ];
    const totalValue = revenues.reduce((sum, item) => sum + item.value, 0);
    const expectedRevenue = totalValue * probability.probability;
    const costs = FIXED_COSTS.map(item => ({ ...item }));
    costs.splice(6, 0, { key: "monetization", name: "Monetization / RaaS share", value: expectedRevenue * RAAS_SHARE, evidence: "25% of expected revenue" });
    const totalCost = costs.reduce((sum, item) => sum + item.value, 0);
    const profit = expectedRevenue - totalCost;

    const influences = probability.rows.map(row => {
      if (!row.count) return { ...row, probabilityPoints: 0 };
      const without = probabilityFromProfile(inputs.defendProfile, row.key, inputs.controlEffectiveness).probability;
      return { ...row, probabilityPoints: Math.max(0, without - probability.probability) };
    }).sort((a, b) => b.probabilityPoints - a.probabilityPoints);

    return {
      inputs,
      profitable: profit > 0,
      totalValue,
      expectedRevenue,
      totalCost,
      profit,
      revenues,
      costs,
      successProbability: probability.probability,
      defenseReduction: probability.reduction,
      tacticRows: probability.rows,
      representedTactics: probability.represented,
      attackStages: probability.stages,
      influences,
      assumptions: [
        { label: "Conditional baseline", value: "56%", note: "Sophos 2026 encryption rate among organizations attacked" },
        { label: "Control effectiveness", value: `${Math.round(inputs.controlEffectiveness * 100)}%`, note: "Selected enterprise coverage and operational quality" },
        { label: "Customer-data resale", value: "$7 / record", note: "Peer-reviewed median for compromised online accounts" },
        { label: "Business access", value: "$8,500", note: "Observed access-market average" },
        { label: "RaaS/operator share", value: "25%", note: "Midpoint of the observed 20–30% range" },
        { label: "Monetization probability", value: "Not discounted", note: "All entered value is treated as extractable after success" }
      ]
    };
  }

  return {
    MODEL_VERSION, CUSTOMER_RECORD_VALUE, BASE_SUCCESS_PROBABILITY, MAX_DEFENSE_REDUCTION,
    DEFAULT_CONTROL_EFFECTIVENESS, DEFENSE_RESPONSE, RAAS_SHARE,
    TACTICS, ATTACK_STAGES, FIXED_COSTS, classifyTechnique, parseD3fendProfile, tacticCoverage,
    probabilityFromProfile, normalizeInputs, calculate
  };
});
