/**
 * Fragment: Social media
 * -----------------------------------------------------------------------------
 * Settings schema fragment.
 * - Add to settings_schema.js to quickly add social media links settings.
 * @param {Array} sites - List of social media site names to generate theme
 * settings for, use Title Case.
 * @returns {Object}
 *
 */
module.exports = (sites = ['Facebook', 'Instagram', 'Twitter']) => {
  const settings = sites.map((site) => {
    const handle = site.toLowerCase().replace(/\s/g, '-')

    return {
      type: 'url',
      id: `social_${handle}_link`,
      label: `${site} link`,
    }
  })

  settings.unshift({
    type: 'paragraph',
    content: 'URLs to social media profiles',
  })

  return {
    name: 'Social Media',
    settings,
  }
}
