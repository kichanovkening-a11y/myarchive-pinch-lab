# Comparison of original pinch alternatives — 2026-10-08

Original preserved unchanged: `original-wow-pinch-test.html`. Production untouched.

## Test methodology
Analytic 390px viewport, gap 3px, 300 unique tile identities, sample density 5.0 to 6.0, first 45 tiles pairwise overlap checks. Script on authorized Windows PC: `C:\Users\kicha\pinch-lab-tests\compare-variants.cjs`. This is geometry simulation, not iPhone performance validation. For horizontal stretch and hard-switch, right-edge values in script based on first five items are not an accurate full-row coverage metric; do not use them as proof of stripe absence.

## Results
- Original uniform transform: zero tile overlaps; right blank 0px at 5, 35px at 5.5, 65px at 6. User says enlarge direction excellent; keep as baseline.
- Continuous independent tile interpolation: 24 overlap pairs at 5.1, 38 at 5.25, 41 at 5.5, 24 at 5.75, 7 at 5.9; user video rejected.
- Horizontal-only compensation: avoids most horizontal blank but stretches tile contents unless additional clipping/aspect corrections are added. Cannot be accepted for photographs.
- Integer grid switch: no overlapping tiles in static states but tile #6 shifts horizontally by 328px at switch; user rejects jump.
- Temporary 8px frame: original stripe at density 6 is 65px, thus frame cannot hide it.

## Outcome
No validated superior candidate. Do not ship any alternative. Next research must use offscreen overscan or separate seam-safe row ownership and verify no duplication, overlaps, split tiles, holes, release jump, or gesture degradation. Only send user link once geometry and browser checks pass. Original and production remain untouched.
