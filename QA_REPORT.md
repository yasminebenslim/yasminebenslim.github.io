# Part 2 Acceptance Checklist

Target viewports tested: **1600×1000 desktop** and **375×812 phone**.

## Design unchanged

- [x] Five sections remain in the same order: `home`, `work`, `service`, `experience`, `contact`.
- [x] Existing portfolio content, generated project imagery, generated experience imagery, typography, palette, and resting layout remain intact.
- [x] Portrait resting size/position still comes from the original runtime measurement logic.

## Scrolling / navigation

- [x] Desktop wheel/trackpad handling advances exactly one section per gesture and lands on a hard section stop.
- [x] Section dots update with the active section and are clickable.
- [x] Progress bar is tied to actual scroll progress and transitions softly.
- [x] Arrow Down / Arrow Up move one section at a time.
- [x] In-page nav and CTA anchors use the same smooth section navigation.
- [x] Phone keeps normal free scrolling; a test scroll of 137px beyond the Work section start remained 137px (no snap).

## Hero

- [x] Navigation is visible immediately.
- [x] First name, remaining name, left block, and social block use the requested staggered reveal timings.
- [x] Portrait stays hidden before ~1.0s, then rises from below over 1.5s with the dedicated portrait easing.
- [x] Automated timing check: portrait opacity was `0` at ~0.85s, already rising at ~1.2s, and fully settled at ~2.65s.
- [x] Portrait color reveal uses a cursor-centered radial mask: full color to 120px radius, soft edge to 170px; mask clears on pointer leave.
- [x] Availability dots pulse every 1.8s; the scroll-hint line loops every 1.8s.

## Other sections

- [x] Work cards reveal at 0.05s + 0.10s per card.
- [x] Service rows reveal at 0.05s + 0.10s per row.
- [x] Experience rows reveal at 0.05s + 0.08s per row.
- [x] Contact block reveals as one unit.
- [x] Project hover lift, image zoom/color reveal, and arrow badge are implemented.
- [x] Service row shift / opacity / arrow rotation are implemented.
- [x] Button, nav-link, social-pill, email, and contact-link hover treatments are implemented.
- [x] Experience preview card is 230×150px, tilted −4°, follows the cursor, fades in/out, and switches mapped project imagery per row.

## Global / responsive

- [x] 10px difference-blend custom cursor exists on mouse devices and grows over links, service rows, and experience rows.
- [x] Custom cursor, experience preview, portrait color reveal, section dots, and scroll hint are disabled/hidden on phone/touch layouts as required.
- [x] 375×812 browser test reported no horizontal overflow (`scrollWidth == innerWidth`).
- [x] 1600×1000 and 375×812 browser test sessions produced no JavaScript console/page errors.
- [x] Animation fail-safe reveals content instead of leaving it permanently hidden if initialization fails.

## Test note

Direct `http://127.0.0.1` and `file://` navigation is blocked by the sandbox administrator in this execution environment. To test the exact project bytes in a real Chromium rendering engine, the HTML, CSS, JavaScript and local assets were injected into Playwright in-memory. This allowed viewport, layout, scroll, animation, hover, cursor, mask, and console-error checks at the requested **1600×1000** and **375×812** sizes.
