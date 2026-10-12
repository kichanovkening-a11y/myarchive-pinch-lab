# Issue #2 retest — NOT a physical iPhone PASS

New isolated copy: https://archive.vip-teatre.ru:8443/favorit-issue2-geometry-20261010/
Opt-in geometry/pixel probe: same URL with ?compare=1&audit=1.

The rejected /favorit-issue2-20261010/ directory is preserved. Production, backend, bot, database, reference, viewer and existing test directories were not changed. No restart and no production deployment.

## Confirmed defect and minimal fix

favorit-gallery.js line 7 cached the desired CSS value, not the actual inline state. materialize() directly sets canvas.style.display='none'. resume() did not invalidate the Canvas memo. At unchanged high density the next render skipped restoring display='block'. A real materialize/resume regression failed on the rejected source and passes with the fix.

Two further controlled regressions failed on that source: externally cleared pooled dimensions/transform were not repaired at HOLD; an externally shown DOM tile stayed visible in Canvas mode. These demonstrate a stale-style vulnerability, NOT proof of the writer that caused the physical video.

The sole gallery-code change validates the memo against actual inline style, retaining the browser's serialized value and reusing the memo entries. No getComputedStyle/DOMRect reads are added to the normal renderer. Density/gap/anchor/touch/settle/inertia/order/virtualization are unchanged. It still uses display, not the rejected visibility experiment. No new previews or data cap.

## Reproduction and limits

Desktop browser at actual 390x844 viewport, #files 390x710 (fractional CSS DOMRect width390.4), real API records and loaded images. This is NOT Safari/WebKit or a physical iPhone.

In the short folder with13 records,43 sampled rendered states cover3→10→3,9.49/9.51 handoffs,HOLD,scroll fractions0/.5,materialize/resume and viewer/back. There were no simultaneously visible Canvas/DOM layers, foreign file nodes, duplicate DOM IDs or DOM tile overlaps. Maximum DOMRect error0.010105px; order,viewer density and scroll preserved. No large second photo layer was reproduced. The app background was none in this accessible session. The physical Telegram session/background was not available to automation; the referenced19.8sMP4 is not linked in the Issue comment and was not present among accessible attachments/downloads.

**Do not confuse a finite content end with a rendering hole.** With13 records, width390,height710:

| Columns | Content height | Remaining space below content |
|---|---:|---:|
|3|651.33px|58.67px|
|5|233.20px|476.80px|
|10|76.93px|633.07px|

Continuous full viewport coverage is impossible for this finite dataset at these densities without duplicates, changed size/density or filler tiles. None of those was added. A configured background can be visible beyond the actual end; this is not established as the source of the dog in the physical recording.

The stricter Canvas center-pixel comparison to an independently drawn scratch surface did **not** pass:120samples,17outside tolerance2RGBA units across10states,max deviation25/255; subsequent endpoint samples typically4–5. The threshold was not relaxed to obtain PASS. This residual difference and the physical large-photo symptom remain unresolved; the test copy is not certified visually fixed. Pixel probes inspect actual Canvas bytes, not just model coordinates.

The same43-state test on the larger146-record folder at390x844 also had zero foreign nodes,simultaneously visible DOM/Canvas layers,DOM overlaps or order/viewer-state errors;max DOMRect error0.010116px. Its stricter pixel test failed in1state:66of1340samples,max deviation99/255. These results are reported as FAIL, not silently excluded. Snapshot checks are controlled sampled states, not a proof of every frame painted by physical Safari.

## Tests / measurements

24/24 Node tests pass, including3new red→green regressions,reference geometry1..30,real file-ID bindings and uncapped pagination fixtures. JS parse passes. Unit tests do not certify iPhone rendering.

Fresh actual-browser functional probe at390px:pagination40→80→120→146,unique146,order/pool unchanged,openByFileId=true,selectionByFileId=true,selectionExited=true,missingReady=0 in tested DOM/Canvas densities1,3,4,5,6,7,8,9,10,15,30;zero JS errors.

Five repeated scripted3↔10+HOLD gestures on the short real folder at390x710:render median0.4ms,p95~0.6ms,p99~0.6–0.8ms,max5.4ms; rAF p95~7ms,p99~7.1–7.5ms,max13.7ms,zero intervals>16.7/>50/>100ms. This high-refresh desktop timing is not an iPhone smoothness claim. The last allocation-only memo-entry reuse preserves the measured behavior; performance of that exact final line was not separately remeasured. Strict geometry/pixel probes have additional readback/layout overhead and are not used for timing claims.

## iPhone usage

Clean URL has no diagnostic UI/hooks. Compare the same short and populated folders with the rejected version:3↔10,9↔10,HOLD/reverse,viewer/back,selection and repeated pinch. Opt-in audit provides density-frame controls and Copy geometry; it records background source,viewport,scroll,actual DOMRects,Canvas visibility,foreign nodes and actual sampled pixels. Do not interpret finiteContentBlank as a layer error. Physical iPhone smoothness and removal of the large-photo defect remain UNVERIFIED.

Production SHA256:299486be571d94005269d92390c2d595824b6fd46c568382990f11523006720a
Backend SHA256:c953e53660e9413383d80bf4e13c0638ebca001c650df40219565159db8c106b
Viewer SHA256:67af77b934e31161bf4c2d4e264f4386a397f503318483e34322b4689abeaed2

Modified within the NEW directory only:favorit-gallery.js,index.html,parity.test.cjs,geometry-audit.js,this report. All remaining files are copies; earlier copied reports describe the earlier task, not a current PASS.
