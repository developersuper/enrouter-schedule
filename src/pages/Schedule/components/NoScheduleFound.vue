<template>
  <q-card flat bordered class="q-pa-xl text-center heading-two q-mt-xl">
    <div>
      <q-icon name="las la-exclamation-circle" size="4em" color="alert" />
    </div>
    <div class="q-mt-md">
      {{ error }}
      <div class="fixed-bottom q-mb-md" style="font-size: 16px">
        Create your own location-based schedule at
        <span class="text-primary clickable" @click="openWebsite()">
          <strong>ProRouting.ai</strong>
        </span>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: "NoScheduleFound",
  props: {
    error: {
      type: String,
    },
  },
  methods: {
    openWebsite() {
      window.open("https://prorouting.ai", "_blank");
    },
  },
};
</script>
