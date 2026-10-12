# Comment 6097949851 — kinematics investigation, NOT RESOLVED on iPhone

Production, previous copies, backend, bot, database and viewer are unchanged. This directory is a **diagnostic copy, not a smoothness fix or accepted release**. Normal background and the finite end of a 13-file gallery are not defects and were not changed.

## Verified reference

GitHub's current `photos-glide-favorit-1-0.html` blob is `2b391ccfe7f14e75092e1a79d22a7465229d6b9c`. Its first script matches the archived reference's gallery implementation. Relevant locations:

| Component | Protected reference | Integration | Finding |
|---|---|---|---|
| Distance mapping | reference.html:9 `gesture.density*Math.pow(gesture.dist/dist(e.touches),1.55)` | favorit-gallery.js `move()` → favorit-model.js `density()` | Same formula. Actual two-touch move handlers exercised in numerical test. |
| Column topology | reference.html:3 `n=Math.round(density)` | favorit-gallery.js `layout()`: `l.columns=Math.round(this.density)` | **Discrete** row assignment at every half-integer density. Neither implementation has layout interpolation. |
| Tile size | reference.html:3 `(w-G*(n-1))/n` | `layout()` `(l.width-l.gap*(l.columns-1))/l.columns` | Same discontinuity. Smooth density is not continuous tile size. |
| Coordinates | reference.html:5 `x=(i%n)*step; y=Math.floor(i/n)*step-scroll` | DOM `translate3d`; Canvas x/y from same row/column | Same instantaneous row reassignment, not a CSS-grid reflow. |
| Soft focus | reference.html:1,3 115ms opacity .90→1, timer125ms | favorit.css + gallery DOM branch | Only opacity changes. No coordinate/size animation. Canvas branch does not run this effect in either version. |
| Handoff | reference.html:3 `n>=10` | `layout()` + `render()` | At density9.5, geometry9→10 and renderer DOM→Canvas change in the same render. Reverse is the opposite. |
| Anchor | reference.html:8–9 stores only distance/density | `pinch()` stores only distance/density | Neither locks a material point to midpoint. Reference has no focal-item/u/v interpolation hidden elsewhere in gallery script. |
| Scroll | reference.html:3 clamps to maxScroll | integration `render()` same clamp, actual count from API | Same at equal viewport/count. Long reference default20000 and real folder13 naturally have different scroll limits. |
| Release/cancel | reference.html:6,10 settle260ms to rounded density, smoothstep | integration `settle()`/`end()` | Same nearest-level target and timing. Settle varies density but still uses rounded column geometry. |

## Reproducible renderer execution (Node, NOT browser paint)

Run `node kinematics.cjs` in this directory. It executes the actual first reference script in a VM and the actual integration renderer. Only reference N is adapted from20000 to the same13/146 records; viewport390×710. Actual reference/integration touchstart/touchmove handlers receive identical distance sequences. Reference style outputs and Canvas fill commands are captured; integration outputs are compared frame by frame, not just at endpoints.

Four cases: count13/146 × initial scroll0/100, 901 frames each, 3→10→3 + HOLD, then release22 frames. Max common-item coordinate/size difference: **0px**. Scroll/density equality assertions passed throughout. HOLD geometry displacement0px; release density3. Overscan-only tiles are included in max-displacement figures; these are not perceptual ratings. See KINEMATICS_NODE.json for full trace.

Concrete one-sided seam limits for item index equal to the FROM column count:

| Seam | BEFORE x,y | AFTER x,y | Top-left displacement | Width change |
|---|---|---|---:|---:|
|3→4|0,130.667|294,0|321.729px|−32.667px|
|4→5|0,98|313.6,0|328.556px|−19.600px|
|5→6|0,78.4|326.667,0|335.943px|−13.067px|
|6→7|0,65.319|335.929,0|342.220px|−9.331px|
|7→8|0,55.964|342.781,0|347.320px|−6.996px|
|8→9|0,48.948|348.074,0|351.499px|−5.439px|
|9→10|0,43.491|352.275,0|354.949px|−4.349px|

These are the same in protected reference and integration. They persist as distance increments approach zero. Thus “exactly preserve this reference geometry” and “every item has continuous coordinates across column boundaries” are incompatible for this particular source. This does **not** prove the reason integration is perceptually worse on the physical iPhone. Source continuity and smoothness perception are distinct questions.

## Browser observation, explicitly NOT iPhone

Chromium at390×844, actual gallery390×710, real API/photo records. Initial diagnostic run captured609 renderer samples, including actual DOMRect and actual Canvas fillRect commands, reverse and settle. Max DOMRect-vs-reference deviation0.012241px; errors0. At5→6 measured common-item displacement395.037px in the loaded larger folder (other rows move farther than the minimal example). At9→10 ~374.169px. These match reference formulas to raster/layout precision. The test includes overscan; no visual-PASS inference.

Initial run had background throttling, max rAF1007.4ms and pagination80→146: **invalid for performance comparison**. It is not evidence of a gallery/WebKit stall. Final probe marks hidden/resized runs invalid, loads pages before scripted run, removes an artificial3→5.3 jump from the scenario. Scripted tests advance per rAF, not a claimed60Hz physical gesture. Diagnostic DOMRect reads themselves add overhead; render JS and measurement time are recorded separately.

Final probe smoke test: all146 records loaded before capture; Stop/Copy worked,48 render samples captured,0JSerrors, max reference deviation0.004192px. Explicitly marked `scripted run manually stopped; incomplete`; not used as a completed3↔10 performance/visual PASS. Automatic45s cutoff prevents prolonged background-throttled runs and marks them incomplete. Per-frame trace is diagnostic overhead, not the clean page's performance.

## New diagnostic copy

- Clean: https://archive.vip-teatre.ru:8443/favorit-issue2-kinematics-20261010/
- Per-render trace + Copy: https://archive.vip-teatre.ru:8443/favorit-issue2-kinematics-20261010/?kinetic=1
- Automated output: KINEMATICS_NODE.json

Gallery/model/CSS/viewer are byte-identical to the previous geometry copy. Only an opt-in new script is added to index. It captures input timestamps/distances, every render density/columns/scroll/DOMRect or Canvas paint bounds, renderer handoff, size/position deltas, release/settle, rAF intervals and Copy export. Max2400 render samples/run. Normal URL does not install hooks or panel. No trace uploaded automatically, no persistent cache/config changes.

On iPhone: open same folder, click “Запись жеста”, do slow3→10→3, HOLD near5.5/9.5, reverse, release, repeat and viewer/back, end recording, Copy. Compare clean URL with protected reference on same device. Probe records actual physical events (`isTrusted`) but cannot certify displayed GPU frames or perception. Background and end-of-content should be ignored as agreed. Raw reports can contain file IDs; do not publish them publicly without review.

## Status

24/24 existing tests PASS; JS parse PASS; live /,/api/folders,new URL HTTP200; serviceactive. Protected production/backend/bot/viewer hashes unchanged. No service restart/deploy.

The iPhone recording is explicitly not available to Codex. No physical iPhone or Safari WebKit session is accessible. **No iPhone PASS, no claim that the worsening is fixed, no speculative fix applied.** Confirmed shared source discontinuity is now isolated from additional integration/performance effects. Solving strict coordinate continuity would change the protected mechanism, so it was not silently introduced as a “transfer fix”.

Files newly created only in this directory: kinematics.cjs, KINEMATICS_NODE.json, kinematics-audit.js, ISSUE2_KINEMATICS_REPORT.md. New-copy index.html adds the opt-in script. All copied gallery/viewer/API code remains unchanged. Older copied reports concern previous tasks, not this result.
