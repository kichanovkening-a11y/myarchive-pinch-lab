# Batch experiments — 2026-10-08

Viewport 390×780, 3px gap, 180 tile identities, six densities 5.1,5.25,5.5,5.75,5.9,6. Scripts on authorized PC: multi-overlay-tests.cjs and multi-identity-tests.cjs. Geometry simulations only; no iPhone visual acceptance.

Variants tested:
1. Old scaled 5-col layer + clipped right 6-col backing: 9–10 duplicate identities; 12 clipped backing fragments at fractional densities.
2. Old scaled 5-col + entire 6-col backing: 55–60 duplicate identities.
3. Backing with visible-ID exclusion: 0 duplicates, 0 inter-layer overlaps, but 59–455 uncovered sampled points in the right strip.
4. Row-ownership exclusion: 1–2 duplicates, 52–364 uncovered sampled points.

Important: sampled uncovered points include intrinsic grid gaps and should not be interpreted as exact empty-area pixels. The comparison remains useful for rejection due to duplicates or obvious missing coverage. No candidate meets full requirements. Do not deploy or send test links as fixed. Original and production untouched.

Research conclusion: a change of row membership must be handled as a presentation transition, not a static strip filler. Need temporal transition or new rendering representation, with gesture-following and release stability tested before presenting.
