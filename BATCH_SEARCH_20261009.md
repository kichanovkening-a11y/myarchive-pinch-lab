# Batch research 2026-10-09 — pinch 3–10

## Goal
Original WOW zoom-in untouched; remove right stripe on zoom-out without duplicates, ghosting, stretching, overlap, jumps or loss of first photo. Isolated experiments only. No production changes.

## 8 geometry candidates at W=390, N=120, density 5.1..5.9
Node test: C:\\Users\\kicha\\pinch-lab-tests\\strategy-batch-20261009.cjs.
1. Original uniform scale: square, no overlap, right edge uncovered.
2. Width-locked anisotropic scale: no right stripe, rectangles, rejected by iPhone test.
3. Nearest discrete grid: square, full-width, no overlap at stable states; abrupt topology switch and scroll jump.
4. Linear per-tile morph: square, but overlaps and holes.
5. Smoothstep per-tile morph: square, overlaps and holes; easing cannot solve topology.
6. Six-column scaled: square but clipping/coverage issues and switch discontinuity.
7. Five-column right-aligned: moves uncovered space to left.
8. Five-column centered: uncovered space on both sides.

Note: numeric overlap/gap sums are coarse sample-line metrics, not full-frame video proof. Do not interpret as exact percentage of screen or certify iPhone quality.

## New external references
- https://github.com/dokar3/pinch-zoom-grid — Android Compose pinch wrapper, per-item keyed transitions.
- https://aldefy.github.io/compose-pinch-grid/ — compares instant reflow and crossfade; pinch breathing scale.
- https://adithyavis.github.io/awesome-mobile-app-animations/docs/animations/google-photos — 5/3/1 grid, old/new layer crossfade and scaling, gesture threshold, native thread.
- https://github.com/functionland/fx-fotos — open-source photo app with PinchZoom, AllPhotos, three RenderPhotos layers.
- https://github.com/wassgha/react-native-zoom-grid — previously inspected native 2-layer focal anchored transition.

## Conclusion
No verified full solution yet. Structural tension: at fractional columns a regular square row layout cannot simultaneously have full-width occupancy and remain a single discrete integer-column grid without a topology transition. Need test selective local row reflow / occlusion with unique photo ownership, anchored scroll, and screen coverage; do not claim Apple Photos perfect. Never alter original WOW or production.
