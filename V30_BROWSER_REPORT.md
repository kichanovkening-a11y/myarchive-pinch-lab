# v30 full-frame layer fade — preliminary test

Created `pinch-v30-layer-fade.html` on isolated research branch. At a 5↔6 hysteretic threshold, underlying new canonical grid is rendered full-screen, then old canonical grid is drawn over it with linearly decreasing alpha over 160ms. This avoids independently translating 25/120 tiles; each layer individually is a valid full-width whole-photo grid.

Windows Chrome/Puppeteer iPhone viewport 390x844 DPR2: after 5→6, old layer correctly reported 5 columns; after reversal 45ms later, old layer correctly reported 6 columns; after 250ms the layer was cleared. No JavaScript page errors. JS syntax check passed.

**Important: this is not a visual PASS.** During fade both layouts simultaneously show many of the same photo identities, so whole-frame ghosting is intrinsic. Reverse before fade ends currently discards the partially composited old frame, potentially causing a visual jump. No pixel-level comparison or real iPhone test. Do not merge. Production and viewer untouched.
