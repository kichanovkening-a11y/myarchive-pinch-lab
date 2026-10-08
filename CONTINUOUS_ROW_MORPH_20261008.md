# Continuous row morph — 2026-10-08

Isolated demo continuous-row-morph-test.html (main). Each tile independently linearly interpolates its position from row-major floor(density) grid to ceil(density) grid, cell width continuously adapts to fractional density. One DOM tile per photo, no backing layer. Production/original unchanged.

Puppeteer mobile viewport 390x844 DPR2, first 60 tile rectangle overlap pairs (area>4px²), no JS errors:
5:0; 5.1:34; 5.25:54; 5.5:58; 5.75:34; 5.9:10; 6:0; 6.5:53; 7:0; 8:0; 9:0; 10:0.
Visible horizontal extent of first 60 tiles spans ~390px at all sampled densities. Identity tile 12 x 157→0 from 5→6 continuously, but collisions invalidate UX. Note overlaps are among tile bounding boxes, not necessarily exact painted intersections at rounded edges.

Conclusion: per-tile morph removes abrupt row jump but introduces many physical collisions, cannot be accepted. Need collision-free transition topology or tolerate temporary overlap per Apple Photos; user explicitly rejects photo piles, so test not acceptable.
