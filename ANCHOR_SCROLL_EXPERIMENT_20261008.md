# Anchor-scroll experiment — 2026-10-08

Isolated demo: anchor-scroll-threshold-test.html, main branch. Uses one active grid, early 5→6 threshold 5.15, scrollTop correction toward focalY. Original and production untouched.

Puppeteer 390×844 DPR2: anchors [2,7,12,29], densities [5.1,5.14,5.16,5.5,5.9,6], no JS errors.
- Anchor 29, focalY=420: scrollTop ~92 at 5.1, 89 at 5.14, 11 at 5.16; focal vertical error 0 through 5.16; scroll reaches 0 at 5.5 and error grows -10,-32,-37px.
- Anchors 2/7/12: scrollTop clamps at 0, focal errors remain large because synthetic focalY=420 is not a valid initial actual touch point for these top-of-grid tiles; do not interpret these as real pinch regressions.
- Fundamental: vertical scroll compensation cannot address horizontal row-membership displacement; no full-touch iPhone acceptance.

Do not present as a fix. Next need realistic gesture focalY seeded from tile position, and quantify horizontal movement and release/reversal.
