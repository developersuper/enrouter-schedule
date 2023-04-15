<template>
  <q-card flat bordered class="popup-card br-10">
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

    <div class="q-gutter-md q-mt-lg row justify-center">
      <q-card flat bordered class="br-10 q-pa-md plan-card" v-if="!upgrade">
        <q-card-section class="billing-card-header">
          <div class="billing-card-title">Lite</div>
          <div class="billing-card-price">
            {{ mode === "monthly" ? "$9/mo" : "$72/yr" }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="billing-card-feature">
            &#x2022; Ability to customize username
          </div>
          <div class="billing-card-feature">
            &#x2022; Ability to customize areas
          </div>
          <div class="billing-card-feature">
            &#x2022; Up to 100 bookings/month
          </div>
          <div class="billing-card-feature">&#x2022; Create up to 10 areas</div>
          <div class="billing-card-feature">
            &#x2022; Create areas by city name
          </div>
          <div class="billing-card-feature">
            &#x2022; Create areas by zip code
          </div>
          <div class="billing-card-feature">&#x2022; Turn on your link</div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            class="primary-button"
            no-caps
            flat
            :disable="loading"
            :loading="loading"
            label="Select Plan"
            @click="selectPlan('lite')"
          />
        </q-card-actions>
      </q-card>

      <q-card flat bordered class="br-10 q-pa-md plan-card">
        <q-card-section class="billing-card-header">
          <div class="billing-card-title">Premium</div>

          <div class="billing-card-price">
            {{ mode === "monthly" ? "$15/mo" : "$120/yr" }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="billing-card-feature">
            &#x2022; Ability to customize username
          </div>
          <div class="billing-card-feature">
            &#x2022; Ability to customize areas
          </div>
          <div class="billing-card-feature text-bold">
            &#x2022; Unlimited bookings
          </div>

          <div class="billing-card-feature text-bold">
            &#x2022; Create unlimited areas
          </div>
          <!--  <div class="billing-card-feature text-bold">
            &#x2022; View your schedule in a map
          </div>-->
          <div class="billing-card-feature">
            &#x2022; Create areas by city name
          </div>
          <div class="billing-card-feature">
            &#x2022; Create areas by zip code
          </div>
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
    </div>
    <div class="text-center q-mt-md clickable" @click="$emit('close')">
      no thanks
    </div>
  </q-card>
</template>

<script>
import { auth } from "boot/firebase";
export default {
  name: "BillingPage",
  props: ["upgrade"],
  data() {
    return {
      mode: "monthly", // monthly, annually
      loading: false,
    };
  },
  methods: {
    async selectPlan(plan) {
      this.loading = true;

      if (this.upgrade) {
        const { user } = await this.$api.auth.GetUser(auth.currentUser.uid);
        //upgrade user immediately
        const upgrade = await this.$api.billing.UpdateSubscription(
          user.subscription.subscription.subscription,
          plan,
          this.mode
        );
        this.$q.notify({
          type: "positive",
          message: "Successfully upgraded your plan!",
          timeout: 100,
        });
        return this.$emit("close");
      }

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

<style>
.billing-card {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.billing-card-header {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.billing-card-title {
  font-size: 24px;
  margin-bottom: 8px;
  text-transform: none;
}

.billing-card-price {
  font-size: 30px;
}

.billing-card-feature {
  font-size: 14px;
  margin-bottom: 8px;
}

.ai {
  background: #006bff20;
  border-radius: 20px;
  color: #006bff;
  padding: 2px 8px;
  font-size: 14px;
  margin-left: 10px;
}

.plan-card {
  width: 300px;
}
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
