# Navbar analysis — Figma 1083:6981 (2026-10-23)

Source: https://www.figma.com/design/HlSf5q1m1zpBssaJBfOVr9/?node-id=1083-6981

The source is a FRAME named nabv, not a component set. No prototype reactions or alternate states are defined on this frame or its descendants. Icon instances use Style=Stroke and Type=Rounded.

- Outer frame: 257 × 48, horizontal auto layout, space-between, 4px padding, radius 60, #161616. No visible stroke or effects.
- Brand: x=4, y=4, 40 × 40, radius 100, #202020. Logo 16.375 × 20.46875, centered, #14F195.
- Controls: x=125, y=4, 128 × 40, horizontal gap 4.
- Language/settings/menu buttons: x=125/169/213, y=4, 40 × 40, padding 8, radius 100, #202020.
- Icons: 24 × 24 slots; visible language/menu assets 21.5 × 21.5, settings 21.5 × 19.5; #CCCCCC. Menu uses horizontal reflection from the source transform.
- Original SVG downloads saved in assets/navbar and embedded as data URIs for Figma plugin loading.

Before replacement, implementation was full-width with 44px height, 36px controls, an added inset border and old icon assets. Updated to live source geometry with right alignment. Existing React handlers retained. Language button was and remains disabled; design supplies no language switching behavior. Settings opens API key/subscription controls; menu opens existing AppMenu.

Validation: actual index.html rendered in Chrome at 320 × 680. Header measured x=55,y=16,width=257,height=48. All four images loaded. Settings > Manage API Keys visible and Open menu > About This Plugin visible. Syntax parsed with esbuild. Screenshots: navbar.png, full.png, menu.png. Figma-host runtime was not exercised.
