# 0005: Fork Web Awesome

**Decision:** VSA Design owns a copy of Web Awesome core (MIT), from the `v3.14.0` release. We build it from `packages/webawesome` and ship the output with our files. We use no Web Awesome CDN. We do not change the component source by default: our style is a Web Awesome theme and palette (see `0006`). Each app adjusts that base the Web Awesome way.

```
Web Awesome source (upstream, MIT)  →  our build, vendored  →  VSA theme + palette  →  app overrides
packages/webawesome, unchanged         vsa/vendor/webawesome    vsa/theme/               wa-brand-*, override layer
```

A change to the component source is allowed only when no token, attribute or documented part can give a look or a behavior. Each such change needs its own decision record, and we offer it upstream when it is a fix.

## Rules

- Use only the MIT core. Do not copy Pro components or Pro themes.
- Keep the Web Awesome license file and the copyright notice.
- `upstream` is the Web Awesome repo. Merge an upstream fix only when we want it.
- A project token (`--vsa-*`) is only for an idea that Web Awesome has no token for.
- An own component uses the `vsa-` prefix, reads `--wa-*` tokens, and uses the custom property names of the nearest Web Awesome component.
- An app component starts in the app, with the app prefix. It moves here only when two or more apps need it.

## Reason

Three reviews compared our own system with Web Awesome, and one more review read the Web Awesome source.

| Need | Our own system | Web Awesome |
|---|---|---|
| Behavior: forms, keyboard, focus | Each component writes it again. A review found 10 problems in 5 components | Base classes and validators, shared by each form control |
| Tests | None | A test file for each of the 74 components, in real browsers, with axe |
| Variants | New tokens for each variant of each component | A variant maps generic tokens to a color role |
| Docs | Written two times | Doc tags make a manifest, and the manifest makes the docs |

We own the build so that every file we ship is ours, with no outside service at run time. The source stays unchanged, so that upstream merges stay simple and the system stays as stable as the Web Awesome release. A look that has no token goes through a documented part first. The known limits are the SVG progress ring and the tab indicator: see `0006`.

## Cost

- A build step: Node, npm and esbuild. Automatic tests need Node in any case.
- The upstream build assumes Linux or macOS. On Windows it made wrong module paths. See `0007` for the fix.
- Upstream fixes need a merge and a new build.

## Open questions

- How `vsa-template` gets the built files: a `VSA.Design` package with static files for Blazor, or npm.
