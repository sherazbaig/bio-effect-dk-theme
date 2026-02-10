<script>

/**
 * Vue: Customers order (customers-order)
 * -----------------------------------------------------------------------------
 * Single order page section.
 * - Static section.
 *
 */
export default {
  name: 'CustomersOrder',

  data() {
    return {
      cnvsStatic: true,
    }
  },
}
</script>

<style lang="scss">
@import '~async/utils/notification-panel/notification-panel';
@import '~async/customers/cards/item-card';
@import '~async/customers/cards/order-status';
@import '~async/utils/divider-line/divider-line';
@import './customers-order';
</style>
