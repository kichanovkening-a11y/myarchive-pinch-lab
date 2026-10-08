# v22 soft shift: preliminary result

Prototype: pinch-v22-soft-shift.html, isolated research branch only.

Headless Chrome iPhone-sized 390x844, DPR2: JS runtime test PASS (no page errors). At density 5.58, a 190ms interpolation begins from 5 to 6 columns; after 350ms, it completes. The focal item identity is preserved in state (#58).

**Not a visual acceptance**. Because each tile independently interpolates from a canonical 5-column position to a canonical 6-column position, mid-transition overlap is expected. Side gaps, focal screen drift, rapid reversal, hold behavior and real-device rendering have NOT yet been quantified. This prototype should NOT be merged or sent as a solved version. Main and production unchanged.
