# Baseline: original-wow-pinch-test.html (2026-10-08)

## Preservation rule
Do not change original-wow-pinch-test.html, the production archive, or its viewer. The original pinch tracking and enlargement behavior are the accepted baseline. No candidate may be shared as a fix before overlap/identity/edge/gesture-release checks.

## Measured in Chrome mobile emulation
Viewport 390×844, DPR 2, 300 unique tiles, committed=5, measured via getBoundingClientRect() after setDensity():

| density | right blank strip (px) |
| --- | ---: |
| 4 | 0 |
| 5 | 0 |
| 5.2 | 15 |
| 5.5 | 35 |
| 6 | 65 |
| 7 | 111 |
| 8 | 146 |
| 10 | 195 |

Formula for original rendering: transformed grid width = viewportWidth × committed/density; blank right = max(0, viewportWidth × (1 − committed/density)).

## Rejected candidate
pinch-right-edge-experiment.html interpolates tile coordinates between discrete grid positions. Independent geometry check detected 41 overlaps among first 45 tiles at density 5.5. User confirmed unusable in iPhone video. Do not reuse this mechanism.

## Next-candidate acceptance gates
1. Original increase (density 5 → 4) remains visually and geometrically unchanged.
2. During shrink (density 5 → 6), no blank right stripe at any sampled density.
3. No repeated file identities, no overlaps, no split tiles, no blank holes.
4. No release jump; quick reverse and hold gestures must work.
5. Automated geometry tests must pass before sending an iPhone test link.

Current status: root cause measured; no validated replacement yet.
