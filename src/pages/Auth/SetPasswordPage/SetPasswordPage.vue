<template>
  <q-page class="q-pt-xl">
    <q-card flat bordered class="popup-card br-10 q-mx-xl q-px-xl">
      <q-card-section>
        <div class="heading-two text-center">Set Password</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { BASE_URL } from "src/config/config";

export default {
  name: "SetPasswordPage",
  data() {
    return {
      uid: this.$route.params.uid,
    };
  },
  methods: {
    async setPassword() {
      const user = await this.$api.auth.GetUser();

      await axios.post(`${BASE_URL}/email/send`, {
        type: "welcome_email",
        data: {
          ...user,
        },
      });
    },
  },
};
</script>
