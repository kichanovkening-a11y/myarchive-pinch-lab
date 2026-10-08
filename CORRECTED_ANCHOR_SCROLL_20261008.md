# Corrected anchor scroll — 2026-10-08

New isolated demo anchor-scroll-corrected-test.html. Corrected sign: stage.scrollTop += (tileCenterY - focalY). FocalY seeded from actual tile center before each synthetic gesture.

Puppeteer 390x844 DPR2, anchors 2,7,12,29,59, densities 5.1,5.14,5.16,5.5,5.9,6: 30 cases, no JS errors. Anchors 29/59 with initial scrollTop 450 maintain vertical focal error 0 throughout; anchors 2/7/12 near top have clamp-limited vertical errors up to -7,-20,-33px at density 6. Horizontal identity jumps remain: anchor 12 x 153→0 at threshold, anchor 7 x153→76, anchor29 x306→381. No iPhone acceptance, no production change.

Interpretation: vertical anchoring is solvable in scrollable interior, but 5→6 column ownership changes x discontinuously; a single strict row-major layout cannot eliminate it by vertical scroll adjustment.
