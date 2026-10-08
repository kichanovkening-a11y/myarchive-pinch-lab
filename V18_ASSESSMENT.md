# v18 zoom/settle assessment — NOT RELEASED

Prototype: pinch-v18-zoom-settle.html in this research branch only.

New behavior compared to previous failed approaches:
- During active two-finger gesture a **single integer-topology grid** scales continuously, with intact equal-size tiles, no duplicate IDs, and a deterministic focal item+fraction anchor.
- HOLD during gesture is static; reversing the pinch returns to the same scale and positions.
- On release, a 260 ms eased per-item FLIP-like transition settles into canonical 5 or 6 columns.
- The endpoint always uses originX=0 and canonical row-major packing.

Hard limitation: the release animation is not collision-free. Deterministic full 2D AABB test of a representative 5.5→6 settle with 120 tiles, 390 px viewport:
| animation progress | overlapping pairs |
|--:|--:|
|0|0|
|.1|68|
|.25|68|
|.5|116|
|.75|36|
|.9|20|
|1|0|

Thus this is an explicit **tradeoff**: clean reversible live pinch in one topology, brief 260 ms overlaps on release. It does NOT satisfy the original requirement for a continuous row-major 5→6 topology during the gesture, and the 260 ms settle is a timed catch-up previously disallowed. The prototype is for technical inspection, **not** ready for user iPhone acceptance. No production change. Do not claim PASS.

Follow-up needed: independent browser/iPhone visual verification, exact focal drift test during gesture, rapid interruption during settle, and comparison against Apple Photos reference. If these fail, reject rather than publish.
