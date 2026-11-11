// Only for the published claude.ai artifact. vsa/scripts/build-artifact.mjs puts this script into that one file.
// The page has no icon files, and the Content-Security-Policy of the frame blocks fetch() of data: URLs.
// So this script answers two kinds of icon requests without the network:
// - data:image/svg+xml URLs: the Web Awesome system icons.
// - <base path>/icons/svgs/<folder>/<name>.svg: the default icons (decision 0009), from window.VSA_ICONS.
(() => {
  if (window.fetch.vsaIcons) return;
  const nativeFetch = window.fetch.bind(window);
  const svgResponse = svg => Promise.resolve(new Response(svg, { headers: { 'content-type': 'image/svg+xml' } }));
  const decode = url => {
    const comma = url.indexOf(',');
    const data = url.slice(comma + 1);
    if (!url.slice(0, comma).endsWith(';base64')) return decodeURIComponent(data);
    return new TextDecoder().decode(Uint8Array.from(atob(data), c => c.charCodeAt(0)));
  };
  const vsaFetch = (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input?.url;
    if (url?.startsWith('data:image/svg+xml')) return svgResponse(decode(url));
    const icon = url?.match(/\/icons\/svgs\/([a-z0-9-]+\/[a-z0-9-]+)\.svg$/)?.[1];
    if (icon && window.VSA_ICONS?.[icon]) return svgResponse(window.VSA_ICONS[icon]);
    return nativeFetch(input, init);
  };
  vsaFetch.vsaIcons = true;
  window.fetch = vsaFetch;
})();
