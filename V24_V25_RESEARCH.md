# v24/v25 research: restore full tiles in v3 fractional stream

Baseline v3 fetched from immutable commit 4af8dd2fd81bcb482228cfeff6f7fee5ed68bbba.

v24 whole-tile rendering assigns each item to exactly one row. Tested actual HTML in Chrome/Puppeteer (390x844 DPR2, densities 5, 5.1, 5.25, 5.5, 5.75, 5.9, 6). No JS errors. At intermediate densities rows have large left gaps: max among first 12 rows 68.8 px (5.1), 55.7 (5.25), 35.5 (5.5), 50.9 (5.75), 59.5 (5.9). REJECT v24.

v25 uses a different rendering policy: **the seam-crossing tile is drawn in both adjacent rows, always at full size**, and each row clips to the viewport. It removes v24's geometric left gaps by backfilling the previous tile, but **duplicates seam tile identity across two rows** during intermediate densities. This is intentional brief overlap / ghosting tradeoff; it is not a valid unique-item layout and may visibly duplicate photos. Also a row can have a full-size seam tile partly outside the canvas; clipping still happens at viewport edges, not inside the row. This needs actual visual inspection and quantitative duplicate count before release.

Neither version is a proven solution. Research branch only. No changes to production or existing viewer.
