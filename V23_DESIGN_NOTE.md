# v23 atomic row reflow — design decision

The first v23 experiment uses canonical row-major full-width grids and a hysteretic threshold (5→6 at density 5.58; 6→5 at 5.42). All rows change atomically in the same rendered frame. No per-item interpolation is performed. Thus every frame is a valid integer-column layout: no holes, overlaps or clipped photos; the focal identity and its vertical fractional position are retained.

However, **this is intentionally a discontinuous gesture**. Horizontal focal shift still occurs at threshold, and whole-row content changes in one frame. It is not equivalent to Apple Photos. The `focusShift` diagnostic stores the theoretical horizontal delta; it does not smooth it.

Next candidate needs a real user-experience compromise, such as explicit discrete zoom with tactile feedback, not a false claim of continuous pinch. Keep as research only. Production and original viewer unchanged.
