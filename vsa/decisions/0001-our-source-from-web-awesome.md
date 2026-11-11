# 0001: Our source starts from Web Awesome

**Decision:** `packages/webawesome/` is our source. It starts from the Web Awesome `v3.14.0` release (MIT), and we change it step by step. We do not follow an upstream. We keep the Web Awesome system, because the agent skills and our docs work only with it.

```
Web Awesome v3.14.0 (origin, fixed)  →  packages/webawesome (our source)  →  vsa/vendor/webawesome (our build)  →  VSA theme + palette  →  app variation
```

## What we keep: the system

| Part | Examples |
|---|---|
| Names | `wa-*` elements, `--wa-*` tokens, `wa-theme-*`, `wa-palette-*`, `wa-brand-*` classes |
| Cascade layers | The layer names and their order in `styles/layers.css` |
| Theme model | Palette, brand and variant mapping, roles, scale controls, light and dark scopes |
| Component API pattern | Attributes, slots, parts, custom states, events, component custom properties |
| Utilities and native styles | `wa-stack`, `wa-cluster`, `wa-grid`, `wa-gap-*`; `native.css` |
| Skills | `webawesome` (component reference) and `webawesome-design` (guidelines) |

## Rules

- A change to the system needs a decision record. The system is the parts in the table above, and the component API: an attribute, a slot, a part, a custom state or an event. Reason: the skills, the docs and the apps depend on it.
- A change inside a component needs no decision record: a fix, a default value, the implementation. A commit with a clear message is enough.
- The list of our changes is the git history: `git diff v3.14.0 -- packages/webawesome`.
- The skills are build output of our source. After a change, build again and copy the skills to `.claude/skills/`. Do not edit `.claude/skills/` by hand.
- The guideline source `packages/webawesome/scripts/design-skill/` is part of the system. Change it only with a decision record.
- Keep `LICENSE.md` and the Web Awesome copyright notice. Use no Web Awesome Pro code.
- An app component starts in the app, with the app prefix. It moves here when two or more apps need it.

## Reason

Three reviews compared our first design system with Web Awesome, and one more review read the Web Awesome source.

| Need | Our first system | Web Awesome |
|---|---|---|
| Behavior: forms, keyboard, focus | Each component writes it again. A review found 10 problems in 5 components | Base classes and validators, shared by each form control |
| Tests | None | A test file for each of the 73 components, in real browsers, with axe |
| Variants | New tokens for each variant of each component | A variant maps generic tokens to a color role |
| Docs | Written two times | Doc tags make a manifest, and the manifest makes the docs and the skills |

We own the source so that each file we ship is ours, with no outside service at run time and no merge work. We keep the system so that the skills stay correct for our code.

## Cost

- We get no Web Awesome fixes. Each fix is our work.
- A build step: Node, npm and esbuild. The build on Windows needs the path fix in `packages/webawesome/custom-elements-manifest.js`.
- The skills describe our source only after a build and a copy.

## Open questions

- How apps get the built files: an npm package, a static-file package for Blazor, or another way.
