# Pixel and host audit, 2026-10-12

Old geometry-audit reproduced 67 failing center samples / max44RGBA in43 frames on live Chromium. Captured292 actual draw/fill/text commands from one10-column frame and replayed identical commands and ImageBitmap references with DPR2.

134 centers: explicit non-frequent-read Canvas, render-all then sample, max0/fail0. Explicit frequent-read Canvas max44/fail51. Unconfigured Canvas with a readback between draw commands max44/fail49. Thus the old checker can itself generate raster differences by different readback/rendering configurations. This does not prove GPU compositor behavior or explain iPhone jerkiness. No tolerance was raised and no photo geometry was changed.

Host handler audit: optional diagnose=1 adds synchronous style/layout-related reads and log serialization; off means zero diagnostic writes in a3-touchmove VM reproduction. Active ordinary multi-touch handlers did not establish extra drag/long-press interference. This flag is not enabled on the clean candidate.

New isolated scalar-only video HUD: https://archive.vip-teatre.ru:8443/favorit-video-audit-20261012/?video=1 . Starts automatically at two-touch begin; shows density, rounded columns, max input/rAF intervals and render JS time. No per-render DOMRect, pixel reads, localStorage or uploads. Timing is not proof of displayed FPS; input intervals can include deliberate HOLD. isTrusted is labelled trusted events, not physical-device validation. No algorithm change.

Deployment preserved six hashes (production front/backend/bot plus source candidate/index/gallery/viewer). Page HTTP200; served JS parses; VM smoke7moves/7renders returned density5 and rendered summary. Real browser HUD smoke not completed: local Playwright browser binary absent, and one Kening command timed out. Existing25tests plus host diagnostic test pass26/26. HUD script preserved in archives/favorit-issue2-kinematics-20261010/video-audit.js; add its script tag only to a new cloned test page.

Pinch jerkiness remains NOT RESOLVED on physical iPhone. No production edits, restart, new grid-transition algorithm or iPhone PASS.