# Arc UI Photo Grid: verified reference (2026-10-08)

Source: https://uiarc.dev/components/photo-grid

Verified documentation:
- React component with discrete zoomLevels, default [5,3,2].
- Pinch scales live and reflows around the photo under the fingers.
- onColumnsChange signals level change; source code is Pro-only.
- The grid is not virtualized; all thumbnails are rendered, with pagination recommended for large libraries.
- Demo contains 16 photos; not a stress test for 300+ photos or 5→6.

Consequence: Arc UI is a useful reference for live scale + anchor-aware discrete reflow, **not** evidence of continuously valid intermediate 5→6 whole-tile row-major packing. Do not claim its code is open-source or identical to Apple Photos.

Next isolated lab research: model *temporary scaled current integer grid during gesture*, with anchor item+fraction; at threshold, compare target-grid layout using FLIP (First/Last/Invert/Play) anchored to same item; evaluate release snap, midgesture reversal, HOLD, visible blank strips, and duplicate IDs. Quantify before publishing. Existing v3 stays immutable. Production/VPS/viewer untouched.
