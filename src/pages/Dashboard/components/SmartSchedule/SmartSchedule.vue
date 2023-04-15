<template>
  <q-card flat bordered class="br-10 text-left">
    <SettingsController v-if="!paywall" />
    <div v-else class="q-pt-lg">
      <div class="q-pb-md text-center">
        <q-btn
          no-caps
          flat
          :loading="loading"
          @click="unlockSmartSchedule"
          :label="
            user?.beta?.smartschedule
              ? 'Reviewing Request'
              : 'Request Early Access'
          "
          :disable="user?.beta?.smartschedule"
          :class="
            user?.beta?.smartschedule ? 'secondary-button' : 'primary-button'
          "
        />
      </div>
      <q-card-section>
        <q-separator inset class="q-mx-lg" />
        <div class="text-center body-text-caption q-mt-md">
          SmartSchedule allows you to "set and forget" your schedule for
          optimized route based appointment scheduling. SmartSchedule will
          automatically add buffer time depending on the distance between
          appointments and your current location to ensure you are on time for
          your next appointment and maximizing your time.
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { auth } from "boot/firebase";
import SettingsController from "./SettingsController.vue";

export default {
  name: "SetupSchedule",
  props: ["paywall", "user"],
  data() {
    return {
      maxNumOfAppointments: 0,
      maxDistanceBetweenAppointments: 0,
      trackTravelDistance: false,
      hasPaidAccount: true,
    };
  },
  methods: {
    async unlockSmartSchedule() {
      this.loading = true;

      window._cio.track("request_beta", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        feature: "smartschedule",
      });

      if (!this.user.beta) this.user.beta = {};

      this.user.beta["smartschedule"] = true;
      Promise.all([
        this.$api.auth.UpdateUser(this.user),
        this.$api.auth.RequestBeta("smartschedule", auth.currentUser.uid),
      ]);

      this.$q.notify({
        type: "positive",
        message: "Request Sent!",
        timeout: 100,
      });
      this.loading = false;

      //TODO  this.$emit("upgrade");
    },
  },
  components: { SettingsController },
};
</script>
