# v26 mixed-row browser test — FAIL for focal stability

Tested actual v26 HTML on user's PC using headless Chrome/Puppeteer at viewport 390x844 DPR2. N=300. Densities 5→5.1→5.25→5.5→5.75→5.9→6→5.5→5. No page JS errors.

At every tested density: 300 unique tile identities, 300 rendered positions, each row fills viewport width exactly. No seam splits or duplicate tile IDs.

But for fixed focal identity, horizontal drift was 0, -78, -162.5, 0, -162.5, +97.5, +32.5, 0, 0 px respectively. Vertical focal drift 0 (interior scroll position). Whole rows reassign photo membership as density changes; this causes large horizontal jumps. REJECT as Apple Photos-like pinch.

Conclusion: row-wise integer ownership guarantees whole photos and no holes but cannot preserve focal X under changing row membership without transient transitions. Need rethink user-visible behavior rather than endless cosmetic animation. Main/prod untouched.
