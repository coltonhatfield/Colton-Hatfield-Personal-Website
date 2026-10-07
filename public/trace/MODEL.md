# TRACE model card — 2026.09.6

This release corrects accounting and defensive-profile interpretation without adding input fields or changing the visual design. It is a deterministic, offline scenario model, **not a validated company-specific forecast**. Changes improve internal validity; predictive accuracy cannot be established from three illustrative profiles without observed attack outcomes.

## Evidence and what it actually measures

Sources checked September 2026:

| Source | Observation | How TRACE uses it / limitation |
|---|---|---|
| [Sophos State of Ransomware 2026](https://www.sophos.com/en-us/blog/sophos-state-of-ransomware-2026) | 56% encryption among surveyed ransomware victims; 48% of encrypted victims paid | Impact reference and payment reference. Neither measures all attacks, an undefended company, or causal control efficacy. |
| [MITRE ontology](https://d3fend.mitre.org/resources/ontology/) and [FAQ](https://d3fend.mitre.org/faq/) | Technique hierarchy and tactics; no effectiveness estimates | Official technique classification, never effectiveness scores. |
| [Nurmi et al., ARES 2023](https://arxiv.org/abs/2306.15726) | $7 median **asking price for compromised online accounts** | Retained as a proxy ceiling, not a universal customer-record sale price. Generic records can be substantially less valuable. |
| [Trend Micro, December 2021](https://newsroom.trendmicro.com/2021-12-01-Thriving-Access-as-a-Service-Cybercrime-Market-Fuels-Ransomware-Attacks) | Approximately $8,500 average business administrative-access price | Dated asking-price anchor for one access-broker scenario, not current typical acquisition cost for all attackers. |
| [Existing congressional reference](https://www.govinfo.gov/content/pkg/CHRG-118hhrg56438/pdf/CHRG-118hhrg56438.pdf) | Previous project cites a 20–30% developer share | 25% retained as an assumed affiliate commission. The PDF could not be independently re-fetched during this review; not treated as newly verified. |

The local Phase 1 paper and project PDF were read. The earlier PDF deliberately omitted monetization for simplicity; this release revises that simplification in response to the request for greater accuracy. `PacerThoughts.docx` is not a valid ZIP/Word container and could not be read.

## Taxonomy and profile ingestion

`d3fend-catalog.js` contains 271 named techniques derived from MITRE D3FEND 1.6.0. `build-catalog.py` regenerates it from the retained JSON-LD snapshot; the generated catalog records the source URL and SHA-256. There is no live ontology request when the site runs.

Only selected layers and their reachable children are traversed. Explicit `checked:false` on either a layer or technique suppresses credit. Exports omitting technique-level `checked` are supported because membership in a selected layer is the native export representation. Duplicate names, case variants and D3 short IDs collapse to one technique. Cycles terminate. Missing selected/child layers and malformed lists fail clearly. Unknown IDs receive no credit and are counted in the existing assumptions panel. Invalid profile selection does not silently select the first profile.

MITRE distinguishes Restore from Evict. Both appear in the existing sixth display row, labeled **Evict / Restore**, but remain distinct internally. Permissions now map to Isolate, not a catch-all Harden classification. All 223 unique techniques in the supplied full export are recognized.

## Defensive effects

Effectiveness coefficients are explicitly assumed. They are not trained on the three example companies or inferred from their names. Every family has an auditable four-stage vector in `FAMILY_EFFECTS`; individual relative strengths are in `STRENGTHS`. The default strength is 0.65 for a specific technique and 0.35 for a broad family selection. Important exceptions include password-only authentication 0.10, MFA 0.85, patching 0.85, basic network filtering 0.40 and segmentation 0.80. These relative judgments require future empirical validation.

Within a family, only the maximum selected strength contributes. Adding a parent alongside a stronger child, duplicate controls, or equivalent variants cannot compound credit. This conservative treatment may under-credit genuinely complementary techniques within a family. Across families, stage saturation limits overlapping benefits. Unrelated physical/OT controls receive no prevention credit for the generic remote enterprise scenario.

```text
family strength = max(selected technique strengths in family)
response strength = max(credential, object, process eviction strengths)
detect/deceive actionability = 0.25 + 0.75 × response strength × quality
stage pressure = sum(family strength × stage coefficient × actionability)
stage probability = stage baseline × [1 − 0.40 × quality × (1 − exp(−defenseScale × pressure))]
path probability = product(conditional stage probabilities)
```

Actionability is one for other families. Detection alone receives limited credit; combining detection with response increases it. The 40% maximum reduction at each stage prevents a catalog of controls from implying certainty of prevention. This bound is a modeling choice, not an empirical efficacy estimate. The existing quality selector applies operational coverage once to direct defense pressure; response dependency also reflects response quality.

The four reference stages are 0.90, 0.89, 0.86 and 0.56/(0.90×0.89×0.86). They multiply to 0.56. **Only that aggregate encryption observation is sourced; the stage decomposition and its transfer to a scenario are assumptions.** In particular, Sophos did not measure an initial-access success probability or an undefended counterfactual. No-controls returns the reference as a convention, not a measured no-controls rate. The display therefore calls this conditional **impact**, not universal attack or collection success.

RestoreObject controls reduce ransom collection through an assumed recovery adjustment. They never retroactively reduce encryption or stolen data. RestoreAccess alone does not establish a usable data backup and earns no ransom reduction. Missing a tactic does not incur a discontinuous breadth penalty. Marginal tactic influences are leave-one-tactic-out changes, not additive attributions or ROI recommendations.

## Revenue and monetization

The inputs are unchanged and remain maximum distinct amounts available. Do not enter the same stolen funds under multiple channels, or combine mutually exclusive resale and ransom promises as if both are assured.

| Channel | Technical prerequisite | Realization fraction after prerequisite |
|---|---|---:|
| Ransom | Full impact path | 0.48 × (1 − 0.35 × recovery strength × quality) |
| Cash theft | Through execution stage | 0.75 |
| Customer data | Through expansion/data-access stage | 0.35 |
| IP | Through expansion/data-access stage | 0.20 |
| Other | Full path, conservative generic convention | 0.50 |

Only the 0.48 ransomware reference is observational, and its transfer to this company is still assumed. All other realization fractions and the recovery coefficient are explicit scenario assumptions. They jointly represent attainable fraction and successful collection, not separately estimated probabilities. Ransom input means the amount if a payment occurs; no demand-to-payment haircut is added because the input already asks what the company would realistically pay. Applying an external payment fraction may understate a company with firm intent to pay; the sensitivity report explores that uncertainty.

```text
gross value = ransom + cash + records × $7 + IP + other
expected channel revenue = gross channel value × channel path probability × realization
expected revenue = sum(expected channel revenues)
expected profit = expected revenue − expected total cost
```

Cash theft and data sale can succeed before encryption, so expected revenue is **not** gross value multiplied by the displayed impact probability. No independence between channels is needed to add their expectations, but values must be distinct. The model does not estimate probability of at least one channel paying or a joint realized-profit distribution.

## Cost accounting

The modeled operator is an affiliate purchasing access and attempting one multi-stage operation, not every criminal archetype. Opportunity costs are included. This is not the combined profit of affiliate plus broker plus RaaS developer; commissions would be internal transfers at that ecosystem boundary.

| Component | Treatment |
|---|---|
| Preparation | $1,250 upfront assumption |
| Access | $8,500 upfront historical proxy |
| Tools/infrastructure | $650 upfront allowance; separate from RaaS licensing |
| Labor | Full-path bases $1,500 / $2,500 / $3,500 / $2,500 for the four stages |
| Specialists | $2,500 base, charged on expansion-stage entry |
| Overhead | $1,000 base, weighted across stage entry and effort |
| Monetization | 25% of expected collected ransom; assumed 10% of other collected proceeds |
| Enforcement | $2,500 unvalidated economic-risk allowance; sensitivity includes zero |

```text
stage reach = product(probabilities of preceding stages)
effort multiplier = 1 + 1.5 × quality × (1 − exp(−stage pressure))
expected stage cost = full-stage base × reach × effort multiplier
```

Costs are incurred upon stage entry, including failed attempts at that stage. Stronger defenses increase effort conditional on proceeding but can reduce total expected spend through early failure. A lower total cost for a protected organization is not proof that bypassing its defenses is cheaper. Detection is not equated with law-enforcement apprehension; the enforcement allowance is not automatically inflated by sensors.

## Uncertainty

The existing assumptions panel shows the min/max profit across a reproducible **64-scenario grid plus the central estimate**. The backend also returns revenue, cost and impact ranges. Each of six groups takes two values:

1. Aggregate reference: 0.45 / 0.65.
2. Defense pressure scale: 0.5 / 1.5.
3. Collection assumptions: ransom 0.30 / 0.70; cash 0.40 / 1.00; data 0.10 / 0.70; IP 0.05 / 0.50; other 0.20 / 0.80.
4. Customer-record proxy: $0.10 / $7.
5. Access/resources: $1,000 / $17,000; other resource scale 0.5 / 2.
6. Enforcement/recovery: $0 / $10,000; recovery effect 0.10 / 0.60.

These are deliberately broad assumed stress scenarios, **not confidence bounds, a probability distribution, empirically estimated percentiles, or guaranteed extrema**. Several parameters are grouped, and structural alternatives are not covered. The $7 high proxy is not a universal price cap. The binary verdict reflects the central estimate; existing result text explicitly says when the tested assumptions change it.

## Verification and remaining limitations

Run `node model.test.js` for importer, arithmetic, monotonicity, quality, overlap, recovery, channel-fee and numerical-boundary checks. The suite includes more than 1,000 control-addition checks. `browser.test.cjs` checks browser integration using Playwright with installed Edge. `model-report.cjs` regenerates the supplied-profile comparison in `MODEL-VALIDATION.md`.

These tests validate implementation and consistency, not forecasting accuracy. This model still lacks compatible incident-level observations linking checked controls, scope, failed attempts, attacker effort and realized proceeds. It does not infer company size, sector, threat frequency, attack-path choice, attacker adaptation, repeated attempts, true record type, control misconfiguration or payment certainty from absent inputs. A rational attacker may choose a cheaper theft-only path rather than this bundled operation. Recovery after encryption and exfiltration-only extortion are simplified. Enforcement costs remain especially weakly evidenced.

The next empirical improvement should use lawful incident data with failed attempts and known denominators, validate against a held-out cohort, measure calibration/Brier score for defined outcomes, and compare observed resource/proceeds distributions. The illustrative profiles cannot serve as outcome labels. Avoid tuning coefficients merely to force “Highly Secure” to become unprofitable.
