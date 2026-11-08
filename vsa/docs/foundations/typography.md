# Typography

Body text and controls use Inter. Headings use Doto. Code uses JetBrains Mono.

## Families

```tokens ^--wa-font-family-(body|heading|code)$
```

## Sizes

The VSA sizes are smaller than the Web Awesome defaults. The size `m` is the body size, 14 px. Each size is in `rem` and follows `--wa-font-size-scale`, so the sizes also follow the font size that the user sets in the browser.

```tokens ^--wa-font-size-(2xs|xs|s|m|l|xl|2xl|3xl)$
```

## Weights and line heights

```tokens ^--wa-(font-weight-(body|action|semibold|heading)|line-height-(condensed|normal))$
```
