/* Illustrative company economics and D3FEND portfolios; see SCENARIOS.md. */
(function (root, factory) {
  const result = factory();
  if (typeof module === "object" && module.exports) module.exports = result;
  root.TraceScenarios = result;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const VERSION = "2026.10.scenarios-1";
  const REVENUE_FIELDS = ["ransom", "cashTheft", "customerRecords", "intellectualProperty", "otherRevenue"];
  // Cohorts and values are scenario estimates, not legal size classes or population averages.
  const COMPANIES = {
    small: {name:"Small company", employees:"100–250", annualRevenue:25000000,
      revenueBand:"$10M–$50M", revenues:{ransom:100000,cashTheft:25000,customerRecords:10000,intellectualProperty:10000,otherRevenue:0}},
    medium: {name:"Mid-size company", employees:"251–1,000", annualRevenue:100000000,
      revenueBand:"$50M–$250M", revenues:{ransom:250000,cashTheft:100000,customerRecords:100000,intellectualProperty:100000,otherRevenue:0}},
    large: {name:"Large company", employees:"1,001–5,000", annualRevenue:2000000000,
      revenueBand:"$1B–$5B", revenues:{ransom:2000000,cashTheft:1000000,customerRecords:1000000,intellectualProperty:1000000,otherRevenue:0}}
  };
  const PORTFOLIOS = {
    poor: {name:"Poorly defended", effectiveness:.60,
      description:"Basic software updating and password policy, with incomplete rollout. MFA, endpoint monitoring and outbound controls are absent from this example.",
      techniques:["SoftwareUpdate","StrongPasswordPolicy"]},
    moderate: {name:"Moderately defended", effectiveness:.75,
      description:"Adds MFA, account monitoring, endpoint process analysis, network monitoring and outbound filtering. Gaps remain in segmentation, permissions and allowlisting.",
      techniques:["SoftwareUpdate","StrongPasswordPolicy","Multi-factorAuthentication","AuthenticationEventThresholding","ProcessAnalysis","NetworkTrafficAnalysis","OutboundTrafficFiltering"]},
    high: {name:"Highly defended", effectiveness:.90,
      description:"Adds segmentation, executable allowlisting, application hardening, file permissions and behavior-based monitoring. Broad deployment still leaves residual risk.",
      techniques:["SoftwareUpdate","StrongPasswordPolicy","Multi-factorAuthentication","AuthenticationEventThresholding","ProcessAnalysis","NetworkTrafficAnalysis","OutboundTrafficFiltering","InboundTrafficFiltering","ExecutableAllowlisting","ApplicationHardening","LocalFilePermissions","ResourceAccessPatternAnalysis"]}
  };
  function profileDocument(key) {
    const portfolio=PORTFOLIOS[key];
    if (!portfolio) throw new Error("Unknown defense portfolio.");
    return {selectedProfile:0,profiles:[{id:0,name:portfolio.name+" example company",includedLayers:["scenario"]}],
      layers:{scenario:{name:portfolio.name+" deployed controls",checked:true,
        techniques:portfolio.techniques.map(name=>({id:"d3f:"+name,checked:true})),children:[]}}};
  }
  function compare(input, parseProfile, analyze) {
    return Object.entries(PORTFOLIOS).map(([key,portfolio])=>({key,name:portfolio.name,effectiveness:portfolio.effectiveness,
      result:analyze({...input,defendProfile:parseProfile(profileDocument(key)),controlEffectiveness:portfolio.effectiveness})}));
  }
  return {VERSION,REVENUE_FIELDS,COMPANIES,PORTFOLIOS,profileDocument,compare};
});
