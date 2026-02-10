/**
 * Storybook: Manager
 * -----------------------------------------------------------------------------
 * Configure storybook UI.
 *
 */
import { addons } from '@storybook/addons'
import { SET_STORIES } from '@storybook/core-events'

import favicon from '@we-make-websites/canvas-storybook-tools/canvas-storybook-tools/assets/storybook-favicon.png'
import theme from '@we-make-websites/canvas-storybook-tools/canvas-storybook-tools/assets/storybook-theme'

/**
 * Change favicon.
 */
const link = document.createElement('link')
link.setAttribute('href', favicon)
link.setAttribute('rel', 'icon')
link.setAttribute('sizes', '196x196')
link.setAttribute('type', 'image/png')
document.head.appendChild(link)

/**
 * Set custom theme.
 */
addons.setConfig({
  sidebar: {
    showRoots: true,
  },
  theme,
  toolbar: {
    copy: { hidden: true },
    eject: { hidden: true },
  },
})

/**
 * Display introduction on startup.
 * - https://storybook.js.org/docs/react/addons/addons-api#storybook-api
 * - https://github.com/storybookjs/storybook/issues/7720#issuecomment-522692117
 */
addons.register('we-make-websites/open-introduction', (api) => {
  api.on(SET_STORIES, () => {

    /**
     * Don't switch to introduction if page is set in parameters and Storybook
     * is locally hosted (not statically built).
     * - Statically built Storybook cannot programmatically select stories other
     *   than the pages in storybook folder.
     * - api.selectStory() works when globally available but doesn't work inside
     *   this SET_STORIES event for some reason?
     */
    if (
      location.hostname === 'localhost' &&
      location.search &&
      location.search.includes('/story/')
    ) {
      return
    }

    api.selectStory('introduction--page')
  })
})
