# Canvas draw-budget experiment (2026-10-10)

Isolated exploratory copy of `photos-glide-favorit-1-0.html`. **Do not deploy or merge into main.**

## Hypothesis
At high density (10–30 columns), decoding/drawing a large number of photo thumbnails in a single canvas paint may block Safari's main thread. This variant caps successful `drawImage` operations at 120 per render to measure the responsiveness tradeoff.

## Known limitation
This is **not** a finished fix: if more than 120 thumbnails are visible, the remaining cells show fallback color instead of the photo. The image budget is reset each render. Do not ask the user to compare subjective smoothness against the original until image completeness is preserved. This is a deliberately isolated probe, not a candidate release.

## Next engineering criterion
Preserve all visible images by using persistent bitmap/tile caching or progressive image completion across frames; compare actual iPhone touch pinch and scrolling to the protected original. Do not modify viewer, original, production, backend or the approved gallery.

## Existing evidence
Previous iPhone A/B modes showed that reducing thumbnail size, predecoding, and removing network traffic during gestures did not reliably eliminate long frame gaps; thus this hypothesis is unproven.
