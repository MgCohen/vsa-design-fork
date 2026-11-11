# 0009: Set the icon folder with an HTML attribute

**Status:** proposed.

**Decision:** We change one function of the Web Awesome source, `getIconPath()` in `packages/webawesome/src/utilities/base-path.ts`. It also reads the attribute `data-webawesome-icons` from the page, as `getBasePath()` reads `data-webawesome`. An app sets the icon folder in its HTML, with no script. `vsa/setup.js` is deleted.

```html
<script type="module"
        src="/vsa/vendor/webawesome/webawesome.loader.js"
        data-webawesome="/vsa/vendor/webawesome"
        data-webawesome-icons="/vsa/vendor/icons/svgs"></script>
```

| Source of the icon folder | Order | Behavior |
|---|---|---|
| `setIconPath()` | 1 | As upstream |
| `data-webawesome-icons` on any element | 2 | VSA only. A path or URL, resolved from the page |
| None | 3 | As upstream: the Font Awesome servers |

The docs page that is published as a claude.ai artifact is one file, with the icons as data URLs. `vsa/scripts/build-artifact.mjs` adds its own icon resolver and fetch fix to that page only. Apps do not load them.

## Reason

- A self-hosted app must not depend on the Font Awesome servers, and must not need a setup script for one setting.
- Web Awesome sets its other options in the same way: `data-webawesome` for the base path, `data-fa-kit-code` for the Pro kit.
- With no attribute, Web Awesome behaves as the upstream release.

## Cost

- One small change to merge at each upstream update. We offer it upstream as a feature.
- Each app page must set the attribute. If it is missing, the icons come from the Font Awesome servers.
