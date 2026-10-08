# v25 duplication audit — FAIL

Actual v25 HTML opened in headless Chrome at iPhone viewport 390x844 DPR2. Geometry of first 120 items counted for full-size tiles rendered in adjacent fractional rows. No JS page errors.

| density | duplicate identities among 120 | max copies per identity |
|--:|--:|--:|
|5.00|0|1|
|5.10|21|2|
|5.25|17|2|
|5.50|11|2|
|5.75|15|2|
|5.90|18|2|
|6.00|0|1|

At noninteger densities, whole-tile backfill draws the same photo in two rows. Removing duplicate copies reintroduces row-edge blank regions; alpha fade hides the duplicate but does not restore missing coverage. **Reject v25 as a unique-photo layout**. Numbers count all 120 items, not just those visible in the viewport.

Next experiment: progressive whole-row ownership transfer (stagger the row changes in time), but verify that identity ordering and focal anchor remain stable; it may still jump.
