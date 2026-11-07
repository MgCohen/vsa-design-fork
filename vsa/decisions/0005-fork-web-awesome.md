# 0005: Fork Web Awesome

**Decision:** VSA Design is a fork of Web Awesome core (MIT), from the `v3.14.0` release. Our style is the base: our theme is the default theme, and the raised and carved looks go into the component styles. Each app is a theme over this base.

```
Web Awesome (upstream, MIT)  →  VSA Design (this fork)  →  app theme
                                 our default theme,          a theme class,
                                 looks in the components,    local components
                                 vsa-* components            with the app prefix
```

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

A theme layer over the prebuilt files could not give our look to all components. The shadow tokens are shared by unrelated components, the progress ring is SVG, and the tab indicator is a border. A fork lets us change the components, and it makes our style the base.

## Cost

- A build step: Node, npm and esbuild. Automatic tests need Node in any case.
- Upstream fixes need a merge, and our changes to the components make conflicts.

## Open questions

- How `vsa-template` gets the built files: a `VSA.Design` package with static files for Blazor, or npm.
- The order to move the looks into the component styles. The first ones are the button, switch, input and card.
