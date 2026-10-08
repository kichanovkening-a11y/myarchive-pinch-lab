# v29 full visible geometry — FAIL

Chrome/Puppeteer on Windows, 390x844 DPR2. Scroll offset 500, focal #58, 5→6 at density 5.59. Counted rectangle overlaps (>1px both axes) among 71 visible underlying tiles, excluding focal overlay; calculated positions using v29 easing at normalized transition progress.

| Progress | Overlapping pairs |
|--:|--:|
|0|32|
|0.25|38|
|0.50|41|
|0.75|34|
|1|0|

The local 25-neighbor animation conflicts with already-switched surrounding tiles. Counts do not include the focal overlay, so true visual overlaps can be higher. **Reject v29** as seamless pinch. This measurement is geometry-level, not physical-device visual acceptance.

Proposed next: change the mechanism, not expand the animated radius: interpolate one coherent full-screen presentation layer then hand off to the final grid, with explicit limits on ghosting, and test reverse interruption. Production untouched.
