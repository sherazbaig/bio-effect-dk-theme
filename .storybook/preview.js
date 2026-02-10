/**
 * Storybook: Preview
 * -----------------------------------------------------------------------------
 * Configure storybook preview.
 *
 */
import { useArgs } from '@storybook/client-api'
import { app } from '@storybook/vue3'

import * as Canvas from '~/core/canvas-functions'
import EventBus from '~/core/event-bus'
import { focus, reportError, sleep } from '~/core/global-functions'
import Query from '~/core/query'

import breakpoints from '~/config/breakpoints'
import mixin from './assets/storybook-mixin'
import variables from './assets/storybook-variables'

import config from '~/../../canvas.config'

/**
 * Import styles.
 */
import '@/critical/theme.scss'
import '@/layout/theme.scss'
import './assets/storybook-preview.scss'
import './assets/storybook-styleguide.scss'

/**
 * Global Canvas functions.
 */
window.cnvs = window.cnvs || {}
window.cnvs.EventBus = EventBus()
window.cnvs.Query = (query) => Query(query)

window.cnvs.Focus = focus
window.cnvs.ReportError = reportError
window.cnvs.Sleep = sleep

Object.keys(variables).forEach((key) => {
  window.cnvs[key] = variables[key]
})

/**
 * Run Canvas functions.
 */
Canvas.setGlobalComponents(app)
Canvas.setVuePlugins(app)

/**
 * Add custom storybook functionality.
 */
app.use(mixin)

/**
 * Storybook decorators.
 * - updateArgs() function can only be used in decorators so pass it through
 *   a decorator to story context so stories can access it.
 * - References:
 *   https://github.com/storybookjs/storybook/issues/12006#issuecomment-676277112
 *   https://github.com/storybookjs/storybook/issues/15325
 *   https://stackoverflow.com/questions/63708208/how-to-dynamically-mutate-args-in-storybook-v6-from-the-components-action/67424836#67424836
 */
export const decorators = [
  (story, context) => {
    const [_, updateArgs] = useArgs()
    return story({ ...context, updateArgs })
  },
  () => ({ template: '<accessibility /><index /><story />' }),
]

/**
 * Configure breakpoints for available viewports.
 */
const viewports = {}

Object.entries(breakpoints).forEach(([key, value]) => {
  if (value === '0px') {
    return
  }

  let height = '568px'
  const type = config.mobileBreakpoints.includes(key) ? 'mobile' : 'desktop'

  switch (key) {
    case 's':
      height = '720px'
      break
    case 'm':
      height = '1024px'
      break
    case 'l':
      height = '768px'
      break
    case 'xl':
      height = '900px'
      break
  }

  viewports[key] = {
    name: `${type} - ${key.toUpperCase()}`,
    styles: {
      height,
      width: value,
    },
    type,
  }
})

/**
 * Storybook parameters.
 */
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },

  /**
   * Moves required args to top.
   */
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    sort: 'requiredFirst',
  },

  /**
   * Sort roots and stories.
   * - Home and Styleguide root come first.
   * - Primary stories come first.
   * - Alphabetically sort everything else.
   */
  options: {
    storySort: (a, b) => {
      const aRoot = a[0].split('-')[0].toLowerCase()
      const bRoot = b[0].split('-')[0].toLowerCase()

      if (aRoot === 'styleguide') {
        return -1
      }

      if (bRoot === 'styleguide') {
        return 1
      }

      const aStory = a[0].split('--')[1].toLowerCase()
      const bStory = b[0].split('--')[1].toLowerCase()

      if (aStory === 'primary') {
        return -1
      }

      if (bStory === 'primary') {
        return 1
      }

      return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
    },
  },

  /**
   * Use configred viewports.
   */
  viewport: {
    viewports,
  },
}
