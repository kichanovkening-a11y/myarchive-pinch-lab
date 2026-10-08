# Virtual grid geometry, 2026-10-08

Research-only. No production or original demo modifications.

Scripts on authorized PC: C:\\Users\\kicha\\pinch-lab-tests\\virtual-flow-geometry.cjs and collision-relaxation.cjs. 390px viewport, 3px gap, 300 generated IDs; overlap evaluation first 60 items.

Three direct interpolation variants (overlapping rectangle pairs at density 5.5): linear 58; band 58; original-row-held 24. None acceptable.

Experimental collision relaxation: 60 tiles, 500-iteration cap, position correction and horizontal viewport clamp. Results density / remaining overlaps / max displacement from intended path: 5.0 0/0px, 5.1 0/28px, 5.25 0/58px, 5.5 0/183px, 5.75 1/90px (iteration cap), 5.9 0/27px, 6.0 0/0px. Note: zero overlap alone is not visual success: huge displacements and unverified continuity, gap coverage and performance. This is NOT a valid shipping solution.

Consequence: naive geometry interpolation and collision solver both fail at least one critical invariant. Need investigate reflow-aware row-local routing and temporal continuity, with per-frame displacement, coverage, uniqueness, and overlap metrics. No iPhone validation claimed.
