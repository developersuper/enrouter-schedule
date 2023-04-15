<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-white text-grey-8"
      style="border-bottom: 2px solid #a8c0ff40"
    >
      <div
        class="text-center q-py-md"
        style="background: #ff000020"
        v-if="!emailVerified"
        data-test-id="verify-email"
      >
        Verify Your Email

        <span class="text-underline q-pl-xs clickable" @click="resendEmail()"
          >Resend Email</span
        >
      </div>
      <div
        class="bg-accent text-center q-py-md"
        v-if="plan != 'premium' && plan"
        data-test-id="upgrade-alert"
      >
        {{
          plan === "lite"
            ? "Upgrade to Premium to optimize your availability with SmartSchedule"
            : "You are on the free plan. A max of 10 appointments can be booked per month"
        }}

        <span
          class="text-underline q-pl-xs clickable"
          @click="sendToUpgrade(plan === 'lite')"
          >Upgrade Now</span
        >
      </div>

      <q-toolbar class="q-pa-md">
        <q-toolbar-title class="q-ml-md clickable" @click="$router.push('/')"
          ><img src="../assets/Logo/logo.svg" height="30"
        /></q-toolbar-title>
        <q-space />
        <q-btn-dropdown
          no-caps
          flat
          class="body-text-small-bold"
          label="Manage account"
          dropdown-icon="las la-chevron-circle-down"
        >
          <q-list>
            <q-item
              dense
              clickable
              v-close-popup
              @click="onProfileClick('billing')"
            >
              <q-item-section>
                <q-item-label>Manage Billing</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              dense
              clickable
              v-close-popup
              @click="onProfileClick('support')"
            >
              <q-item-section>
                <q-item-label>Support</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              dense
              clickable
              v-close-popup
              @click="onProfileClick('logout')"
            >
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <q-dialog v-model="showPlans">
        <PlanDisplay
          :upgrade="upgrade"
          class="q-pa-lg"
          @close="showPlans = false"
        />
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import PlanDisplay from "src/pages/Billing/PlanDisplay.vue";
import { auth } from "boot/firebase";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "MainLayout",
  components: { PlanDisplay },
  setup() {
    const $store = useStore();

    const plan = computed({
      get: () => $store.state.user.plan,
      set: (val) => {
        $store.commit("user/updatePlan", val);
      },
    });
    const user = computed({
      get: () => $store.state.user.user,
      set: (val) => {
        $store.commit("user/updateUser", val);
      },
    });

    return {
      plan,
      user,
    };
  },
  data() {
    return {
      upgrade: false,
      subscription: {},
      showPlans: false,
      emailVerified: true,
    };
  },
  async created() {
    const uid = auth.currentUser.uid;
    const res = await this.$api.auth.GetUser(uid);
    this.emailVerified = auth.currentUser.emailVerified;
    if (res.user?.subscription?.subscription === undefined) {
      this.plan = "free";
      return;
    }
    const { success, plan } = await this.$api.billing.ReturnUsersSubscription(
      res.user?.subscription?.subscription
    );
    if (success) this.plan = plan;

    this.subscription = {
      success: success,
      plan,
    };

    this.user = res.user;
  },
  mounted() {
    if (auth?.currentUser?.uid === undefined) this.$router.push("/");
    // console.log("plan", this.plan);
    // console.log("mounted", auth.currentUser);
    this.plan = "free";
  },
  methods: {
    async onProfileClick(param) {
      if (param === "billing") {
        const { success, user } = await this.$api.auth.GetUser(
          auth.currentUser.uid
        );
        if (!success) {
          return this.$q.notify({
            message: "Something went wrong",
            color: "negative",
            position: "top",
          });
        }
        if (user?.subscription === undefined) {
          return (this.showPlans = true);
        }
        this.$router.push("/billing");
      }
      if (param === "support")
        return window.open("https://prorouting.ai/contact", "_blank");
      if (param == "logout") {
        await auth.signOut();
        localStorage.removeItem("user");
        this.$router.push("/auth/login");
      }
    },
    sendToUpgrade(isLite) {
      if (isLite) this.upgrade = true;

      window._cio.track("header_upgrade", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      });
      this.showPlans = true;
    },
    async resendEmail() {
      const { email, uid } = auth.currentUser;
      await this.$api.auth.SendEmail(email, null, uid, "create_account");
      this.$q.notify({
        message: "Verification email sent",
        color: "positive",
        position: "top",
      });
    },
  },
};
</script>
