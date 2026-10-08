# Automated pinch regression baseline (2026-10-08)

Two local Windows/Puppeteer test runners were created:
- `pinch-batch.cjs` (local `C:\\Users\\kicha\\pinch-lab-tests`): Chrome smoke test for v20, v24, v25, v26, v28, v29, v30. 9 density states each (63 total), 390×844 DPR2. All loaded and executed without page JS errors; no test-loop exceptions. **This is not a visual pass.**
- `pinch-geometry.cjs` (also committed under `tests/`): reproducible geometry regression for v20, v26, v29, v30, testing nine densities. Browser results are saved locally as `pinch-geometry-results.json`.

| Version | Maximum focal X drift (px) | Max intermediate underlying tile overlap pairs | Full width | Unique canonical IDs |
|---|---:|---:|---|---|
|v20|32.5|0|yes|yes|
|v26|162.5|0|yes|yes|
|v29|32.5|41|yes|yes|
|v30|32.5|0*|yes|yes*|

* v30 overlaps and duplicates between old/new composited layers **are not counted** by canonical-grid-only geometry, so the zero must not be interpreted as absence of visual ghosting. Similarly v29 excludes focal overlay from its overlap count. The v29 count is for a synthetic 50%-progress interpolation, not a captured video frame.

All four **fail** the combined user acceptance criteria. v20 and v30 have focal jumps; v26 large jumps; v29 overlap. v30 ghosting remains unmeasured. The tests are useful as early rejection gates, not proof of Photos-like continuous pinch.

Production and the confirmed viewer remain unchanged. The test runner currently uses absolute local Windows paths and the installed local Puppeteer, so portability improvements are pending.
