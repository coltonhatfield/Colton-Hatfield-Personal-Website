"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  CUSTOMER_RECORD_VALUE, BASE_SUCCESS_PROBABILITY, DEFAULT_CONTROL_EFFECTIVENESS, TACTICS,
  parseD3fendProfile, probabilityFromProfile, calculate
} = require("./model.js");

function fixture(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), "utf8"));
}

const partial = parseD3fendProfile(fixture("d3fend-profile.json"));
const complete = parseD3fendProfile(fixture("d3fend-profile-all-selected.json"));

assert.equal(complete.techniqueCount, 223, "complete fixture should deduplicate selected techniques");
assert.equal(Object.values(complete.tacticCounts).reduce((a, b) => a + b, 0), complete.techniqueCount);
assert.equal(Object.keys(complete.tacticCounts).length, TACTICS.length);
assert.ok(Object.values(complete.tacticCounts).every(count => count > 0), "complete fixture should cover all tactics");

const noTechniques = { tacticCounts: Object.fromEntries(TACTICS.map(tactic => [tactic.key, 0])) };
assert.equal(probabilityFromProfile(noTechniques).probability, BASE_SUCCESS_PROBABILITY);
assert.ok(probabilityFromProfile(complete).probability < probabilityFromProfile(partial).probability);
assert.ok(probabilityFromProfile(complete).probability < 0.20);
assert.ok(probabilityFromProfile(complete).probability > 0.10);
assert.ok(probabilityFromProfile(complete, null, 1).probability < probabilityFromProfile(complete, null, DEFAULT_CONTROL_EFFECTIVENESS).probability);

const vulnerable = parseD3fendProfile(fixture("vulnerable-org-profile.json"));
const moderate = parseD3fendProfile(fixture("moderately-secure-org-profile.json"));
const highlySecure = parseD3fendProfile(fixture("highly-secure-org-profile.json"));
assert.ok(probabilityFromProfile(vulnerable).probability > probabilityFromProfile(moderate).probability);
assert.ok(probabilityFromProfile(moderate).probability > probabilityFromProfile(highlySecure).probability);
assert.equal(probabilityFromProfile(highlySecure).stages.length, 4);

const result = calculate({
  ransom: 100000,
  cashTheft: 20000,
  customerRecords: 1000,
  intellectualProperty: 30000,
  otherRevenue: 5000,
  defendProfile: complete
});
assert.equal(result.totalValue, 100000 + 20000 + 1000 * CUSTOMER_RECORD_VALUE + 30000 + 5000);
assert.equal(result.expectedRevenue, result.totalValue * result.successProbability);
assert.equal(result.profit, result.expectedRevenue - result.totalCost);
assert.equal(result.costs.length, 8);
assert.equal(result.profitable, result.profit > 0);

const highValue = calculate({ ransom: 10000000, defendProfile: partial });
const lowValue = calculate({ ransom: 0, defendProfile: partial });
assert.ok(highValue.profitable);
assert.ok(!lowValue.profitable);
assert.ok(highValue.totalCost > lowValue.totalCost, "RaaS share should scale monetization cost with expected revenue");

assert.throws(() => parseD3fendProfile({}), /profiles list/);
assert.throws(() => calculate({ ransom: 1 }), /profile is required/);

console.log("PACER model tests passed");
