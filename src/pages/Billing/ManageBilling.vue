<template>
  <q-page class="manage-billing">
    <div v-if="loading">
      <div class="text-center q-mt-md">
        <q-spinner-oval color="primary" size="10em" />
      </div>
    </div>
    <div v-else>
      <q-card flat bordered class="br-10 q-mt-xl q-pa-lg">
        <div class="heading-one">
          <div class="row justify-between">
            <div class="col">Plan: {{ features.mode }}</div>
            <q-spinner-dots :size="'52px'" v-if="!this.subscription.plan" />
            <div
              class="col q-mr-md heading-two text-right q-mt-md"
              v-if="this.subscription.plan"
            >
              Price:
              {{
                ConvertToDollarPrice(this.subscription?.plan?.amount_decimal) ||
                "$0"
              }}
              / {{ this.subscription?.plan?.interval }}
            </div>
          </div>
        </div>
        <div class="heading-two">Included with your plan:</div>
        <div
          v-for="feature in features.features"
          v-if="subscription != {}"
          class="q-mt-sm q-ml-md"
        >
          <div class="billing-card-feature">&#x2022; {{ feature }}</div>
        </div>
      </q-card>

      <div class="row q-gutter-x-md q-mt-md">
        <div>
          <div
            class="q-pt-sm"
            no-caps
            flat
            style="cursor: not-allowed"
            @click="openPortal()"
          >
            Cancel Subscription
          </div>
        </div>
        <div>
          <q-btn
            class="secondary-button"
            flat
            no-caps
            label="View Invoices"
            @click="openPortal()"
          />
        </div>
        <div>
          <q-btn
            class="secondary-button"
            flat
            no-caps
            label="Change Credit Card"
            @click="openPortal()"
          />
        </div>
        <div>
          <q-btn
            class="primary-button"
            flat
            no-caps
            label="Upgrade subscription"
            v-if="features.mode != 'premium'"
            @click="openPortal()"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { auth } from "src/boot/firebase";
export default {
  name: "ManageBilling",
  data() {
    return {
      user: null,
      subscription: {},
      loading: false,
      plans: {
        lite: {
          ids: {
            monthly: "price_1Mjv8FBtjZHWlE9YyYjH18iF",
            annually: "price_1Mjv8FBtjZHWlE9YgGCcp2Yv",
          },
          features: [
            "Ability to customize areas",
            "Ability to customize username",
            "Ability to create up to 10 areas",
            "Up to 100 appointments/month",
            "Create areas by city name",
            "Create areas by zip code",
            //  "Create areas by map drawing",
          ],
        },
        premium: {
          ids: {
            monthly: "price_1MkgSJBtjZHWlE9YjdJkZlgK",
            annually: "price_1MkgSJBtjZHWlE9YgJHtEItu",
          },
          features: [
            "Unlimited Appointments",
            "Ability to customize areas",
            "Ability to customize username",
            "Create Unlimited Areas",
            "Create areas by city name",
            "Create areas by zip code",
            //  "Create areas by map drawing",
            "SmartSchedule",
          ],
        },
      },
    };
  },
  computed: {
    features() {
      if (
        this.plans.lite.ids.monthly === this.subscription?.plan?.id ||
        this.plans.lite.ids.annually === this.subscription?.plan?.id
      ) {
        return {
          features: this.plans.lite.features,
          mode: "lite",
        };
      } else if (
        this.plans.premium.ids.annually === this.subscription?.plan?.id ||
        this.plans.premium.ids.monthly === this.subscription?.plan?.id
      ) {
        return {
          features: this.plans.premium.features,
          mode: "premium",
        };
      } else {
        return {
          features: [],
          mode: null,
        };
      }
    },
  },
  async created() {
    this.loading = true;
    const { user } = await this.$api.auth.GetUser(auth.currentUser.uid);
    const res = await this.$api.billing.GetSubscription(
      user.subscription.subscription.subscription
    );
    this.user = user;
    this.subscription = { ...res };
    this.loading = false;
  },
  methods: {
    ConvertToDollarPrice(price) {
      return `$${(price / 100).toFixed(2)}`;
    },
    async openPortal() {
      const res = await this.$api.billing.GenerateStripePortal(
        this.user.subscription.subscription.customer
      );
      window.open(res.session.url, "_blank");
    },
  },
};
</script>

<style scoped>
@media (min-width: 960px) {
  .manage-billing {
    margin-left: 10vw;
    margin-right: 10vw;
  }
}
</style>
