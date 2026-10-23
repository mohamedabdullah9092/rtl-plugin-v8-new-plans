# Navbar source analysis

Source: https://www.figma.com/design/HlSf5q1m1zpBssaJBfOVr9?node-id=1083-6981
Live inspected: 2026-10-23. Node is a FRAME named nabv, with three nested icon instances; no variant states were supplied on this frame.

| Element | Position within navbar | Size |
|---|---|---|
| Navbar | 0, 0 | 257 x 44 |
| Logo circle | 4, 4 | 36 x 36 |
| Logo image | centered within circle | 16.375 x 20.4688 |
| Controls group | 137, 4 | 116 x 36 |
| Language button | 137, 4 | 36 x 36 |
| Settings button | 177, 4 | 36 x 36 |
| Menu button | 217, 4 | 36 x 36 |

Outer fill #161616, radius 60 (visually a pill); circle fill #202020, radius 100. Padding 4; control gap 4. No visible border or shadow. Source uses left logo and right controls regardless of page text direction. Icon slots are 20 x 20; actual SVG roots retain their exported dimensions. Language and settings artwork is about 17.916 x 17.916; menu is 14.584 x 12.916 and horizontally reflected as in source. Logo uses #14F195. Exact downloaded SVG artwork is embedded in the single-file plugin UI to work inside Figma.

Current implementation uses React createElement in index.html, existing Tailwind utilities, and additional CSS. Conflicting overrides enlarged the navbar to 56px, buttons to 48px, logo circle to 44px and artwork to 24px; CSS also replaced the menu with vertical dots and drew a substitute settings icon. These overrides were removed. The newly exported settings SVG also differs from the previous local export, so all four source assets were refreshed.

Behavior retained: language button is disabled in existing product; settings opens API-key management and subscription management for Pro users; menu opens existing AppMenu; account/trial/upgrade controls remain below the navbar. Figma frame supplies appearance, not destination behavior or hover/pressed variants. No new language workflow was invented.

Placement: native 257px navbar aligned to the right with existing 8px outer margin; maximum width adapts to narrower host windows. Existing plugin logic in code.js was not edited.
