#!/usr/bin/env node
'use strict';

// Direct PostCSS build script — bypasses tailwind CLI argv-parsing overhead.
// Minification is done by lightningcss (native Rust binary) instead of cssnano:
// measured ~39% faster than cssnano for the minify step (751ms -> 452ms avg over
// two independent interleaved 20-run A/B benchmarks), with a ~2.5% smaller output
// (17,428 -> 16,998 bytes) as a side effect.
//
// autoprefixer is intentionally omitted: every prefix it was adding targets browsers
// dead before 2019 (-o-*, old -moz-placeholder). The vendor-prefixed properties in
// the output come from Tailwind's own preflight/corePlugins plus lightningcss's
// `targets`-driven prefixing below, and are unaffected by autoprefixer's removal.
// WARNING: autoprefixer is no longer in the pipeline. If you add custom CSS or
// re-enable Tailwind plugins for: appearance, background-clip, mask-*, user-select,
// text-emphasis-*, or column-* — manually add the required -webkit-/-moz- prefixes,
// or temporarily re-add autoprefixer to verify coverage.
//
// lightningcss `targets` is set from the browserslist query below (NOT left unset):
// leaving targets unset silently drops the `-webkit-backdrop-filter` fallback that
// Tailwind's `.backdrop-blur` utility deliberately emits for Safari. The chosen
// query ('> 0.2%, not dead') was verified (property-by-property diff against the
// prior cssnano output, restricted to what's actually used across all 9 HTML pages)
// to be behavior-preserving: it keeps `-webkit-backdrop-filter` (still required —
// Safari's unprefixed multi-value `text-decoration`/backdrop-filter support is too
// recent to drop), keeps `-webkit-text-decoration` (needed until Safari 26.2 for the
// `text-decoration:underline dotted` shorthand on the FAQ/notice `abbr` styling —
// cssnano's pipeline never added this; lightningcss's compat data is more complete),
// and safely drops `-moz-tab-size` (unprefixed `tab-size` has shipped since Firefox
// 91, and no page uses `<pre>`/`<code>`/literal tabs anyway). If you change the
// browserslist query, re-diff the output for `-webkit-backdrop-filter` specifically.

const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..');

const postcss = require(path.join(dir, 'node_modules/postcss'));
const tailwindcss = require(path.join(dir, 'node_modules/tailwindcss'));
const lightningcss = require(path.join(dir, 'node_modules/lightningcss'));
const browserslist = require(path.join(dir, 'node_modules/browserslist'));

const targets = lightningcss.browserslistToTargets(browserslist('> 0.2%, not dead'));

const inputFile = path.join(dir, 'assets/tailwind-input.css');
const outputFile = path.join(dir, 'assets/tailwind.css');

postcss([
  tailwindcss({ config: path.join(dir, 'tailwind.config.js') }),
])
  .process(fs.readFileSync(inputFile, 'utf8'), { from: inputFile, to: outputFile })
  .then(result => {
    const { code } = lightningcss.transform({
      filename: outputFile,
      code: Buffer.from(result.css),
      minify: true,
      targets,
    });
    fs.writeFileSync(outputFile, code);
    process.stdout.write('Done\n');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
