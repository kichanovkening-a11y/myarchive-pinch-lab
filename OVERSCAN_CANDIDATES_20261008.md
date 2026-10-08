# Overscan candidates 5↔6, 2026-10-08

## Goal
Preserve original touch-following scaling and photo geometry; no right blank strip, no duplicate photos, no clipped tiles, no overlaps, no release jump.

## Experiment
390px viewport, 3px gap, 300 unique tiles. Tested prelaying tiles in 5, 6, 8, 10 columns and uniformly scaling by baseColumns/density (script C:\\Users\\kicha\\pinch-lab-tests\\overscan-base-check.cjs).

## Results
- Base 5: right strip 19px at density 5.25, 35px at 5.5, 51px at 5.75, 65px at 6.
- Base 6: no meaningful right strip at 5.25, 5.5, 5.75, 6; however 11–12 tiles within first 780px are clipped on right, and the first row holds six IDs even when density 5.
- Base 8: no meaningful strip at fractional densities, but 11–12 clipped tiles and mismatch to 5/6 row ownership.
- Base 10: same clipping and mismatch, no improvement over 6.
- At exact density 5, base 6 shows IDs 1–5 in viewport but sixth item remains offscreen in first row, unlike proper five-column grid, so row order is incorrect.

## Conclusion
Overscan by prelaying wider grid does not satisfy full requirements. Do not release to user as fixed. Need a seam-safe mechanism that changes row ownership without collisions and retains gesture smoothness. Original prototype and production unchanged.
