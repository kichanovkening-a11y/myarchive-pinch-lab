# v31 and v32 regression — research only

## v31 horizontal anchor

Browser tested at 390×844 DPR2, scroll offset 500, fixed focal tile and densities 5→5.1→5.25→5.5→5.75→5.9→6→5.5→5. All reported focal X/Y drift 0. At 6 columns, offsetX=32.5px and uncovered right viewport strip=32.5px. FAIL: violates no-holes criterion.

## v32 edge backfill

Based on v31. At right edge it paints a 65%-opaque fragment using the first tile of each row to cover the uncovered 32.5px strip; analogous left-edge logic. Browser smoke test at density 5.75 reported 6 columns, offsetX=32.5px, expected backfill width 32.5px, no JS errors; syntax check passed.

**Reject as valid photo layout:** edge fragment is a second depiction of an already visible photo identity, and therefore violates whole-photo/no-duplicate criteria. The smoke test did not validate pixel coverage or rapid reverse. The prototype demonstrates that filling the gap by copying edge content merely trades a hole for a duplicate.

These experiments remain isolated; production and viewer unchanged.
