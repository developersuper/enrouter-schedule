<template>
  <q-page class="q-ma-xl">
    <div v-if="loading" class="text-center q-mt-xl">
      <q-spinner-oval color="primary" size="4em" />
    </div>
    <div v-else>
      <q-card flat bordered v-if="schedule?.active" class="popup-card br-10">
        <ZipcodeInput
          v-if="!zipcode"
          @zipcode="setZipcode"
          :availabilities="schedule.availability"
        />
        <CalendarAvailableScheduleDisplay
          v-else
          :availabilities="schedule.availability"
          booking="true"
          :zipcode="zipcode"
          :uid="schedule.uid"
          :id="schedule.id"
          :schedule="schedule"
          :appointments="appointments"
        />
      </q-card>
      <NoScheduleFound error="No schedule found" v-else />
    </div>
  </q-page>
</template>

<script>
import ZipcodeInput from "./components/ZipcodeInput.vue";
import CalendarAvailableScheduleDisplay from "./components/CalendarAvailableScheduleDisplay.vue";
import NoScheduleFound from "./components/NoScheduleFound.vue";

export default {
  name: "Schedule",
  components: {
    ZipcodeInput,
    CalendarAvailableScheduleDisplay,
    NoScheduleFound,
  },

  async created() {
    this.loading = true;
    const { success, schedule } =
      await this.$api.scheduling.GetScheduleByUsername(
        this.$route.params.username
      );
    console.log("schedule", schedule);
    if (!success) {
      this.error = "non-existing-schedule";
    } else {
      this.schedule = {
        ...schedule,
      };
      this.avaliabilities = this.schedule.availability.filter((av) => {
        if (av.zipcodes !== "all" && !av.zipcodes.includes(this.zipcode))
          return false;
        return true;
      });
      const resGetUserApi = await this.$api.auth.GetUser(this.schedule.uid);
      if (resGetUserApi.success) {
        this.plan = resGetUserApi.user?.subscription?.type;
        if (this.plan === undefined) this.plan = "free";
        const resOfGetgAppointmentsApi =
          await this.$api.appointment.GetAppointments(this.schedule.uid);
        if (resOfGetgAppointmentsApi.success) {
          this.appointments = [...resOfGetgAppointmentsApi.appointments];
          if (
            ((this.plan === "free" || this.plan === undefined) &&
              resOfGetgAppointmentsApi.appointments.length >= 10) ||
            (this.plan === "lite" &&
              resOfGetgAppointmentsApi.appointments.length >= 100)
          )
            this.error = "need-upgrade";
        } else {
          this.error = "";
        }
      } else {
        this.error = "non-existing-user";
      }
    }
    this.loading = false;
  },
  data() {
    return {
      plan: "free",
      loading: true,
      zipcode: null,
      username: this.$route.params.username,
      schedule: {},
      error: "",
      availabilities: [],
      appointments: [],
    };
  },
  methods: {
    setZipcode(zipcode) {
      this.zipcode = zipcode;
    },
  },
};
</script>
