# Alignment batch — 2026-10-08

Tested 3 positioning policies (focal photo, centered, left-aligned) × 5 focal IDs (0,2,4,12,29) × 4 densities (5.1,5.5,5.9,6) = 60 geometry cases. Viewport 390 px, 3px gap, source 5 columns, target 6. Remote Windows test file: C:\Users\kicha\pinch-lab-tests\three-alignment-batch.cjs; full output three-alignment-results.txt.

- Focal alignment fails horizontal coverage for anchors crossing row ownership. Anchor #29 at density 6: target left -65.5px, right 324.5px, 65.5px blank on right. Anchor #12: left 131px, 131px blank on left. At density 5.9, anchor #29 still leaves 60px on right.
- Center alignment keeps target horizontal viewport coverage at all sampled densities, but cannot preserve focal photo coordinate and does not solve duplicate photo ghosting.
- Left alignment keeps target horizontal coverage at all sampled densities but likewise loses focal tracking and cannot solve ghosting.

This is geometric analysis, not touch visual acceptance. Existing dual-layer demo fails iPhone visual acceptance. Next candidates: constrained focal transform with viewport clamping; position-vs-opacity staged presentation; adaptive per-row transition. Preserve original WOW gesture and zoom-in, do not change production.
