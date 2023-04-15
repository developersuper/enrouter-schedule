<template>
  <q-card flat bordered class="popup-card q-ma-xl q-pa-xl"
    >Checkout {{ success }}
    <div class="q-mt-md">
      <q-btn
        class="primary-button"
        flat
        no-caps
        label="Go to Dashboard"
        @click="() => this.$router.push('/')"
      /></div
  ></q-card>
</template>

<script>
export default {
  name: "CheckoutStatus",
  async mounted() {
    // if (this.$route.params.success) {
    //   localStorage.setItem("membership", this.$route.params.plan);
    // }
  },
  data() {
    return {
      success: this.$route.params.status,
    };
  },
};
</script>
