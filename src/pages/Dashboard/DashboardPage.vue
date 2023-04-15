<template>
  <q-page>
    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner-oval color="primary" size="4em" />
    </div>
    <div v-else>
      <div class="container" v-if="!showSchedulePage">
        <div class="panels">
          <div class="left-panel q-pa-md q-ml-lg">
            <div>
              <div class="row justify-between">
                <span class="heading-one">Schedule</span>

                <div class="row">
                  <div
                    class="row q-mt-sm q-pt-xs q-gutter-x-sm q-mr-md"
                    v-if="isScheduleExist"
                  >
                    <div>
                      <q-btn
                        dense
                        size="sm"
                        icon="las la-pen"
                        flat
                        @click="editSchedule"
                        style="border-radius: 20px"
                      >
                        <q-tooltip>Edit your schedule</q-tooltip></q-btn
                      >
                    </div>

                    <div>
                      <q-btn
                        size="sm"
                        icon="las la-link"
                        dense
                        flat
                        style="border-radius: 20px"
                        @click="copyLink(`https://omw.li/${schedule.username}`)"
                      >
                        <q-tooltip> View link </q-tooltip>
                      </q-btn>
                    </div>
                    <div>
                      <q-btn
                        size="sm"
                        icon="las la-cog"
                        dense
                        flat
                        @click="showScheduleSettings = true"
                      >
                        <q-tooltip> Settings </q-tooltip>
                      </q-btn>
                    </div>
                  </div>

                  <div class="q-gutter-x-md row">
                    <q-btn
                      :class="
                        schedule?.active
                          ? 'bg-red text-white secondary-button'
                          : 'primary-button'
                      "
                      :loading="loading"
                      :label="schedule?.active ? 'Turn Off' : 'Turn On'"
                      no-caps
                      flat
                      @click="ToggleSchedule"
                      v-if="isScheduleExist"
                    />
                    <q-btn
                      v-else
                      class="primary-button"
                      label="Setup Schedule"
                      no-caps
                      flat
                      @click="createNewSchedule"
                    />
                  </div>
                </div>
              </div>

              <div>
                <AppointmentTable
                  :appointments="appointments"
                  @select="selectAppointment"
                />
              </div>
              <div>
                <div class="heading-one q-mt-lg">Calendar</div>
                <div class="body-text-caption q-mb-md">
                  Click on a day to view that days appointments
                </div>
                <q-card flat bordered class="br-10">
                  <CalendarScheduleDisplay
                    :schedule="appointments"
                    @select="selectAppointment"
                  />
                </q-card>
              </div>
            </div>
          </div>
          <div class="right-panel text-center">
            <div class="heading-one q-mt-md">SmartSchedule</div>

            <div class="q-mx-xl q-mt-md">
              <SmartSchedule
                :paywall="user?.subscription?.type != 'premium'"
                :user="user"
                @upgrade="setShowUpgrade"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="q-pa-xl">
          <SetupSchedule
            :schedule="schedule"
            :user="user"
            @submit-schedule="submitSchedule"
            @upgrade="setShowUpgrade()"
            @close="closeSchedulePage"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="showScheduleSettings">
      <ScheduleSettings
        @close="showScheduleSettings = false"
        :username="schedule.username"
        @update="updateUsername"
        :schedule="schedule"
        :plan="plan"
      />
    </q-dialog>

    <q-dialog v-model="showPlanSelection">
      <PlanDisplay @close="showPlanSelection = false" />
    </q-dialog>
    <q-dialog v-model="showUpgradeOption">
      <Upgrade @close="showUpgradeOption = false" />
    </q-dialog>
    <q-dialog v-model="isSelectedAppointment">
      <AppointmentDetail
        :appointment="selectedAppointment"
        @close="isSelectedAppointment = false"
        @update="updateAppointment"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";
import CalendarScheduleDisplay from "./components/CalendarScheduleDisplay.vue";
import AppointmentTable from "./components/AppointmentTable.vue";
import SetupSchedule from "./components/SetupSchedule.vue";
import Upgrade from "../Billing/Upgrade.vue";

import { auth } from "src/boot/firebase";
import PlanDisplay from "../Billing/PlanDisplay.vue";
import SmartSchedule from "./components/SmartSchedule/SmartSchedule.vue";
import ScheduleSettings from "./components/ScheduleSettings.vue";
import AppointmentDetail from "./components/AppointmentDetail.vue";

export default {
  name: "Dashboard",
  components: {
    AppointmentTable,
    SetupSchedule,
    CalendarScheduleDisplay,
    PlanDisplay,
    SmartSchedule,
    Upgrade,
    ScheduleSettings,
    AppointmentDetail,
  },
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
      loading: false,
      setupScheduleBtnLoading: true,
      isScheduleExist: false,
      showSchedulePage: false,
      showPlanSelection: false,
      showUpgradeOption: false,
      editUsername: false,
      showScheduleSettings: false,
      appointments: [],
      hasSchedule: false,
      schedule: {},
      selectedDate: "",
      username: "",
      selectedAppointment: null,
      isSelectedAppointment: false,
    };
  },

  async created() {
    this.loading = true;

    if (this.$route.query.onboarding) {
      this.showSchedulePage = true;
    }

    try {
      window._cio.identify({
        id: uid,
        ...this.user,
      });
    } catch (e) {
      console.log(e);
    }
    await this.getSchedule();
    const { success, appointments } =
      await this.$api.appointment.GetAppointments(auth.currentUser.uid);
    if (success) {
      this.appointments = [...appointments];
    }
    this.loading = false;
  },
  methods: {
    updateAppointment(updated) {
      this.appointments = this.appointments.filter(
        (ap) => ap.id !== this.selectedAppointment.id
      );
      this.appointments.push(updated);
    },
    selectAppointment(value) {
      this.selectedAppointment = value;
      this.isSelectedAppointment = true;
    },
    async getSchedule() {
      console.log(auth.currentUser);
      const uid = auth.currentUser.uid;
      this.setupScheduleBtnLoading = true;
      const { success, message, schedule } =
        await this.$api.scheduling.GetSchedule(uid);
      if (!success) {
        if ((message === "No schedule exists", uid)) {
        } else {
          //some fatal error occured
        }
      } else {
        if (schedule) {
          this.isScheduleExist = true;
          this.schedule = { ...schedule };
          this.username = schedule.username;
        }
      }
      this.setupScheduleBtnLoading = false;
    },
    copyLink(value) {
      navigator.clipboard.writeText(value);
      this.$q.notify({
        type: "positive",
        message: "Copied to clipboard",
        timeout: 100,
      });
    },

    editSchedule() {
      this.showSchedulePage = true;
    },
    closeSchedulePage() {
      this.showSchedulePage = false;
    },
    async createNewSchedule() {
      this.showSchedulePage = true;
    },
    async updateUsername(username) {
      await this.$api.scheduling.SaveUsername(username, this.schedule.id);
    },
    async submitSchedule(schedule) {
      //should update the schedule if one exists
      this.loading = true;
      try {
        if (this.isScheduleExist) {
          this.$q.notify({
            type: "ongoing",
            message: "Updating Schedule...",
            timeout: 100,
          });
          const { success, data } = await this.$api.scheduling.UpdateSchedule({
            ...schedule,
          });
          if (success) this.schedule = { ...data };
        } else {
          this.$q.notify({
            type: "ongoing",
            message: "Creating Schedule...",
            timeout: 100,
          });
          await this.$api.scheduling.InitSchedule({
            ...schedule,
            uid: auth.currentUser.uid,
          });
          await this.getSchedule();
        }
      } catch (e) {
        console.log("error", e);
        this.$q.notify({
          type: "negative",
          message: "Error",
          timeout: 100,
        });
      }

      this.showSchedulePage = false;

      this.showSetupSchedule = false;
      this.hasSchedule = true;
      this.loading = false;
    },
    async setEditSchedule() {
      window._cio.track("manage_schedule", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      });
    },
    async requestBeta() {
      this.loading = true;

      window._cio.track("request_beta", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        feature: "analytics",
      });

      this.user.beta["analytics"] = true;
      await this.$api.auth.RequestBeta("analytics", auth.currentUser.uid);

      this.$q.notify({
        type: "positive",
        message: "Request Sent!",
        timeout: 100,
      });
    },
    setShowUpgrade() {
      this.showUpgradeOption = true;
      window._cio.track("unlock_smartschedule", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      });
    },
    async ToggleSchedule() {
      this.schedule.active = !this.schedule.active;
      this.loading = true;
      try {
        await this.$api.scheduling.UpdateSchedule({
          ...this.schedule,
        });
      } catch (e) {
        this.schedule.active = !this.schedule.active;
      }
      window._cio.track("toggle_schedule", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        active: this.schedule.active,
      });
      this.loading = false;
    },

    async SaveUsername() {
      this.loading = true;
      if (this.username === this.schedule?.username) {
        this.loading = false;
        this.editUsername = false;
        return;
      }

      this.$q.notify({
        type: "ongoing",
        message: "Checking if username is taken",
        timeout: 100,
      });

      console.log("do save username", this.username);
      const { success, message } = await this.$api.scheduling.SaveUsername(
        this.username,
        this.schedule.id
      );

      if (!success) {
        this.username = "";
      } else {
        this.schedule.username = this.username;
      }

      this.loading = false;
      this.editUsername = false;

      if (success) {
        window._cio.track("changed_username", {
          id: auth.currentUser.uid,
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          username: this.username,
        });
      }

      return this.$q.notify({
        type: success ? "positive" : "negative",
        message: message,
        timeout: 500,
      });
    },
    setEditUsername() {
      this.editUsername = true;
      window._cio.track("change_username", {
        id: auth.currentUser.uid,
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
      });
    },
  },
  computed: {},
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.panels {
  display: flex;
  flex-direction: column;
}

.left-panel {
  width: 100%;
}

.right-panel {
  width: 100%;
  border-left: none;
  height: auto;
  padding-right: 0;
}

@media (min-width: 600px) {
  .panels {
    flex-direction: row;
  }

  .left-panel {
    width: 60%;
  }

  .right-panel {
    width: 40%;
    border-left: 2px solid #f4f6fa;
    height: 100vh;
  }
  .w-100 {
    width: 100%;
  }
}
</style>
