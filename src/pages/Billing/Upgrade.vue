<template>
  <q-card flat bordered class="br-10 q-pa-xl popup-card">
    <q-card-section class="q-pb-sm">
      <div class="heading-two text-center">Unlock SmartSchedule now</div>
    </q-card-section>
    <q-card-section>
      <div class="frequency-selector text-center">
        <q-btn
          @click="mode = 'monthly'"
          flat
          no-caps
          label="Monthly"
          class="left-btn body-text-small-bold"
          :class="mode === 'monthly' ? 'active-plan' : 'disabled-plan'"
        />
        <q-btn
          @click="mode = 'annually'"
          flat
          no-caps
          label="Annually"
          class="right-btn body-text-small-bold"
          :class="mode === 'annually' ? 'active-plan' : 'disabled-plan'"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-center body-text-caption">
        SmartSchedule allows you to "set and forget" your schedule for optimized
        route based appointment scheduling. SmartSchedule will automatically add
        buffer time depending on the distance between appointments and your
        current location to ensure you are on time for your next appointment and
        maximizing your time.
      </div>
    </q-card-section>
    <q-card-section class="text-center"
      ><center>
        <q-card flat bordered class="br-10 q-pa-md plan-card text-left">
          <q-card-section class="billing-card-header">
            <div class="billing-card-title">Premium</div>

            <div class="billing-card-price">
              {{ mode === "monthly" ? "$15/mo" : "$120/yr" }}
            </div>
          </q-card-section>

          <q-card-section>
            <div class="billing-card-feature">&#x2022; Unlimited bookings</div>
            <div class="billing-card-feature">
              &#x2022; Create unlimited areas
            </div>
            <div class="billing-card-feature">
              &#x2022; View your schedule in a map
            </div>
            <div class="billing-card-feature">
              &#x2022; Create areas by city name
            </div>
            <div class="billing-card-feature">
              &#x2022; Create areas by zip code
            </div>
            <div class="billing-card-feature">
              &#x2022; Create areas by map drawing
            </div>
            <div class="billing-card-feature">&#x2022; Turn on your link</div>
            <div class="billing-card-feature">
              &#x2022;
              <span class="text-underline clickable">SmartSchedule</span>
              <span class="ai">AI</span>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              class="primary-button"
              no-caps
              flat
              :loading="loading"
              :disable="loading"
              label="Select Plan"
              @click="selectPlan('premium')"
            />
          </q-card-actions>
        </q-card>
      </center>
    </q-card-section>
    <q-card-section>
      <div class="text-center q-mt-md clickable" @click="$emit('close')">
        no thanks
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { auth } from "src/boot/firebase";

export default {
  name: "Upgrade",
  data() {
    return {
      mode: "monthly",
      loading: false,
    };
  },
  methods: {
    async selectPlan(plan) {
      this.loading = true;

      this.$q.notify({
        type: "ongoing",
        message: "Generating checkout link...",
        timeout: 100,
      });

      try {
        const email = auth.currentUser.email;
        const { url } = await this.$api.billing.CreateStripeCheckout(
          email,
          plan,
          this.mode
        );
        window.open(url, "_blank");
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.active-plan {
  background: #006bff;
  color: white;
}

.disabled-plan {
  background: #a8c0ff20;
  color: grey;
  border: 1px solid 006BFF;
  font-weight: 500;
}
.right-btn {
  border-radius: 0px 20px 20px 0px;
}
.left-btn {
  border-radius: 20px 0px 0px 20px;
}
</style>
