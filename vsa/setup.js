// VSA setup for Web Awesome. Load this module before the Web Awesome loader.
// It points the default icon library at our vendored Font Awesome Free icons (vsa/vendor/icons), so that
// <wa-icon> makes no request to Font Awesome's servers. This is the "registerIconLibrary + getIconFolder"
// way that the Web Awesome icon docs show for self-hosted icons.
// A page that is one file (the published docs page) sets window.VSA_ICONS: a map of "<folder>/<name>" to a data URL.

import { getIconFolder, registerIconLibrary } from './vendor/webawesome/webawesome.js';

const iconBase = new URL('./vendor/icons/svgs/', import.meta.url);

registerIconLibrary('default', {
  resolver: (name, family = 'classic', variant = 'solid') => {
    const key = `${getIconFolder(name, family, variant)}/${name}`;
    return window.VSA_ICONS?.[key] ?? new URL(`${key}.svg`, iconBase).href;
  },
  // The same as the Web Awesome default library: an icon file without a fill takes the text color.
  mutator: svg => {
    if (!svg.hasAttribute('fill')) svg.setAttribute('fill', 'currentColor');
  },
});
