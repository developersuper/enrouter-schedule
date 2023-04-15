<template>
  <q-page class="q-pa-xl q-ma-xl">
    <q-card flat bordered class="br-10">
      <q-card-section class="heading-two">Email Verified!</q-card-section>
      <q-btn
        class="primary-button"
        no-caps
        label="Continue to Dashboard"
        to="/"
        flat
      />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "VerifyEmail",
  data() {
    return {};
  },
  async mounted() {
    const uid = this.$route.params.uid;
    const { user } = await this.$api.auth.GetUser(uid);
    await this.$api.auth.VerifyEmail(user.email);
  },
  methods: {},
};
</script>
