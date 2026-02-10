<template>
  <customers-addresses />
</template>

<script>

/**
 * Vue: Customers account (customers-account)
 * -----------------------------------------------------------------------------
 * Account overview page section.
 * - Static section.
 *
 */

import Accordion from '~/components/accordion'
import Tabs from '~/components/tabs'
import RecentlyViewed from '~/components/recently-viewed'
import CustomersAddresses
  from '~async/customers/addresses/customers-addresses.vue'

export default {
  name: 'CustomersAccount',
  components: { CustomersAddresses },

  mounted() {
    Accordion().init()
    Tabs().init()
    RecentlyViewed().init()
  },
}
</script>

<style lang="scss">
@import '~async/customers/addresses/address-block';
@import '~async/customers/cards/order-card';
@import '~async/customers/cards/order-status';
@import '~async/customers/cards/item-card';
@import './customers-account';
@import './recently-viewed';
@import '../addresses/customers-addresses';
@import '../addresses/address-block';
</style>
