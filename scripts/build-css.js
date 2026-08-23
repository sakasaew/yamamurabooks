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
// lightningcss `targets` is set below (NOT left unset): leaving targets unset
// silently drops the `-webkit-backdrop-filter` fallback that Tailwind's
// `.backdrop-blur` utility deliberately emits for Safari. The value comes from the
// browserslist query ('> 0.2%, not dead'), which was verified (property-by-property
// diff against the prior cssnano output, restricted to what's actually used across
// all 9 HTML pages) to be behavior-preserving: it keeps `-webkit-backdrop-filter`
// (still required — Safari's unprefixed multi-value `text-decoration`/
// backdrop-filter support is too recent to drop), keeps `-webkit-text-decoration`
// (needed until Safari 26.2 for the `text-decoration:underline dotted` shorthand
// on the FAQ/notice `abbr` styling — cssnano's pipeline never added this;
// lightningcss's compat data is more complete), and safely drops `-moz-tab-size`
// (unprefixed `tab-size` has shipped since Firefox 91, and no page uses
// `<pre>`/`<code>`/literal tabs anyway). If you change the browserslist query,
// re-diff the output for `-webkit-backdrop-filter` specifically.
//
// The targets object below is hardcoded (pre-computed) rather than resolved from
// browserslist/caniuse-lite on every build: that resolution is ~20-35ms of pure
// per-process overhead for a value that's constant given a fixed query and a fixed
// caniuse-lite version (measured ~5-9% of total build time; A/B verified the CSS
// output is byte-identical either way). To regenerate after updating caniuse-lite
// (`npx update-browserslist-db@latest`) or changing the query, run:
//   node -e "console.log(JSON.stringify(require('lightningcss').browserslistToTargets(require('browserslist')('> 0.2%, not dead'))))"
// (requires `npm install --no-save browserslist` first, since it's not a listed
// dependency — it's only needed for this one-off regeneration step.)
const targets = {"and_chr":9895936,"and_ff":10027008,"chrome":7143424,"edge":9764864,"firefox":7929856,"ios_saf":984576,"op_mob":5242880,"safari":1180928,"samsung":1966080};

const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..');

const postcss = require(path.join(dir, 'node_modules/postcss'));
const tailwindcss = require(path.join(dir, 'node_modules/tailwindcss'));
const lightningcss = require(path.join(dir, 'node_modules/lightningcss'));

const inputFile = path.join(dir, 'assets/tailwind-input.css');
const outputFile = path.join(dir, 'assets/tailwind.css');

// Pass the resolved config *object* (via a plain `require()`) instead of a path
// string. When given `{ config: '<path>' }`, tailwindcss's postcss plugin routes
// through its own `loadConfig()` (lib/lib/load-config.js), which calls into `jiti`
// to transpile+require the config file (via `sucrase`, to support TS/ESM config
// files) — unneeded work for this project's plain CommonJS tailwind.config.js,
// costing ~12ms/build. Note: `jiti`/`sucrase` are required into memory either way
// (tailwindcss's own module graph pulls them in unconditionally at `require('tailwindcss')`
// time); what this change actually skips is *invoking* them — `loadConfig()`'s
// `lazyJiti()(path)` call and the `sucrase.transform()` it triggers — which is where
// the real cost is (V8 compiling+running that transform pipeline, not the `require()`
// itself). Passing an object instead (`resolveConfigPath(pathOrConfig)` returns null
// for a non-`config`-keyed object — see node_modules/tailwindcss/lib/util/resolveConfigPath.js)
// skips `loadConfig()` (and thus that invocation) entirely; this is a documented
// supported call shape (`require('tailwindcss')({ theme: ..., variants: ... })`,
// also reflected in tailwindcss's own type definitions), not an internals hack.
// Content-glob resolution is unaffected: relative-path resolution only special-cases
// a known config *path* when the (unused here) `content.relative`/experimental flag
// is set, so it falls back to cwd-relative either way — same as before.
postcss([
  tailwindcss(require(path.join(dir, 'tailwind.config.js'))),
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
