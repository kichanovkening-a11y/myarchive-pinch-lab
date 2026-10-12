# Pinch history audit — 2026-10-12

Purpose: check earlier work before introducing another smooth-grid transition. No new algorithm, deployment or user-device test performed during this audit.

## Decision

The generic proposal "add a smooth transition between grids" does not identify a new mechanism. Implementing ordinary endpoint interpolation, dual-grid fades, FLIP, fractional size with rounded row membership, or forced single Canvas would repeat existing work. None is justified as a new solution merely because the current transfer still looks jerky.

The current source's rounded topology proves shared geometric steps, not the additional reason the real integration is perceived as worse than the approved reference. The 12 October decoded-DOM-preview handoff fix repairs a separate demonstrated readiness defect; physical feedback says overall smoothness remains insufficient.

## Already attempted

| Family | Recorded artifact | Outcome / exclusion |
|---|---|---|
| Independent tile/rect interpolation | v2, v8, v15; RESEARCH_BASELINE_V3.md | Whole photos, but diagonal collisions/clumps and holes. Not a fresh direction. |
| Whole-grid crossfade / aligned layouts | v6, v13, v14; zoomgrid-web-port-3-10.html; photos-virtual-20k-synced-tuned-1-30.html | Double exposure, anchor/release/coverage problems. Synced Tuned actually uses two Canvas layers and a narrow .40–.60 mix. |
| Micro-FLIP | 20260925_172418 | Prior conversation records rejection for rubbery lag, especially reversal. |
| Fractional size + rounded topology | photos-glide-continuous-size-1-30.html | Already implemented. Size is continuous, row membership still Math.round; not a continuous whole-photo transition. |
| Fractional-flow v3 | original index.html commit 4af8dd2fd81bcb482228cfeff6f7fee5ed68bbba; viewport correction 5768fb8056d7a5200dd89e8fdd3243486bc0c425 | Valued for flow; splits photos between rows. Exact source was recovered in later reports; earlier baseline document saying source absent is stale on provenance. |
| Whole-photo v3 local seam repair | fractional_flow_v3_handoff_20261008/REPORT.md | Linear/smooth/corridor/bowed/fade all failed combined coverage/integrity gate. No browser publication. |
| v3 visual compositor | v3_compositor_20261008/REPORT.md | Mask/underlay/heal/local fade: holes, remnants, jumps or duplicates. No successful candidate. |
| Selective edge transfers | apple_boundary_transfer_20261007/REPORT.md | Local Canvas probe: topology jumps/clumps remained; HOLD could prolong duplication. Rejected implemented schedules, not all possible architectures. |
| Spatial ownership | spatial_ownership_20261007/REPORT.md | Five families and clips failed overall gate. No integration candidate. |
| Continuous manifold / strip wrap | continuous_manifold_proof_20261007/REPORT.md | Analytic continuity alone was possible; collisions, material-camera seams or large voids prevented acceptance. Not a universal impossibility theorem. |
| Collective hard packing | collective_packing_hard_20261008/REPORT.md | Collision-free endpoint-exact constructions exist, but visible voids and concentrated motion fail quality. Do not rerun as a novel solution. |
| Shared camera | common_camera_20261008/REPORT.md; row_structure_20261008/REPORT.md | Exact arbitrary XY anchor conflicts with full-width canonical endpoints for specific cases. Proof conditional on regular row-major endpoints. |
| Edge Reveal | edge-reveal-live-3-10.html; PINCH_CANDIDATES_20261009.md | Preserve as PROMISING BASELINE / NOT ACCEPTED. Continuous scale, but commit reflows/reanchors. |
| Photos Virtual Smooth / Favorit | photos-virtual-smooth-2-30.html; photos-glide-favorit-1-0.html | Previously approved visual references. Both actual scripts use rounded columns; opacity restart is not positional interpolation. |
| Single Canvas | photos-glide-favorit-single-canvas-20261010.html | Already present in lab (Canvas from3, query baseline restores DOM→Canvas). Do not present as new. Physical result for this exact page not established by fetched records. |
| Image/network control | favorit-network-diagnostic-20261010/INVESTIGATION.md | Real previews, predecode, RAM Blob,96px, raw bitmap fallback, DOM-only, minimal profiler already tested as controls. History records delays persisting without HTTP and DOM-only worse. Cause not established. |
| Seam/forced layout | favorit-seam-diagnostic-20261010/SEAM_REPORT.md | display/visibility, skipped width read, forced Canvas/DOM, photos/colors already tested. No convincing desktop advantage; history records rejected iPhone visibility experiment. |
| Lifecycle parity | Issue2 comments6097366739,6097731501,6098128352 | Style memo, stale display repair, deferred bitmap prep, touchcancel/scroll parity and kinematics checked. iPhone smoothness unresolved. |

## Accepted production is a distinct path

work/dominant-report.md records implementation and deployment20261007_170012 of dominant topology with120ms wall-clock handoff, opaque base/incoming foreground, reverse from current blend and no stale queue. An initial real-rAF blocking judgement was superseded after the acceptance invariant changed: first callback past deadline finalizes immediately. Do not reuse the obsolete blocking verdict. Recorded automatic checks do not prove Apple-like physical quality.

## Evidence read

- GitHub main: RESEARCH_BASELINE_V3.md, PINCH_CANDIDATES_20261009.md, actual scripts listed above.
- GitHub Issue2 current discussion.
- Kening work reports: dominant-report.md; continuous_manifold_proof, spatial_ownership, apple_boundary_transfer, common_camera, fractional_flow_v3_handoff, row_structure, v3_compositor, collective_packing_hard; Favorit integration, network and seam reports.
- Personal-context search: previous user ratings and rejected experiments. These history ratings are distinguished from source/probe findings.

## Gate for any subsequent candidate

Before implementation, identify the actual mathematical/rendering difference from every equivalent rejected family and the concrete failure it addresses. A changed coefficient, renderer name, narrower fade or relabelled rect interpolation is not a new mechanism. Reuse preserved artifacts and existing tests rather than rebuilding them. Keep production/backend/bot/DB/viewer/reference and old candidates protected. No new iPhone acceptance is inferred from Node/Chromium tests.
