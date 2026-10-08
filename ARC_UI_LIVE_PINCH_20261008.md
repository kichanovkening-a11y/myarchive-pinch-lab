# Arc UI Photo Grid live pinch test — 2026-10-08

URL https://uiarc.dev/components/photo-grid. Tested actual hydrated demo in Chrome mobile emulation 390x844 DPR2 on authorized Windows PC via Puppeteer/CDP Input.dispatchTouchEvent. No production/original changes. 16-photo demo, configured 3,5,2 columns. Full networkidle2 wait necessary: earlier DOM-ready attempts misleadingly suggested buttons did not work.

Button test: click 5 photos per row updates --columns 3→5 and pressed state.

Pinch synthetic two touches centered x195 y610, separation 120→110→100→90→80→70→60→50→40→30→40→60→90→120. Sampled first 8 li bounding boxes after 130ms each:
At 120 start columns=3, tile0 x47 y445 w97.
110: cols3 tile0 x59 y459 w89
100: cols3 tile0 x72 y473 w81
90: cols3 tile0 x84 y487 w72
80: cols3 tile0 x96 y500 w64
70: cols5 tile0 x47 y445 w57 (topology switch and reset)
60: cols5 tile0 x56 y455 w54
50: cols5 tile0 x61 y460 w52
40: cols5 tile0 x64 y464 w50
30: cols5 tile0 x66 y467 w49
reverse 60: cols5 tile0 x56 y455 w54
reverse 90: cols5 tile0 x5 y398 w73
reverse 120: cols3 tile0 x47 y193 w97; end same.

Interpretation: smooth CSS transforms between threshold changes, discrete topology switch 3↔5, abrupt measured rect jumps at threshold and large vertical scroll/anchor shift on reverse. No JS errors. Does NOT establish 3–10 seamless transitions or absence of visible artifacts on real iPhone. The demo itself appears to accept jumps and changing scroll offset. Further investigation should quantify release behavior and viewport coverage and avoid claiming this is perfect.
