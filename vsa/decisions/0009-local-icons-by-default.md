# 0009: Our icons are the default icons

**Status:** accepted on 2026-11-11.

**Decision:** Our Web Awesome build loads the default icons from our own files, next to the build. An app loads Web Awesome as usual and sets nothing for icons. An app that needs another icon folder sets the attribute `data-webawesome-icons`. `vsa/setup.js` is deleted.

| Source of the icon folder | Order | When |
|---|---|---|
| `setIconPath()` | 1 | An app calls the Web Awesome API |
| `data-webawesome-icons` on any element | 2 | An app needs another folder. A path or URL, resolved from the page |
| `<base path>/icons/svgs` | 3 | Default. The base path is the folder of our Web Awesome build |

**Code.** `getIconUrl()` in `packages/webawesome/src/components/icon/library.default.ts` uses order 3 in place of the Font Awesome servers. `getIconPath()` in `packages/webawesome/src/utilities/base-path.ts` reads the attribute, as `getBasePath()` reads `data-webawesome`.

**Files.** The icons are in `vsa/vendor/webawesome/icons/svgs/`. `vsa/scripts/vendor-webawesome.mjs` keeps this folder when it copies a build.

The published claude.ai artifact is one file, with the icons as data URLs. `vsa/scripts/build-artifact.mjs` adds an icon resolver and a fetch fix to that file only.

## Reason

- VSA apps use our design system with no outside link. The icons are part of it.
- An app must not need a script or an attribute to get our icons.
- Web Awesome sets its other options with attributes: `data-webawesome` for the base path, `data-fa-kit-code` for the Pro kit. The override uses the same form.

## Cost

- No icon loads from the Font Awesome servers by default. An app that wants them sets the attribute to the server URL.
