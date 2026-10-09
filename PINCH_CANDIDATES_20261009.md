# Pinch lab — candidate register (2026-10-09)

## KEEP: Edge Reveal live 3–10

URL: https://kichanovkening-a11y.github.io/myarchive-pinch-lab/edge-reveal-live-3-10.html
Source: edge-reveal-live-3-10.html
Status: **PROMISING BASELINE / NOT ACCEPTED**. User explicitly requested preserving this version as a reasonably good alternative, though not Apple Photos-like. **Do not overwrite or delete.**

Observed from iPhone video 08:44:55: continuous whole-grid scaling has useful qualities; not equivalent to Apple Photos edge ingress/egress and bottom-row fades. At snap/commit photo identity and scroll anchoring can jump; near gallery end a blank area appears. Do not describe as production ready.

Other immutable references: original WOW prototype, production archive, baseline 20261007_170012. No changes without explicit authorization.

## Next hypothesis

Investigate a *viewport-clipped, anchor-aligned dual presentation* where adjacent column layouts are projected to the same anchor, each layout is clipped to viewport and opacity is spatially modulated (particularly bottom row and horizontal edges). Crucially, a single photo should not be visibly opaque twice in central viewport. Separate gesture progress, committed layout, and scroll anchor. Compare with Edge Reveal rather than replacing it.

## Required gates

3–10 columns; 3→10→3, 5→8→5; hold 2 s; reverse without reanchoring; no right grey strip; no abrupt release; no jump to gallery end; no obvious duplicate; validate iPhone in Safari/Telegram after browser geometry tests.
