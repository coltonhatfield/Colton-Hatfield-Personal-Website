# TRACE validation and sample comparison

Model 2026.09.6. Deterministic reproduction of the revenue inputs supplied in the request: $115,000 ransom, $10,000 cash, 10,000 records, $30,000 IP, $10,000 other. Gross proxy value remains $235,000.

The archived local model is 2026.09.5; the pasted website results were 2026.09.4. These are different baselines. The previous-local columns below are calculated from the actual starting code, not represented as the pasted website values.

## 100% selected quality (matches pasted assumptions)

| Profile | Previous local impact | New impact | New expected revenue | New cost | Previous local profit | New profit | Profit sensitivity |
|---|---:|---:|---:|---:|---:|---:|---|
| Vulnerable Organization | 52.6% | 46.1% | $50,776 | $34,025 | $66,225 | $16,752 | −$41,670 to $74,486 |
| Moderately Secure Organization | 39.8% | 16.4% | $19,605 | $30,314 | $43,719 | −$10,709 | −$58,378 to $37,290 |
| Highly Secure Organization | 26.7% | 11.8% | $14,394 | $29,135 | $20,711 | −$14,741 | −$59,803 to $26,525 |

## 75% selected quality (site default)

| Profile | Previous local impact | New impact | New expected revenue | New cost | Previous local profit | New profit | Profit sensitivity |
|---|---:|---:|---:|---:|---:|---:|---|
| Vulnerable Organization | 53.4% | 48.5% | $53,153 | $34,208 | $67,707 | $18,946 | −$40,562 to $76,636 |
| Moderately Secure Organization | 43.3% | 23.5% | $26,979 | $31,320 | $49,976 | −$4,341 | −$54,281 to $47,308 |
| Highly Secure Organization | 32.2% | 18.8% | $21,694 | $30,368 | $30,279 | −$8,674 | −$56,267 to $37,744 |

## Interpretation

These are scenario outputs, not observations that prove a company is safe or an attack unprofitable. All three example profiles have sensitivity scenarios on both sides of zero profit. The new impact probability is not multiplied by all gross value: cash and data use earlier path outcomes, with separate realization fractions. Lower expected operation cost under strong controls reflects early termination and lower revenue-linked fees, not lower effort to bypass the controls.

## Verification

- 15 test groups passed in `model.test.js`, including more than 1,000 individual control-addition checks.
- Real browser checks passed in `browser.test.cjs`: file upload, results, quality selection, four stages, six assumption rows, reset, desktop/mobile overflow, and no page errors.
- All 223 unique techniques in the complete supplied export are recognized by official D3FEND 1.6.0.
- No new input fields, storage or runtime network requests were added. Styles were not edited.

## Scientific limit

No real outcomes were supplied for these companies. Accordingly there is no measured before/after predictive accuracy, no empirical fit of D3FEND coefficients, and no out-of-sample calibration claim. The changes correct scope, taxonomy, overlap and accounting errors, while documenting and stress-testing assumptions. See MODEL.md for source provenance and every model choice.
