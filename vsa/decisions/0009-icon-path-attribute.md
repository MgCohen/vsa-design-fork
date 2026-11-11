# 0009: Set the icon folder with an HTML attribute

**Status:** proposed.

**Decision:** Each app that uses VSA Design sets the icon folder in its HTML, with the attribute `data-webawesome-icons`. No app needs a setup script for icons. `getIconPath()` in `packages/webawesome/src/utilities/base-path.ts` reads the attribute, as `getBasePath()` reads `data-webawesome`. `vsa/setup.js` is deleted.

```html
<script type="module"
        src="/vsa/vendor/webawesome/webawesome.loader.js"
        data-webawesome="/vsa/vendor/webawesome"
        data-webawesome-icons="/vsa/vendor/icons/svgs"></script>
```

| Source of the icon folder | Order | Behavior |
|---|---|---|
| `setIconPath()` | 1 | Web Awesome API |
| `data-webawesome-icons` on any element | 2 | A path or URL, resolved from the page |
| None | 3 | The Font Awesome servers |

The docs site uses the attribute as each app does. The published claude.ai artifact is one file, with the icons as data URLs, so `vsa/scripts/build-artifact.mjs` adds an icon resolver and a fetch fix to that file only.

## Reason

- An app must not depend on the Font Awesome servers, and must not need a script for one setting.
- Web Awesome sets its other options in the same way: `data-webawesome` for the base path, `data-fa-kit-code` for the Pro kit.
- With no attribute, the icons load as in Web Awesome.

## Cost

- Each app page must set the attribute. If it is missing, the icons come from the Font Awesome servers.
