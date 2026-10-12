# Idle bitmap queue candidate — not physical iPhone PASS

Two reproduced defects in previous candidate: createImageBitmap jobs begin without concurrency bound, and jobs started while idle replace img.canvasSource and schedule render when they complete during a later pinch. Per-preview blocked-gesture polling also creates one200ms timer per image.

Regression tests observed RED then GREEN for cross-gesture completion and bounded preparation. New candidate limits native preparations to2 concurrent jobs, uses one shared200ms retry timer, defers completed-source installation during gesture/settle/glide, and closes queued/stale resources on destroy. Original image fallback and160px bitmap crop unchanged. No geometry, interpolation, touch/settle/inertia, backgrounds, viewer, backend or storage changes.

Deterministic actual-renderer timer reproduction,30previews while2-second pinch: old304callbacks/31peak timers; candidate14callbacks/2peak timers (including cache-maintenance). This is callback-count evidence, not an iPhone FPS improvement claim.30/30 Node tests pass locally, numerical reference parity remains0px.

The user's physical video showed rAF gaps123ms with max render3–4ms in one captured run. These newly proven extra tasks are a plausible contributor, but causality for that gap is NOT established. Do not call all iPhone jerks fixed. Candidate is isolated and keeps all prior versions.
\nIndependent review caught queued-bitmap replacement leakage; reproduced RED and fixed GREEN. Cache replacement now closes a displaced queued bitmap exactly once.\n