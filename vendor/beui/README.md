# beUI Select

Official component: https://beui.dev/components/motion/select

Registry: https://beui.dev/r/select.json

The six registry source files are stored verbatim. `source.json` records their
SHA-256 hashes, verified by `npm run build:plugin-ui` before bundling.

## Runtime integration

- Run `npm ci`, then `npm run build:plugin-ui` after changing dependencies.
- The build embeds the official Select and its dependencies between the generated
  markers in `index.html`. Figma receives one HTML string, so no local module
  fetches or additional network domains are needed.
- The bundle reuses the UI's existing React runtime. The root project's build
  command for the admin dashboard is unchanged.
- `LanguageSelector` adapts existing values, change callbacks, disabled state,
  and labels. It uses the official Select, SelectTrigger, SelectValue,
  SelectContent, and SelectItem primitives, including their spring motion,
  reduced-motion behavior, keyboard navigation, and focus handling.
- Styling is scoped to `.beui-language-select` to map beUI's theme to RTL
  Master's existing colors. The list scrolls at 240px, and the language row
  allows the floating panels to extend beyond the Translate Text card.

Keep product-specific adaptations outside the vendored source files. Rebuild
the embedded bundle before publishing the plugin UI.
