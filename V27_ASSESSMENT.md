# v27 focal overlay — preliminary, NOT accepted

Created research-only prototype `pinch-v27-focal-overlay.html`. It switches the underlying grid atomically at a hysteretic threshold, then draws a 220ms animated focal tile over it, from the old to new focal position. The idea is to preserve visual continuity of the *selected tile* while retaining a fully packed underlying grid.

The source downloaded successfully to the user's Windows PC; extracted JavaScript passed `node --check` syntax validation. **No Chrome rendering or gesture test has been completed**.

Critical limitations visible from implementation: (1) the underlying grid already renders the focal tile, so the overlay temporarily **duplicates the same identity**, (2) all nonfocal tiles still jump atomically, (3) rapid reversal can replace an unfinished overlay, (4) animation is time-based, not gesture-progress-driven. These violate the target user experience. Do NOT merge or present as a working solution. Production and viewer untouched.

Next: remove underlying focal tile during overlay, and test actual Chrome frames, including rapid reverse, before deciding whether to continue this branch.
