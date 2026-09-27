# PACER model card

Model version: 2026.09.5

PACER is an anonymous, client-side scenario calculator for one question: is a financially motivated cyberattack economically profitable?

## Equations

```text
total monetizable value =
  ransom
  + accessible cash or cash-equivalent funds
  + customer records × $7
  + intellectual property value
  + other monetizable value

expected attacker revenue = total monetizable value × probability of attack success

total attack cost =
  preparation
  + access acquisition
  + tools and infrastructure
  + labor
  + specialist services
  + operational overhead
  + monetization / RaaS share
  + expected detection or apprehension cost

expected attacker profit = expected attacker revenue − total attack cost
```

The result is profitable only when expected profit is greater than zero. Monetization probability after a successful attack is intentionally not modeled in this version.

## Revenue anchors

- Ransom, accessible cash, intellectual property, and other revenue are entered directly by the user.
- Customer-data resale uses $7 per affected customer. This is the median asking price for a compromised online account in Nurmi, Niemelä, and Brumley, “Malware Finances and Operations,” ARES 2023, DOI 10.1145/3600160.3605047. The paper found 91% of account prices between $1 and $30.

## Success probability

The conditional baseline is 56%, taken from Sophos State of Ransomware 2026: 56% of attacks against the surveyed organizations hit by ransomware encrypted data. This is not an annual probability that a randomly selected company will be attacked.

The uploaded D3FEND profile is divided into six tactics: Model, Harden, Detect, Isolate, Deceive, and Evict. Each tactic receives diminishing credit as techniques are added. The reference technique counts are derived from `d3fend-profile-all-selected.json`.

The 56% conditional baseline is decomposed into four sequential stages whose probabilities multiply to 56%: initial access, execution and persistence, expansion and exfiltration, and impact and monetization. Each D3FEND tactic affects only the stages where it is relevant. For example, Harden and Isolate have the largest effect on initial access, while Evict has its largest effect on impact and monetization.

```text
tactic coverage = (1 − exp(−3 × min(selected/reference, 1))) / (1 − exp(−3))
breadth factor = 0.80 + 0.20 × represented tactics / 6
stage defense pressure = Σ(tactic coverage × stage-specific relevance)
stage probability = stage baseline ^ (1 + 3 × control effectiveness × breadth factor × stage defense pressure)
conditional success probability = product of the four stage probabilities
```

The six tactic weights sum to one:

- Model 0.08
- Harden 0.27
- Detect 0.26
- Isolate 0.17
- Deceive 0.07
- Evict 0.15

At the default 75% control-effectiveness setting, the fully selected reference profile produces a 15.2% modeled conditional success probability. The setting can be changed from 60% for limited deployment to 100% for independently verified enterprise-wide operation. These reductions and stage allocations are PACER assumptions. MITRE states that D3FEND does not prescribe, prioritize, or characterize countermeasure effectiveness.

## Cost ledger

| Component | Value | Basis |
|---|---:|---|
| Preparation | $1,250 | PACER assumption |
| Access acquisition | $8,500 | Trend Micro observed average for business access with administrative credentials |
| Tools and infrastructure | $650 | Published criminal-service prices plus PACER infrastructure allowance |
| Labor | $10,000 | PACER assumption |
| Specialist services | $2,500 | PACER assumption |
| Operational overhead | $1,000 | PACER assumption |
| Monetization / RaaS share | 25% of expected revenue | Midpoint of the 20–30% developer/operator share described in a U.S. House hearing record |
| Expected detection or apprehension | $2,500 | PACER assumption: 1% × $250,000 consequence |

## Boundaries

- Checked D3FEND techniques are credited according to the selected control-effectiveness and enterprise-coverage setting.
- The percentage is conditional on an organization experiencing a ransomware attack. It is not an annual probability of attack or breach.
- Public evidence does not support organization-specific precision from D3FEND selections alone; the result is a transparent scenario estimate rather than a measured forecast.
- The model targets economically motivated criminal organizations, not script kiddies or nation states.
- Defender recovery cost, downtime, liability, and reputational loss are excluded because they are not attacker revenue.
- The calculator is deterministic and contains no hidden randomness.
- No inputs or files are transmitted, stored, exported, or shared.
- The result is an assumption-driven estimate, not a guarantee, certification, actuarial model, or organization-specific security assessment.
