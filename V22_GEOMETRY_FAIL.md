# v22 deterministic geometry test — FAIL

Executed on user's Windows PC with Puppeteer/Chrome at 390x844, DPR 2, actual v22 page. Focal item #58, scrollY=500, transition 5→6, 120 tile geometry tested.

| progress | overlapping tile pairs | focal X drift (px) | focal Y drift (px) |
|--:|--:|--:|--:|
|0|0|0|0|
|0.10|68|0.9|0|
|0.25|68|5.1|0|
|0.50|116|16.3|0|
|0.75|36|27.4|0|
|0.90|20|31.6|0|
|1.00|0|32.5|0|

The 190ms easing does not eliminate collisions; it merely spreads them in time. v22 is REJECTED. Main and production untouched.
