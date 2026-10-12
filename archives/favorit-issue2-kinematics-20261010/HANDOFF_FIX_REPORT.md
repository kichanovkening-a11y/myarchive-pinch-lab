# DOM to Canvas decoded preview handoff

An isolated candidate, not an iPhone smoothness PASS.

The old Canvas renderer opened a separate Image cache even when the same preview was already decoded in a DOM tile. The regression test fails on the archived version: a ready DOM thumbnail is not drawn on the first Canvas frame. This can introduce placeholders and redundant image loading during the gesture.

The candidate uses a ready pooled DOM image for the current file when no ready cached Canvas image exists. The DOM image is never stored in the Canvas cache, since pooled nodes can be reassigned. Cropping uses intrinsic image dimensions, not the element's CSS size. Existing bitmap cache, geometry, gesture timing, viewer, background and backend are unchanged.

25/25 Node tests pass locally. Physical iPhone improvement remains unverified. The supplied 13.308-second recording shows the diagnostic integration and colored placeholders, but it does not provide a matched reference run or trusted input trace. Placeholder evidence does not prove the cause of every jerk.
