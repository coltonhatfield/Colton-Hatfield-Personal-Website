"use strict";
const {parseD3fendProfile}=window.PacerModel;
const {VERSION,analyze}=window.PacerPaths;
const catalog=window.PacerCatalog;
const scenarios=window.TraceScenarios;
let loadedProfile=null,exampleLoaded=false,latest=null,comparison=[],timer=null,profileLoadVersion=0;
const el=id=>document.getElementById(id);
const num=id=>Number(el(id).value)||0;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
function money(n){let s=n<0?"−":"",v=Math.abs(n);return s+"$"+(v>=1e9?(v/1e9).toFixed(2)+"B":v>=1e6?(v/1e6).toFixed(2)+"M":v>=1e3?Math.round(v/1e3).toLocaleString()+"k":Math.round(v).toLocaleString());}
const pct=n=>(n*100).toFixed(1)+"%";
const code=name=>catalog.techniques[name]?.code||"D3FEND";
const label=name=>name.replace(/([a-z])([A-Z])/g,"$1 $2");
function inputs(){return {ransom:num("ransom"),cashTheft:num("cashTheft"),customerRecords:num("customerRecords"),intellectualProperty:num("intellectualProperty"),otherRevenue:num("otherRevenue"),controlEffectiveness:num("controlEffectiveness")/100,defendProfile:loadedProfile,surfaces:{remote:el("surfaceRemote").checked,email:el("surfaceEmail").checked,web:el("surfaceWeb").checked}};}
function scenarioMetadata(){return {version:scenarios.VERSION,companySize:el("companySize").value,defensePortfolio:el("defensePortfolio").value,illustrativeProfile:exampleLoaded};}
function techniqueLinks(names){return names.map(name=>`<a href="https://d3fend.mitre.org/technique/d3f%3A${encodeURIComponent(name)}/" target="_blank" rel="noreferrer">${esc(code(name))} ${esc(label(name))}</a>`).join(" · ");}
function showPresetDefinitions(){
  const rows=[["Illustrative employees",c=>c.employees],["Annual business revenue (context)",c=>money(c.annualRevenue)],["Annual revenue band (context)",c=>c.revenueBand],["Payable ransom estimate",c=>money(c.revenues.ransom)],["Accessible cash estimate",c=>money(c.revenues.cashTheft)],["Accessible customer records",c=>c.revenues.customerRecords.toLocaleString()],["Monetizable IP estimate",c=>money(c.revenues.intellectualProperty)],["Other monetizable value",c=>money(c.revenues.otherRevenue)]];
  el("presetValues").innerHTML=rows.map(([name,value])=>`<tr><th scope="row">${name}</th>${Object.values(scenarios.COMPANIES).map(c=>`<td>${esc(value(c))}</td>`).join("")}</tr>`).join("");
  el("portfolioDefinitions").innerHTML=Object.values(scenarios.PORTFOLIOS).map(p=>`<section><h3>${p.name} · ${p.techniques.length} techniques · ${pct(p.effectiveness)} coverage assumption</h3><p>${p.description}</p><p>${techniqueLinks(p.techniques)}</p></section>`).join("");
}
function renderScenario(){
  const company=scenarios.COMPANIES[el("companySize").value],portfolio=scenarios.PORTFOLIOS[el("defensePortfolio").value];
  el("scenarioSummary").textContent=(company?`${company.name} · ${company.employees} illustrative employees · ${money(company.annualRevenue)} annual revenue context`:"Custom revenue inputs")+` · ${portfolio?portfolio.name:loadedProfile.profileName} · ${loadedProfile.techniqueCount} D3FEND techniques · ${num("controlEffectiveness")}% assumed coverage`;
}
function updateProfileStatus(){
  el("defendProfileStatus").innerHTML=`<strong>${esc(loadedProfile.profileName)}</strong> · ${loadedProfile.techniqueCount} checked techniques${exampleLoaded?" · illustrative portfolio":" · uploaded profile"}<details><summary>View active D3FEND techniques</summary><p>${techniqueLinks(loadedProfile.techniqueIds)}</p></details>`;
  el("defendProfileStatus").className="profile-status loaded";
}
function renderComparison(){
  comparison=scenarios.compare(inputs(),parseD3fendProfile,analyze);
  const selected=el("defensePortfolio").value;
  el("comparisonSummary").innerHTML=comparison.map(c=>`<div class="${selected===c.key?"selected-portfolio":""}"><span>${c.name}${selected===c.key?" · selected":""}</span><strong>${money(c.result.bestProfit)}</strong><small>best remaining profit · ${c.result.profitable.length}/${c.result.evaluatedCount} profitable paths</small></div>`).join("");
  const lookups=comparison.map(c=>new Map(c.result.candidates.map(p=>[p.id,p])));
  el("comparisonRows").innerHTML=comparison[0].result.candidates.map(path=>`<tr><th scope="row">${esc(path.name)}</th>${comparison.map((c,i)=>{const p=lookups[i].get(path.id);return `<td class="${selected===c.key?"selected-portfolio ":""}${p.profitable?"":"unprofitable"}"><b>${money(p.profit)}</b><small>${pct(p.probability)} completion</small></td>`;}).join("")}</tr>`).join("")||'<tr><td colspan="4">No attack surfaces selected. Enable a route to compare paths.</td></tr>';
  document.querySelectorAll("[data-portfolio]").forEach(cell=>cell.classList.toggle("selected-portfolio",cell.dataset.portfolio===selected));
}
function applyCompany(){const company=scenarios.COMPANIES[el("companySize").value];if(!company)return;for(const field of scenarios.REVENUE_FIELDS)el(field).value=company.revenues[field];clearTimeout(timer);render();}
function applyPortfolio(){const key=el("defensePortfolio").value,portfolio=scenarios.PORTFOLIOS[key];if(!portfolio)return;profileLoadVersion++;loadedProfile=parseD3fendProfile(scenarios.profileDocument(key));exampleLoaded=true;el("controlEffectiveness").value=portfolio.effectiveness*100;updateProfileStatus();clearTimeout(timer);render();}
function defense(d){return `<li><b>${d.selected?"In profile":"Candidate"}</b> ${esc(d.name)} · <a href="https://attack.mitre.org/mitigations/${d.mitigation}/" target="_blank" rel="noreferrer">${d.mitigation}</a> → ${esc(code(d.defend))} ${esc(label(d.defend))}</li>`;}
function pathCard(p,i){
  const max=Math.max(1,...latest.candidates.map(x=>x.profit)),width=Math.max(2,Math.min(100,p.profit/max*100));
  const objective=`${p.timing.objectiveDays[0]}${p.timing.objectiveDays[0]===p.timing.objectiveDays[1]?"":`–${p.timing.objectiveDays[1]}`} days`;
  const collection=`${p.timing.collectionDays[0]}–${p.timing.collectionDays[1]} days`;
  const timingDetail=`<p class="timing-detail"><b>Timing breakdown:</b> ${objective} from access to ${esc(p.timing.objectiveName)} (${p.timing.objectiveEvidence==="TRACE assumption"?"assumed":"Mandiant observed median"}); plus ${collection} for ${esc(p.timing.collectionName)} (assumed). The total is a planning window, not a measured path duration; payout may never occur. ${p.timing.objectiveEvidence==="TRACE assumption"?"":`<a href="${p.timing.source}" target="_blank" rel="noreferrer">Mandiant source ↗</a>`}</p>`;
  const timing=`<small>Access → payout, if collected</small><b>${esc(p.timing.label)}</b><span>Illustrative range · not an average</span><details><summary>How estimated</summary>${timingDetail}</details>`;
  return `<article class="attack-path"><div class="path-heading"><div><span class="path-rank">#${i+1} · ${esc(p.goal.toUpperCase())}</span><h3>${esc(p.name)}</h3></div><strong>${money(p.profit)}<small>expected profit</small></strong></div><div class="roi-track"><span style="width:${width}%"></span></div><div class="path-metrics"><div><small>Modeled path completion</small><b>${pct(p.probability)}</b></div><div><small>Payout if reached</small><b>${money(p.payout)}</b></div><div><small>Expected payout</small><b>${money(p.expectedRevenue)}</b></div><div><small>Expected cost</small><b>${money(p.totalCost)}</b></div><div class="timing-metric">${timing}</div></div><p class="metric-help">Path completion multiplies assumed chances of continuing through each step. It is not a measured breach rate or a chance of this company being attacked.</p><div class="attack-flow" aria-label="ATT&CK technique path">${p.steps.map((s,j)=>`${j?'<span class="flow-arrow" aria-hidden="true">→</span>':''}<div class="flow-node"><span>${j+1}</span><a href="https://attack.mitre.org/techniques/${s.id.replace(".","/")}/" target="_blank" rel="noreferrer">${s.id}</a><b>${esc(s.name)}</b><small>${pct(s.cumulativeProbability)} modeled reach to here</small></div>`).join("")}</div><details class="path-details"><summary>View costs, mitigations and D3FEND techniques</summary><div class="cost-chips">${p.resource.map(r=>`<span>${esc(r.name)} <b>${money(r.amount)}</b> <small>${esc(r.source)}</small></span>`).join("")}<span>Reach-weighted labor <b>${money(p.costs.labor)}</b> <small>$250/stage assumption</small></span><span>Collection fees <b>${money(p.costs.collectionFee)}</b> <small>assumption</small></span></div><p>Technique/defense alignment is a curated scenario, not a direct one-to-one MITRE mapping. Selected means present in the profile, not verified effective.</p>${p.steps.map(s=>`<details class="step-detail"><summary><span>${s.id} · ${esc(s.name)}</span><b>${s.outcome?"Outcome marker":pct(s.conditionalPass)+" step continuation"}</b></summary><p class="step-explain">${s.outcome?"The payout assumption handles this outcome; it has no separate modeled pass probability.":`If the attacker reaches this step, TRACE assumes a ${pct(s.conditionalPass)} chance of continuing after the credited defenses. This is a model assumption, not a measured success rate.`}</p><ul>${s.defenses.length?s.defenses.map(defense).join(""):"<li>No separate defense mapping for this outcome marker.</li>"}</ul></details>`).join("")}</details></article>`;
}
function controlCard(c,i){return `<div class="control-row"><span class="control-rank">0${i+1}</span><div><h4>${esc(c.name)}</h4><small><a href="https://attack.mitre.org/mitigations/${c.mitigation}/" target="_blank" rel="noreferrer">${c.mitigation}</a> → ${esc(code(c.defend))} ${esc(label(c.defend))} · touches ${c.affected} paths</small></div><strong>−${money(c.reduction)}<small>best-path profit</small></strong></div>`;}
function render(){if(!loadedProfile){latest=null;el("emptyResult").hidden=false;el("calculatedResult").hidden=true;el("assessmentState").textContent="Awaiting D3FEND profile";return;}latest=analyze(inputs());renderScenario();renderComparison();el("emptyResult").hidden=true;el("calculatedResult").hidden=false;el("exampleBanner").hidden=!exampleLoaded;el("assessmentState").textContent=`${exampleLoaded?"EXAMPLE COMPANY · ":""}${loadedProfile.techniqueCount} D3FEND techniques evaluated`;el("pathHeadline").textContent=latest.top.length?`Top ${latest.top.length} profitable attack path${latest.top.length===1?"":"s"}`:"No modeled path is profitable";el("pathSubhead").textContent=`${latest.profitable.length} positive-return paths among ${latest.evaluatedCount} curated scenarios. Ranked by expected attacker profit.`;el("bestProfit").textContent=money(latest.bestProfit);el("pathCount").textContent=`${latest.top.length} of ${latest.evaluatedCount} paths shown · ${loadedProfile.profileName}`;el("pathList").innerHTML=latest.top.length?latest.top.map(pathCard).join(""):`<div class="no-paths">No positive-return path under these inputs. This is not proof of immunity; expand the path library and validate the environment.</div>`;el("controlList").innerHTML=latest.recommendations.some(r=>r.reduction>0)?latest.recommendations.map(controlCard).join(""):`<div class="no-paths">No proposed D3FEND technique reduces the highest positive return in this limited path library.</div>`;}
function activateDemo(){el("companySize").value="medium";el("defensePortfolio").value="moderate";for(const field of scenarios.REVENUE_FIELDS)el(field).value=scenarios.COMPANIES.medium.revenues[field];applyPortfolio();}
async function loadProfile(event){
  const file=event.target.files?.[0];if(!file)return;
  const request=++profileLoadVersion,status=el("defendProfileStatus");
  event.target.value="";
  if(file.size>10*1024*1024){status.textContent="Profile exceeds 10 MB. Current assessment remains loaded.";status.className="profile-status error";return;}
  try{
    const profile=parseD3fendProfile(JSON.parse(await file.text()));
    if(request!==profileLoadVersion)return;
    loadedProfile=profile;exampleLoaded=false;el("defensePortfolio").value="custom";updateProfileStatus();
  }catch(e){if(request!==profileLoadVersion)return;status.textContent=(e instanceof SyntaxError?"That file is not valid JSON.":e.message)+" Current assessment remains loaded.";status.className="profile-status error";}
  clearTimeout(timer);render();
}
function download(text,mime,name){const url=URL.createObjectURL(new Blob([text],{type:mime})),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function downloadJson(){if(latest){clearTimeout(timer);render();download(JSON.stringify({model:VERSION,created:new Date().toISOString(),scenario:scenarioMetadata(),inputs:inputs(),comparison,result:latest},null,2),"application/json","trace-attack-paths.json");}}
function downloadCsv(){if(!latest)return;clearTimeout(timer);render();const q=v=>`"${String(v??"").replaceAll('"','""')}"`,rows=[["company_size","defense_portfolio","control_effectiveness","rank","path","goal","attack_surface","attack_techniques","modeled_path_reach","payout_if_reached","expected_revenue","upfront_cost","labor_cost","collection_fee","total_cost","expected_profit","profitable","access_to_payout_estimate","objective_days_assumed_or_observed","collection_days_assumed","objective_evidence","timing_context_source","mitigations","d3fend_techniques"]];latest.candidates.forEach((p,i)=>{const ds=p.steps.flatMap(s=>s.defenses);rows.push([el("companySize").value,el("defensePortfolio").value,num("controlEffectiveness")/100,i+1,p.name,p.goal,p.surface,p.steps.map(s=>s.id).join(" → "),p.probability,p.payout,p.expectedRevenue,p.costs.upfront,p.costs.labor,p.costs.collectionFee,p.totalCost,p.profit,p.profitable,p.timing.label,p.timing.objectiveDays.join("–"),p.timing.collectionDays.join("–"),p.timing.objectiveEvidence,p.timing.source,[...new Set(ds.map(d=>d.mitigation))].join("; "),[...new Set(ds.map(d=>code(d.defend)))].join("; ")]);});download(rows.map(r=>r.map(q).join(",")).join("\r\n"),"text/csv","trace-attack-paths.csv");}
// Keep mobile inputs collapsed initially; desktop always shows the full form.
const mobileLayout=window.matchMedia("(max-width: 820px)");
let mobileInputsExpanded=false;
function syncOpportunityPanel(){
  const expanded=!mobileLayout.matches||mobileInputsExpanded;
  el("modelForm").hidden=!expanded;
  el("opportunityToggle").setAttribute("aria-expanded",String(expanded));
  document.querySelector(".inputs-panel").classList.toggle("inputs-expanded",expanded);
}
el("opportunityToggle").addEventListener("click",()=>{mobileInputsExpanded=!mobileInputsExpanded;syncOpportunityPanel();});
mobileLayout.addEventListener("change",syncOpportunityPanel);
syncOpportunityPanel();
document.querySelectorAll("[data-dialog]").forEach(b=>b.addEventListener("click",()=>el(`${b.dataset.dialog}Dialog`).showModal()));document.querySelectorAll(".close-dialog").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));document.querySelectorAll("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d)d.close();}));
el("companySize").addEventListener("change",applyCompany);
el("defensePortfolio").addEventListener("change",applyPortfolio);
el("modelVersion").textContent=VERSION;el("defendProfileFile").addEventListener("change",loadProfile);
el("modelForm").addEventListener("input",event=>{if(scenarios.REVENUE_FIELDS.includes(event.target.id))el("companySize").value="custom";if(event.target.id==="controlEffectiveness")el("defensePortfolio").value="custom";clearTimeout(timer);timer=setTimeout(render,60);});
el("resetBtn").addEventListener("click",()=>{el("modelForm").reset();activateDemo();});el("downloadJson").addEventListener("click",downloadJson);el("downloadCsv").addEventListener("click",downloadCsv);showPresetDefinitions();activateDemo();
