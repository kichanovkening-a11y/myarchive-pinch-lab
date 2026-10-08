# X-relaxation research: preliminary hard rejection (2026-10-08)

Scope: standalone pinch lab only; no production modifications.

## Hypothesis
Relax strict horizontal focal locking during gesture while preserving canonical full-width integer endpoints, intact equal-size square tiles, and vertical anchoring. Test whether straightforward deterministic topology interpolation becomes perceptually acceptable.

## Deterministic geometry
Viewport width 390 CSS px; 120 identities. For d in [5,6], tile size s=390/d. Let p=d-5 and t=p²(3-2p). For identity i:
- x=(1-t)*(i%5)*390/5 + t*(i%6)*390/6
- y=(1-t)*floor(i/5)*390/5 + t*floor(i/6)*390/6

At 5 and 6 positions are canonical, HOLD/reverse are mathematically deterministic. Pairwise 2D square intersections were evaluated for all 120 tiles (without viewport clipping), excluding negligible area <=0.01 px².

| density | overlapping pairs | total pairwise overlap area px² |
|---:|---:|---:|
| 5.00 | 0 | 0 |
| 5.10 | 68 | 12699 |
| 5.25 | 68 | 78095 |
| 5.50 | 116 | 143184 |
| 5.75 | 303 | 79487 |
| 5.90 | 287 | 23346 |
| 6.00 | 0 | 0 |

## Decision
**FAIL, do not publish a user-facing prototype.** Merely relaxing horizontal focal anchoring does not solve collision/pile-ups: overlaps persist over almost the entire fractional interval and worsen dramatically around 5.5–5.9. The pairwise area double-counts multiply overlapped regions and is not a unique occluded-area metric.

This is a rejection of naive interpolation, not proof of impossibility for all collective or texture-space techniques. v3 at commit 4af8dd2fd81bcb482228cfeff6f7fee5ed68bbba remains untouched baseline. Next promising direction would require a new visual representation or an explicitly acceptable compromise, not another interpolation tweak.
