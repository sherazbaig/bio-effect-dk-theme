<template>
  <div class="site-footer critical-component-clear">
    <div class="site-footer__top-container mb-3xl">
      <div class="container grid site-footer__grid">
        <div class="site-footer__content-cell col xs6 l10">
          <h3
            v-if="liquid.newsletterFormTitle"
            class="
              site-footer__newsletter-title
              text-mobile-titles
              text-h2-desktop
            "
            v-text="liquid.newsletterFormTitle"
          />

          <div
            v-if="liquid.enableNewsletterForm"
            class="site-footer__newsletter"
          >
            <newsletter-form
              block-class="site-footer"
              :list="liquid.newsletterListId"
            />
          </div>
        </div>
        <div class="site-footer__content-cell site-footer__social-cell col xs6 l4">
          <p
            v-if="liquid.socialMediaTitle"
            class="site-footer__impact-text"
            v-text="liquid.socialMediaTitle"
          />

          <div
            v-if="liquid.showSocialMediaIcons"
            class="site-footer__social"
            v-html="liquid.socialIcons"
          />
        </div>
      </div>
    </div>

    <div class="site-footer__middle-container">
      <div class="grid site-footer__grid">
        <div class="site-footer__content-cell col xs6 l7">
          <a
            v-if="liquid.image"
            class="site-footer__logo"
            :href="$variable('routes.root')"
            :aria-label="$string('general.site_footer.return_home')"
          >
            <responsive-image
              :image="liquid.image"
              :alt="liquid.image.alt || `${$string('accessibility.bioeffect_logo')}`"
              :padding="false"
            />
          </a>

          <div
            v-if="liquid.subtext"
            class="site-footer__subtext"
            v-html="liquid.subtext"
          />
        </div>

        <div class="site-footer__content-cell col xs6 l7">
          <div
            class="site-footer__nav"
            v-html="liquid.linkLists"
          />
        </div>
      </div>
    </div>

    <div class="site-footer__bottom-container">
      <div class="container grid site-footer__grid">
        <div class="site-footer__content-cell col xs6 l14">
          <p
            class="site-footer__copyright text-p-small"
            v-html="liquid.copyright"
          />
        </div>
        <div class="site-footer__content-cell col xs6 l14">
          <div
            v-if="liquid.disclaimerText"
            class="site-footer__disclaimer-text text-p-small"
            v-html="liquid.disclaimerText"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Vue: Site footer (site-footer-group)
 * -----------------------------------------------------------------------------
 * Site footer component with accordion display of links.
 *
 * @param {Object} liquid - Liquid data including strings, arrays and captured
 * content.
 */
import NewsletterForm from '~async/newsletter-form/newsletter-form'
import ResponsiveImage from '~global/images/responsive-image.vue'

export default {
  name: 'SiteFooter',

  components: {
    NewsletterForm,
    ResponsiveImage,
  },

  props: {
    liquid: {
      type: Object,
      default: () => ({
        image: '',
        subtext: '',
        disclaimerText: '',
        showSocialMediaIcons: '',
        socialMediaTitle: '',
        socialIcons: '',
        enableNewsletterForm: '',
        newsletterListId: '',
        newsletterFormTitle: '',
        linkLists: '',
        copyright: '',
      }),
    },
  },
}
</script>

<style lang="scss">
@import './site-footer';
</style>
