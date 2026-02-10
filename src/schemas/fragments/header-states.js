/**
 * Fragment: Header states
 * -----------------------------------------------------------------------------
 * Site header schema fragment.
 * - Include in site header group compatible sections.
 * @param {Boolean} [collapsed] - Set collapsed setting default.
 * @param {Boolean} [minimised] - Set minimised setting default.
 * @returns {Array}
 *
 */
module.exports = ({ collapsed = false, minimised = true } = {}) => {
  const settings = [
    {
      type: 'header',
      content: 'Headers states',
      info: 'For a section to appear correctly in the collapsed/minimised state, all sections below it must also be enabled in the same state, does not take effect in the theme editor',
    },
    {
      type: 'checkbox',
      id: 'collapsed',
      label: 'Display in collapsed state',
      info: 'Collapsed state occurs when scrolling down',
      default: collapsed,
    },
    {
      type: 'checkbox',
      id: 'minimised',
      label: 'Display in minimised state',
      info: 'Minimised state occurs when scrolling back up but before reaching the top',
      default: minimised,
    },
  ]

  return settings
}
