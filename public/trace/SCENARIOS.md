# Company and defense scenarios

Default: **mid-size company, moderately defended**. Size and defenses are independent. All nine combinations use the existing path model, without adding a company-size probability multiplier.

## Economics (USD)

These are illustrative cohorts and estimates, not legal size definitions or observed population averages.

| Input | Small | Mid-size | Large |
| --- | ---: | ---: | ---: |
| Illustrative employees | 100–250 | 251–1,000 | 1,001–5,000 |
| Annual revenue band (context only) | $10M–$50M | $50M–$250M | $1B–$5B |
| Representative annual revenue (context only) | $25M | $100M | $2B |
| Payable ransom estimate | $100,000 | $250,000 | $2,000,000 |
| Accessible cash estimate | $25,000 | $100,000 | $1,000,000 |
| Exfiltratable customer records | 10,000 | 100,000 | 1,000,000 |
| Monetizable IP estimate | $10,000 | $100,000 | $1,000,000 |
| Other value | $0 | $0 | $0 |

The [Sophos 2025 release](https://www.sophos.com/en-us/press/press-releases/2025/06/nearly-half-companies-opt-pay-ransom-sophos-report-finds) reports median ransom **demands** below $350k at revenue up to $250M and $5M above $1B. These anchors inform, but do not measure, the preset payable amounts. Small and mid-size estimates sit below the first anchor; the large estimate assumes payment below the $5M demand. They are neither observed payment medians nor predictions.

The [Sophos 2026 report summary](https://www.sophos.com/en-us/blog/sophos-state-of-ransomware-2026) reports a $769k overall median payment and payment by 48% of encrypted victims. This supplies current context, not cohort-specific payable amounts. TRACE retains the existing 48% ransom realization assumption: it is applied after modeled path completion, and is not inferred from a portfolio's strength. Survey selection and industry differences prevent treating these anchors as a company's expected payout.

Accessible cash represents a payment or treasury exposure, not the annual revenue or cash balance. Customer-record counts represent a reachable dataset. IP represents a separate monetizable asset estimate. Each grows with illustrative scale; none is asserted to be an industry average. The employee/revenue pairings are assumptions as well. Other value is zero to avoid inventing an additional revenue source.

Annual revenue is never added to attacker payout. Editable values feed the existing outcome-specific realization and collection-fee equations. The existing $7 account-price proxy and 35% realization remain assumptions for generic records; see the Evidence dialog. Changing size replaces all five revenue inputs but preserves defenses, custom effectiveness and attack surfaces. Manual revenue editing marks the size selector as custom.

## Defense portfolios

Control selection draws on [CISA Cybersecurity Performance Goals](https://www.cisa.gov/cybersecurity-performance-goals) (authentication, updating, monitoring, segmentation) and the existing [MITRE mitigation bridge](https://d3fend.mitre.org/mappings/attack-mitigations/). These bundles illustrate increasingly broad deployment; they are not measured average companies, CISA maturity tiers, or MITRE certification levels.

- **Poorly defended (2 techniques; 60% coverage):** SoftwareUpdate, StrongPasswordPolicy.
- **Moderately defended (7 techniques; 75% coverage):** retains both and adds Multi-factorAuthentication, AuthenticationEventThresholding, ProcessAnalysis, NetworkTrafficAnalysis, OutboundTrafficFiltering.
- **Highly defended (12 techniques; 90% coverage):** retains all seven and adds InboundTrafficFiltering, ExecutableAllowlisting, ApplicationHardening, LocalFilePermissions, ResourceAccessPatternAnalysis.

The path model credits 1 / 6 / 11 of these techniques respectively. StrongPasswordPolicy is recognized in D3FEND but has no separate mapping in this limited path library. It receives no invented credit. Network segmentation and cloud permissions are scenario alignments with InboundTrafficFiltering and LocalFilePermissions; they do not establish every deployment detail.

Coverage and technique effects are explicit model assumptions. MFA does not imply complete phishing resistance; process analysis does not imply a staffed SOC. Backups and response plans matter in practice but receive no extra portfolio multiplier in this change. The comparisons therefore show modeled technique and coverage effects, not all benefits of a security program.

## Comparison and custom inputs

The comparison uses the current revenue inputs and enabled surfaces for all three portfolios at their preset coverage levels. Rows match by path ID and show profit and path completion, including negative-profit paths. The selected preset column is highlighted. It never silently substitutes an uploaded profile into a preset comparison.

The main assessment always uses the active profile and effectiveness. Successful upload marks defenses custom; invalid or oversized uploads preserve the assessment. Changing a defense preset replaces the profile and effectiveness only. Manual effectiveness editing marks the defense selector custom while retaining the active technique set. Reset restores medium/moderate, revenue values, default surfaces and coverage. JSON exports include scenario metadata and the full three-portfolio comparison; CSV includes scenario metadata and active-assessment paths.

## Validation

Run `node --test public/trace/scenarios.test.cjs` for all nine combinations, recognized controls, nested portfolios, economic identities, per-path defense progression, size progression, zero values and disabled surfaces. Run `node public/trace/browser.test.cjs` for actual UI selections, custom inputs, uploads, exports, reset, privacy, overflow and console errors. Set `PLAYWRIGHT_MODULE` to an installed Playwright package if needed; use `TRACE_TEST_URL` to test the served production build instead of local files. Run `npm run lint` and `npm run build` for the portfolio app.
