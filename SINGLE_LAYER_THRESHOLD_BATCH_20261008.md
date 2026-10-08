# Single-layer threshold batch — 2026-10-08

Two isolated browser demos added to main without touching original or production:
- early-switch-515-test.html: committed 5→6 at density >5.15, reverse threshold 5.07.
- balanced-switch-535-test.html: committed 5→6 at density >5.35, reverse threshold 5.27.

Puppeteer Chrome 390×844 DPR2 tested 10 densities 5.05..6 per candidate, no page errors. Early candidate last sampled pre-switch gap 11px at 5.14, balanced 25px at 5.34. Both zero right gap after switching. Tile #6 x changes from 0 (5-col second row) to ~381 (6-col first row) at early switch, a large visible topology jump. These are intentionally unaccepted exploratory candidates. No iPhone acceptance and not suitable for production.

Important: test controls set gesture mock for rendering and do not simulate a full real two-finger sequence. Actual smoothness and scroll-anchor correction unverified. Further work: compare anchored scroll compensation plus single-layer layout with release and direction reversal, avoid ghosting.
