# v28 single focal overlay — Chrome test

Based on v27, removes the focal tile from the underlying grid while overlay is active, eliminating duplicate rendering of the focal identity. On reversal before overlay completes, computes current overlay geometry and uses it as the new overlay start.

Tested actual v28 HTML on Windows in headless Chrome/Puppeteer (390x844 DPR2). At scroll offset 500, picked focal identity #58, switched to 6 columns at density 5.59, waited 65ms, reversed to 5 at density 5.40, waited 300ms. Observed initial overlay index 57 (zero-based), reversed overlay index 57, and overlay null after completion. No page errors. JS syntax validation passed.

**Still fails target visual contract:** skipping the underlying focal tile can expose a blank tile-sized area; other tiles snap atomically; animation remains time-based, not continuous gesture-driven. No pixel-diff or physical iPhone testing has been done. This is a research-only proof of the reversal state mechanism, not an accepted gallery. Main/prod untouched.
