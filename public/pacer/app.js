"use strict";

const { MODEL_VERSION, TACTICS, parseD3fendProfile, calculate } = window.PacerModel;
const REVENUE_COLORS = ["#ee735e", "#2f72ff", "#5de4c7", "#8267d6", "#f0b44d"];
const COST_COLORS = ["#2f72ff", "#5de4c7", "#8267d6", "#ee735e", "#f0b44d", "#7a8f8b", "#b65f94", "#23464b"];
let loadedProfile = null;
let renderTimer = null;

function el(id) { return document.getElementById(id); }
function inputNumber(id) { return Number(el(id).value) || 0; }
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]);
}
function money(value) {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (absolute >= 1e9) return `${sign}$${(absolute / 1e9).toFixed(absolute >= 1e10 ? 1 : 2)}B`;
  if (absolute >= 1e6) return `${sign}$${(absolute / 1e6).toFixed(absolute >= 1e7 ? 1 : 2)}M`;
  if (absolute >= 1e3) return `${sign}$${Math.round(absolute / 1e3).toLocaleString()}k`;
  return `${sign}$${Math.round(absolute).toLocaleString()}`;
}
function percent(value, digits = 1) { return `${(value * 100).toFixed(digits)}%`; }

function getInputs() {
  return {
    ransom: inputNumber("ransom"), cashTheft: inputNumber("cashTheft"),
    customerRecords: inputNumber("customerRecords"), intellectualProperty: inputNumber("intellectualProperty"),
    otherRevenue: inputNumber("otherRevenue"), defendProfile: loadedProfile
  };
}

function setProfileStatus(message, state = "") {
  const node = el("defendProfileStatus");
  node.className = `profile-status ${state}`.trim();
  node.textContent = message;
}

function renderBar(barId, legendId, items, colors) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  el(barId).innerHTML = total > 0 ? items.map((item, index) =>
    `<div class="pacer-segment" style="width:${item.value / total * 100}%;background:${colors[index]}" title="${escapeHtml(item.name)}: ${money(item.value)}"></div>`
  ).join("") : `<div class="pacer-segment empty-segment" style="width:100%"></div>`;
  el(legendId).innerHTML = items.map((item, index) =>
    `<div class="legend-item"><span><i style="background:${colors[index]}"></i>${escapeHtml(item.name)}</span><strong>${money(item.value)}</strong>${item.evidence ? `<small>${escapeHtml(item.evidence)}</small>` : ""}</div>`
  ).join("");
}

function renderCoverage(result) {
  el("profileSummary").textContent = `${result.inputs.defendProfile.techniqueCount} techniques · ${result.representedTactics}/6 tactics`;
  el("coverageList").innerHTML = result.tacticRows.map(row =>
    `<div class="coverage-row"><div><span>${row.name}</span><strong>${row.count} techniques</strong></div><div class="coverage-track"><i style="width:${row.coverage * 100}%"></i></div><small>${percent(row.coverage, 0)} modeled coverage</small></div>`
  ).join("");
}

function renderInfluence(result) {
  const top = result.influences.filter(item => item.probabilityPoints > 0).slice(0, 3);
  el("influenceGrid").innerHTML = top.length ? top.map(item => {
    const examples = result.inputs.defendProfile.techniquesByTactic[item.key].slice(0, 3).join(", ");
    return `<div class="sensitivity-item"><span>${escapeHtml(item.name)}</span><strong class="positive">−${percent(item.probabilityPoints, 1)} pts</strong><small>${item.count} techniques${examples ? ` · ${escapeHtml(examples)}` : ""}</small></div>`;
  }).join("") : `<div class="sensitivity-item"><span>No credited techniques</span><strong>0.0 pts</strong><small>The uploaded profile contains no checked D3FEND techniques.</small></div>`;
}

function renderAssumptions(result) {
  el("assumptionList").innerHTML = result.assumptions.map(item =>
    `<div><span>${item.label}</span><strong>${item.value}</strong><small>${item.note}</small></div>`
  ).join("");
}

function render() {
  if (!loadedProfile) {
    el("emptyResult").hidden = false;
    el("calculatedResult").hidden = true;
    el("assessmentState").textContent = "Awaiting D3FEND profile";
    return;
  }
  const result = calculate(getInputs());
  el("emptyResult").hidden = true;
  el("calculatedResult").hidden = false;
  el("assessmentState").textContent = "Calculated locally";

  const verdict = result.profitable ? "PROFITABLE" : "UNPROFITABLE";
  el("verdictCard").className = `verdict-card ${result.profitable ? "profitable" : "unprofitable"}`;
  el("verdictLabel").textContent = result.profitable ? "Expected return exceeds cost" : "Expected cost meets or exceeds return";
  el("verdictText").textContent = verdict;
  el("verdictExplanation").textContent = result.profitable
    ? `A financially motivated attacker has an estimated ${money(result.profit)} positive expected return.`
    : `The scenario has an estimated ${money(Math.abs(result.profit))} expected shortfall for the attacker.`;
  el("profitValue").textContent = money(result.profit);
  el("successValue").textContent = percent(result.successProbability, 1);
  el("successDetail").textContent = `${percent(result.defenseReduction, 0)} modeled reduction from the 56% baseline`;
  el("valueValue").textContent = money(result.totalValue);
  el("expectedRevenueValue").textContent = money(result.expectedRevenue);
  el("attackCostValue").textContent = money(result.totalCost);

  renderBar("revenueBar", "revenueLegend", result.revenues, REVENUE_COLORS);
  renderBar("costBar", "costLegend", result.costs, COST_COLORS);
  renderCoverage(result);
  renderInfluence(result);
  renderAssumptions(result);
}

async function loadProfile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    setProfileStatus("The profile is larger than 10 MB. Export a smaller D3FEND profile and try again.", "error");
    event.target.value = "";
    return;
  }
  try {
    loadedProfile = parseD3fendProfile(JSON.parse(await file.text()));
    setProfileStatus(`${loadedProfile.profileName} · ${loadedProfile.selectedLayerCount} selected layers · ${loadedProfile.techniqueCount} checked techniques`, "loaded");
    render();
  } catch (error) {
    loadedProfile = null;
    setProfileStatus(error instanceof SyntaxError ? "That file is not valid JSON." : error.message, "error");
    render();
  }
  event.target.value = "";
}

function reset() {
  el("modelForm").reset();
  loadedProfile = null;
  el("defendProfileFile").value = "";
  setProfileStatus("No profile uploaded. A complete profile is required to calculate a result.");
  render();
}

function setupDialogs() {
  document.querySelectorAll("[data-dialog]").forEach(button => button.addEventListener("click", () => el(`${button.dataset.dialog}Dialog`).showModal()));
  document.querySelectorAll(".close-dialog").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }));
}

el("modelVersion").textContent = MODEL_VERSION;
el("defendProfileFile").addEventListener("change", loadProfile);
el("modelForm").addEventListener("input", () => { clearTimeout(renderTimer); renderTimer = setTimeout(render, 60); });
el("resetBtn").addEventListener("click", reset);
setupDialogs();
render();
