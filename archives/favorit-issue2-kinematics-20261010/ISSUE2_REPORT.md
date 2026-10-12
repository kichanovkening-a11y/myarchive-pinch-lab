# Issue #2: isolated rendering experiment

Production, backend, bot, reference, previous test directories and viewer unchanged. No service restart. This is not an iPhone visual PASS.

Test: https://archive.vip-teatre.ru:8443/favorit-issue2-20261010/
Audit: add ?compare=1&audit=1. Control: baseline.html?compare=1&audit=1 in the same directory.

## Evidence and changes

The four suspected legacy layer functions received zero calls during measured runs. They are dormant, not an established cause.

favorit-gallery.js render now memoizes inline style assignments without changing display semantics, geometry or the reusable pool. Memoization is invalidated on materialize/resume. Six unchanged Canvas frames previously assigned display 1080 times, now zero. Two identical HOLD frames previously assigned styles 690 times, now zero.

Preview bitmap preparation is deferred while gesture/settle/glide is active; decoded images remain usable. Existing work already in flight cannot be cancelled. No added requests or file cap.

The copied index.html no longer inherits the shared persistent runtime-diagnostics flag. The legacy optional tracer performs synchronous snapshots/style reads/JSON/localStorage writes outside render. It was disabled in measured desktop runs; its state on the physical iPhone is unknown. This is a concrete risk, not a proven explanation of >100ms intervals. Explicit diagnose=1 remains opt-in in this copy only, without mutating the shared flag.

No visibility experiment. Density, gap, anchor, touch lifecycle, inertia and settle algorithms are preserved. Model/CSS/viewer hashes match parity control.

## Desktop measurements

Five repeats per scenario, identical scripted touch sequence, real dataset 146 unique records, warmed/decoded previews, 1280x586 gallery on a high-refresh desktop browser. Not iPhone measurements. Render execution and rAF intervals measured separately. Diagnostic overhead applies to both variants. HTTP cache state unknown.

| Scenario | Control render median / p95 range ms | Candidate median / p95 range ms | Control / candidate max rAF ms |
|---|---|---|---|
| 3↔10 + HOLD | .4 / .5–.7 | .2 / .4–.5 | 34.7 / 13.9 |
| 9↔10 ×4 | .5–.6 / .9–1.2 | .3 / .5 | 41.7 / 34.7 |
| 1→30→1 + reverse | .6–.8 / 1.5–2.8 | .4–.5 / 1.5–2.7 | 14.7 / 13.9 |

All runs valid; zero intervals >50 or >100ms. rAF median ~6.9ms, not a 60Hz device. Typical 3↔10 run style writes fell from 55079 to 12178 (~78%); display assignments 37829→230. Stable 180-node pool, 541 elements before/after, no node addition/removal during gestures. Zero JS errors and decode failures. Residual 34.7ms candidate seam interval despite short JS illustrates that render time alone does not explain full-frame latency. No GPU/WebKit diagnosis is established.

## Verification

21/21 automated tests pass, including real renderer output equality to parity control, reference geometry 1..30, HOLD/reverse/cancel/multiple touchmoves, pooled file-ID handlers, and uncapped pagination.

Actual browser functional probe: 40→80→120→146 records, 146 unique, order and pool preserved. Photo opens by file.id; selection and exit work. DOMRect maximum error .010706px at tested densities 1,3,4,5,6,7,8,9. Canvas densities 10,15,30 have no missing decoded photo sources; DOMRect measurements do not validate Canvas pixels. No errors. Video/document viewer interactions, destructive file actions, and physical long-press/reorder were not exercised; their code is unchanged.

Production hash: 299486be571d94005269d92390c2d595824b6fd46c568382990f11523006720a
Backend hash: c953e53660e9413383d80bf4e13c0638ebca001c650df40219565159db8c106b
Viewer hash: 67af77b934e31161bf4c2d4e264f4386a397f503318483e34322b4689abeaed2

## iPhone verification

Open clean test URL in Safari and Telegram. Use the same populated folder; 3→10→3, HOLD near9/10, repeated reverse, fast1→30→1, scroll, photo open/back and selection. Full folder remains available; no dataset cap. Compare baseline URL on the same phone/folder. Audit page supports five repeats and physical capture without prewarming, separate render/rAF statistics, cache annotations and full Copy JSON. Record warm/cold state rather than infer network causes. Physical smoothness and elimination of prior >100ms stalls remain unconfirmed.

Only this new test directory was created/changed. Production is not deployed. The inherited REPORT.md describes the earlier parity baseline, not this experiment; this file is the authoritative current report.
