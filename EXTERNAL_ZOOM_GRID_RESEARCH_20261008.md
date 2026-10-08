# External gallery research — 2026-10-08

## Strongest reference: wassgha/react-native-zoom-grid
Source inspected via GitHub: src/ZoomGrid.tsx and src/ZoomGridList.tsx.
- Concurrent pre-rendered grids for each zoom level.
- Gesture shared scale and focalX/Y; per-grid relativeScale and translation to align the target tile.
- calculateLayerConfig pads beginning of target grid to place focal tile at desired column and scroll offset.
- Zoom-out: active layer opacity interpolates 1→0 as s 1→0.66, target layer visible underneath. Zoom-in: target layer opacity interpolates 0→1 as s approaches ratio currentCols/targetCols.
- Commit on gesture end after withTiming 250ms.
- Native-only dependencies React Native Reanimated, Gesture Handler, LegendList; cannot drop into Telegram Mini App WebView.
- Potential flaws for our requirements: padded leading blanks; overlapping layers/ghosting; snap on release; code does not prove no duplicates. Need tests.

## Other references
- Telegram official Mini Apps: disableVerticalSwipes and viewport APIs handle host gesture/height interference, not gallery layout.
- neptunian/react-photo-gallery: justified layout algorithm (Knuth-Plass inspired), not interactive pinch density.
- codesweetly/react-image-grid-gallery: adjustable column counts, not continuous pinch.
- react-pic-gallery: touch lightbox pinch, not grid pinch.

## Next research direction
Build separate web prototype of focal-aligned two-grid presentation; preserve original touch tracking; measure overlap, duplicates, full-width coverage and release jumps. Never modify original or production without explicit approval. No validated new prototype yet.
