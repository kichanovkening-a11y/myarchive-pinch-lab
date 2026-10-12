# Idle bitmap queue candidate — not physical iPhone PASS

Two reproduced defects in previous candidate: createImageBitmap jobs begin without concurrency bound, and jobs started while idle replace img.canvasSource and schedule render when they complete during a later pinch. Per-preview blocked-gesture polling also creates one200ms timer per image.

Regression tests observed RED then GREEN for cross-gesture completion and bounded preparation. New candidate limits native preparations to2 concurrent jobs, uses one shared200ms retry timer, defers completed-source installation during gesture/settle/glide, and closes queued/stale resources on destroy. Original image fallback and160px bitmap crop unchanged. No geometry, interpolation, touch/settle/inertia, backgrounds, viewer, backend or storage changes.

Deterministic actual-renderer timer reproduction,30previews while2-second pinch: old304callbacks/31peak timers; candidate14callbacks/2peak timers (including cache-maintenance). This is callback-count evidence, not an iPhone FPS improvement claim.30/30 Node tests pass locally, numerical reference parity remains0px.

The user's physical video showed rAF gaps123ms with max render3–4ms in one captured run. These newly proven extra tasks are a plausible contributor, but causality for that gap is NOT established. Do not call all iPhone jerks fixed. Candidate is isolated and keeps all prior versions.
\nIndependent review caught queued-bitmap replacement leakage; reproduced RED and fixed GREEN. Cache replacement now closes a displaced queued bitmap exactly once.\n
## Live browser validation

Paired real-data Chromium390x844/DPR2, all146 records loaded, same30photo/preview inputs. A wrapper held real native createImageBitmap completion promises to reproduce a new pinch starting before preparation finishes. This controlled completion delay is test instrumentation, not a measured device workload.

| Result | Prior candidate | Queue candidate |
|---|---:|---:|
| Preparations started before new pinch |30|2|
| Source replacements during pinch |30|0|
| Deferred sources installed after250ms idle |30|2|
| JS errors |0|0|

Other queued jobs continue during idle under the cap; this sample did not assert all30queue jobs finished. The original decoded Image remains usable while a bitmap is pending. Both URLs HTTP200.30/30tests and Node source parity passed on VPS. Eight protected hashes remained unchanged; no service restart.

Clean candidate: https://archive.vip-teatre.ru:8443/favorit-bitmap-queue-20261012/

This closes a concrete extra-work/source-stability defect, NOT the complete physical-iPhone acceptance requirement. A123ms rAF-gap root cause cannot be assigned from this controlled desktop result.
