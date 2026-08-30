/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: { ink: "#1E2820", soft: "#F2F8F5", brand: "#2D5246", sage: "#D1E4DD" },
      boxShadow: { float: "0 18px 40px rgba(17, 24, 39, 0.12)" },
      fontFamily: { playwrite: ['"Noto Sans JP"', "ui-sans-serif", "system-ui", "sans-serif"] },
    },
  },
  corePlugins: {
    // Color-per-shade plugins not used in any HTML file
    placeholderColor:           false,
    placeholderOpacity:         false,
    caretColor:                 false,
    accentColor:                false,
    fill:                       false, // SVG fills use inline HTML attributes
    stroke:                     false, // SVG strokes use inline HTML attributes
    strokeWidth:                false,

    // Transform utilities not used (parallax uses inline style only)
    translate:                  false,
    skew:                       false,

    // Backdrop-filter sub-plugins (only backdropBlur is used)
    backdropBrightness:         false,
    backdropContrast:           false,
    backdropGrayscale:          false,
    backdropHueRotate:          false,
    backdropInvert:             false,
    backdropOpacity:            false,
    backdropSaturate:           false,
    backdropSepia:              false,

    // Image filter utilities (none used; filter sentinel class also unused)
    filter:                     false,
    blur:                       false,
    brightness:                 false,
    contrast:                   false,
    grayscale:                  false,
    hueRotate:                  false,
    invert:                     false,
    saturate:                   false,
    sepia:                      false,
    dropShadow:                 false,

    // Blend modes not used
    mixBlendMode:               false,
    backgroundBlendMode:        false,
    isolation:                  false,

    // Outline handled entirely in tailwind-input.css custom CSS
    outlineColor:               false,
    outlineOffset:              false,
    outlineStyle:               false,
    outlineWidth:               false,

    // Grid sub-utilities not used (only grid + grid-cols-3 used)
    gridAutoFlow:               false,
    gridAutoColumns:            false,
    gridAutoRows:               false,
    gridTemplateRows:           false,
    gridColumn:                 false,
    gridColumnStart:            false,
    gridColumnEnd:              false,
    gridRow:                    false,
    gridRowStart:               false,
    gridRowEnd:                 false,

    // Table utilities not used
    tableLayout:                false,
    captionSide:                false,
    borderCollapse:             false,
    borderSpacing:              false,

    // Layout utilities not used
    float:                      false,
    clear:                      false,
    breakBefore:                false,
    breakAfter:                 false,
    breakInside:                false,
    columns:                    false,
    boxDecorationBreak:         false,
    aspectRatio:                false,
    contain:                    false,
    boxSizing:                  false,

    // Flexbox sub-utilities not used (flex-1 is from `flex`, not these)
    flexBasis:                  false,
    flexGrow:                   false,

    // Alignment sub-utilities not used
    alignContent:               false,
    justifyItems:               false,
    justifySelf:                false,
    placeContent:               false,
    placeItems:                 false,
    placeSelf:                  false,
    verticalAlign:              false,

    // Size constraints not used
    minHeight:                  false,
    minWidth:                   false,
    maxHeight:                  false,

    // Background sub-plugins not used
    backgroundRepeat:           false,
    backgroundAttachment:       false,
    backgroundClip:             false,
    backgroundOrigin:           false,
    backgroundPosition:         false,
    backgroundSize:             false,

    // Text utilities not used
    textTransform:              false,
    textIndent:                 false,
    textOverflow:               false,
    textWrap:                   false,
    textDecorationColor:        false,
    textDecorationStyle:        false,
    textDecorationThickness:    false,
    fontStyle:                  false,
    hyphens:                    false,
    wordBreak:                  false,

    // Interaction utilities not used
    userSelect:                 false,
    touchAction:                false,
    resize:                     false,
    appearance:                 false,
    pointerEvents:              false,
    overscrollBehavior:         false,
    scrollSnapType:             false,
    scrollSnapAlign:            false,
    scrollSnapStop:             false,
    scrollMargin:               false,
    scrollPadding:              false,
    scrollBehavior:             false,

    // Transition sub-utilities not used
    // (transition-colors/transform come from transitionProperty; duration/delay/ease not overridden)
    transitionDelay:            false,
    transitionDuration:         false,
    transitionTimingFunction:   false,
    transformOrigin:            false,

    // Animation not used (custom @keyframes defined directly in CSS)
    animation:                  false,

    // Misc not used
    fontVariantNumeric:         false,
    visibility:                 false,
    container:                  false, // max-w-6xl mx-auto pattern used instead
    lineClamp:                  false,
    accessibility:              false,
    borderStyle:                false,
    boxShadowColor:             false,
    content:                    false,
    forcedColorAdjust:          false,
    listStyleImage:             false,
    size:                       false,

    // Ring sub-plugins not used (only ring-1 + ring-color used)
    ringOffsetColor:            false,
    ringOffsetWidth:            false,
    ringOpacity:                false,

    // Divide sub-plugins not used (only divide-y + divide-color used)
    divideOpacity:              false,
    divideStyle:                false,

    // Legacy opacity plugins not needed (JIT slash syntax used instead)
    borderOpacity:              false,
    textOpacity:                false,
    backgroundOpacity:          false,
  },
};
