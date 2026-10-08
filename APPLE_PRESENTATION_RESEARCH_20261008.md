# Apple Photos-inspired two-presentation research — 2026-10-08

Keep original pinch untouched. Later reverse engineering established scalar presentation index, two alpha layers, endpoint convergence, transient overlap tolerated in Apple Photos. This suggests separating gesture scale from layout presentation instead of interpolating each tile's grid coordinates.

## Candidate: old 5-column scaled presentation + clipped 6-column backing layer
At 390px, 3px gap, density 5→6, old right boundary moves 390→325px. Put six-column canonical presentation under old presentation, clip backing to right uncovered strip, retain original touch-driven transform for old layer. Geometric first-row checks at 5.1,5.25,5.5,5.75,5.9,6 find only tile #6 of the new first row touches the strip, so the first row does not repeat IDs 1–5. This does NOT prove uniqueness across rows or at intermediate y: different row ownership can duplicate IDs vertically. It also does not solve release transition from old to new layout.

## Acceptance criteria before user test
- All viewport pixels covered for densities 5..6, 6..5 and rapid reversal
- Identity uniqueness across ALL visible rows, not just first row
- No partial tiles at right seam, no cut-off edges, no ghosting
- Preserve original touch tracking exactly
- No release jump, no transient full-grid flash

This approach is not validated and should not be shown as fixed. Need programmatic 2D coverage and identity validation, then browser rendering and device test.
