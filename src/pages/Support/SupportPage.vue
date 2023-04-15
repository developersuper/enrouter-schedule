<template>
  <q-page class="q-pa-xl">
    <center>
      <q-card flat bordered class="br-10 text-center support-card">
        <q-icon name="las la-headset" size="5rem" class="q-mt-md" />
        <q-card-section class="heading-one"> Help Desk </q-card-section>
        <q-card-section class="body-text-small-bold">
          What do you need help with?
        </q-card-section>
        <q-card-section class="q-mx-xl search-input">
          <q-input filled dense v-model="search" label="Search" />
        </q-card-section>
        <q-card-section class="top-articles">{{ articles }}</q-card-section>
      </q-card>
    </center>
  </q-page>
</template>

<script>
export default {
  name: "SupportPage",
  data() {
    return {
      search: "",
      articles: [],
    };
  },
  async created() {
    this.articles = await this.$api.support.GetHelpArticles();
  },
};
</script>

<style>
.support-card {
  width: 70%;
}
@media screen and (max-width: 600px) {
  .support-card {
    width: 100%;
  }
}
</style>
