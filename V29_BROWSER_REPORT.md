# v29 local-neighbor easing — initial browser result

Created `pinch-v29-local-neighbor-ease.html` on isolated research branch. Upon 5↔6 threshold change, the focal tile is overlaid and 25 surrounding item IDs are interpolated from previous to new canonical positions over 220ms; an interrupted transition restarts from computed current positions.

Actual HTML downloaded to Windows. Extracted JS passed `node --check`. Puppeteer Chrome at 390x844 DPR2: start at scroll offset 500, focal #58, switch to 6 at d=5.59, reverse to 5 at d=5.40 after 65ms, wait 300ms. At both threshold crossings `neighbors.size===25` and overlay present. At completion both are cleared. No page errors.

**Not accepted**: interpolation of only 25 items leaves a visible discontinuity at boundary to unanimated items. Intermediate tile overlap and blank coverage have not been measured. Rendering of neighbor tile sizes is still target size rather than interpolated size, which can cause transient gaps/overlaps. This is a state-machine smoke test, not a visual PASS. Production untouched.
