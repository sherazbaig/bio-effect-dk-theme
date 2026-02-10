/**
 * Helper / SVGO plugins
 * -----------------------------------------------------------------------------
 * SVGO Plugin configuration, used to optimise SVG icons using icons command.
 * - Documentation https://github.com/svg/svgo
 *
 */
module.exports = [

  /**
   * Use default plugins.
   */
  'preset-default',

  /**
   * Add custom plugins.
   */
  'convertStyleToAttrs',
  'removeDimensions',

  /**
   * Add custom plugins with parameters.
   */
  {
    name: 'removeAttributesBySelector',
    params: {
      selector: '[fill="#000"]',
      attributes: 'fill',
    },
  },
  {
    name: 'removeAttributesBySelector',
    params: {
      selector: 'svg[fill="none"]',
      attributes: 'fill',
    },
  },
  {
    name: 'sortAttrs',
    params: {
      order: [
        'id',
        'class',
        'cx',
        'cy',
        'd',
        'fill',
        'height',
        'marker',
        'points',
        'r',
        'stroke',
        'viewBox',
        'width',
        'x',
        'x1',
        'x2',
        'y',
        'y1',
        'y2',
      ],
      xmlnsOrder: 'alphabetical',
    },
  },
]
