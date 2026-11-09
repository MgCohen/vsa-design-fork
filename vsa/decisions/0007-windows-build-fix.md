# 0007: Fix the module paths of the Web Awesome build on Windows

**Decision:** We change one file of the upstream build tooling, `packages/webawesome/custom-elements-manifest.js`. The plugin `wa-translate-module-paths` first makes an absolute module path relative to the package, with forward slashes. Then its own rules apply. No component source changes.

## Reason

On Windows, the manifest analyzer writes absolute module paths (`C:/…/packages/webawesome/src/components/…`). The plugin strips only a leading `src/`, so the paths stay absolute. Each tool that reads the manifest then gets a wrong path. The React wrappers fail to compile, and the build stops. On Linux and macOS the paths are already relative, so the change has no effect there.

## Cost

- One small change to merge at each upstream update. We offer it upstream as a fix.
- The last build step, `llms.txt`, still fails on Windows for a similar path reason. We do not ship that file, so `vsa/scripts/vendor-webawesome.mjs` ignores that error when the runtime files exist.
