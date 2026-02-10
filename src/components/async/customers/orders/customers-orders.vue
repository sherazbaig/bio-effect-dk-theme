<script>

/**
 * Vue: Customers orders (customers-orders)
 * -----------------------------------------------------------------------------
 * Orders page section.
 * - Static section.
 *
 */
export default {
  name: 'CustomersOrders',

  data() {
    return {
      cnvsStatic: true,
    }
  },
}
</script>

<style lang="scss">
@import '~async/customers/cards/order-status';
@import '~async/customers/cards/order-card';
@import '~async/utils/divider-line/divider-line';
@import '@/components/pagination';
@import './customers-orders';
</style>
