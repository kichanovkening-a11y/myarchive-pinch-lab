# Favorit transfer parity — isolated test 2026-10-10

Test URL: https://archive.vip-teatre.ru:8443/favorit-test-parity-20261010/

Production index.html, index.py and bot.py unchanged. Previous test directories unchanged.
New index.html, model and viewer are exact copies of background-20261010.
Changed test adapter/CSS; added explicit audit controls and regression tests.

## Changes

- DOM tiles positioned with translate3d; no per-render cssText replacement.
- Persistent 180-slot pool. Taller viewports allocate sufficient capacity at measure/resize, not during render.
- Original photo/selection handlers bound once to a live file proxy per slot; long-press resolves current dataset.fileId.
- Cached order rebuilt on page/data/order changes and viewer return, not per frame.
- No querySelector/querySelectorAll, sorting/localStorage reads, DOM node creation/removal/reparenting in warmed render frames.
- No crop Canvas allocation. Async createImageBitmap prepares 160px previews; unsupported/failing implementations draw the original decoded preview with the existing square crop. URL/cache headers/backend unchanged.
- Soft-focus forced layout occurs before tile position writes, like the reference; 115ms/.90->1 retained.
- Cancel retains settle; event-time scroll bounds restored; multi-touch touchend follows the reference.
- Canvas overscan matches reference row bounds. ResizeObserver only responds to width changes; geometry measured outside render.
- Existing editing/materialization path retained. Visible pooled nodes preserve identity during drag/selection. Hidden file marker protects existing loadFiles lifecycle on Canvas-first paint.
- Transparent backdrop and full viewport width retained.

## Regression tests

14 Node tests PASS, including executing the actual original bindPhotoGesture with slot reuse, manual-order invalidation, cancellation, burst scroll, async preview preparation, Canvas-first pagination marker, and 291 reference geometry densities.

## Browser benchmark

Same ordered dataset: 146 records, 134 decoded previews in both versions. Viewport 390x666.
254 explicit render calls per implementation, same synthetic TouchEvent sequence through capture/bubble.

| Metric | Reference fixture | Previous integration | New integration |
|---|---:|---:|---:|
| JS render median ms | 0.4 | 0.6 | 0.4 |
| JS render p95 ms | 14.5 | 4.2 | 3.2 |
| JS render max ms | 20.1 | 10.9 | 21.1 |
| DOM create | 0 | 91 | 0 |
| DOM queries | 0 | 5970 | 0 |
| DOM reparent | 0 | 481 | 0 |
| DOM remove | 0 | 339 | 0 |
| localStorage reads in render | 0 | 508 | 0 |

JS timing is Chromium/Windows and instrumented, not total GPU/paint cost. Maximum did not improve; no claim of uniformly faster frames.
Live rAF flow also ran 1->30->1/HOLD/reverse/release, but some iframe runs were throttled to ~1000ms despite document.visibilityState=visible, whereas another ran near 7ms. These intervals and estimated missed slots are NOT comparable FPS measurements and are rejected as proof of smoothness. No physical iPhone PASS claimed.

Actual event lifecycle results: touchcancel from 5.6 -> reference 6, previous 5.6, new 6; two opposing scroll events before rAF -> reference 25px, previous 0px, new 25px.
Actual browser actions: viewer opened file.id=279, selection of that ID succeeded, pool identities and file order survived selection roundtrip. No real delete/move/order-save request issued.

Final browser checks: gallery width 390px at 1/3/5/9/10/15/30; pagination 40+40+40+26 = 146 unique IDs; one-finger scroll 320px matches reference with zero difference; transparent Canvas bottom pixel [0,0,0,0]. All these targeted checks PASS. Node 14/14 and JS parse rerun PASS; test URL and /api/folders HTTP 200. Remote adapter/CSS hashes match local files; protected production hashes unchanged.

## Remaining differences / physical checks

- Real finite dataset, pagination, Telegram previews versus synthetic 20k/90-image reference.
- Host viewport/toolbar/safe-area, selection and long-press arbitration remain necessary integration code.
- Canvas must remain alpha-enabled to retain the approved common app background.
- Tall viewport pool can exceed original 180 to avoid holes; bitmap support varies on Safari.
- Existing minimum touch-distance protection remains, no density/gap/settle/inertia formulas changed.
- Test Safari and Telegram WebView: fast 1->30->1, repeat/reverse/HOLD, 9/10 DOM/Canvas seam, scroll, release/cancel, long press, selection/move, viewer return.

Production publication requires user confirmation after physical iPhone testing.
