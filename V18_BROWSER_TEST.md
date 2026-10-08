# v18 independent browser test — FAIL

Executed on user's Windows PC in headless Chrome at iPhone-sized viewport (390x844, DPR 2), using Puppeteer and actual HTML from this branch. Local script: C:\Users\kicha\pinch-lab-tests\test-v18.cjs. Production untouched.

At fixed center focal item #23, setD produced:

| density | left blank strip (CSS px) | right blank strip (CSS px) |
|---:|---:|---:|
|5.0|0|0|
|5.1|3.82|3.82|
|5.5|17.73|17.73|
|5.9|29.75|29.75|
|6.0 (before release)|32.50|32.50|

**FAIL**: 5-column grid shrunk to 6-column tile size fills only 5/6 viewport width, leaving 65 px of horizontal blank at 6.0. Negative scrollY near top also risks vertical blank. On release, 260ms FLIP yields previously measured overlaps (up to 116 pairs for 120 tiles).

Decision: do not publish v18 to users or merge to main. This is geometric, not an easing bug. Next candidate must pass automated side-gap, collision, focal drift, reverse and hold tests. v3 remains the best continuous coverage benchmark, with known seam-splitting compromise.
