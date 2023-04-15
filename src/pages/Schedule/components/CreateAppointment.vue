<template>
  <div>
    <div class="heading-two q-mb-md">Complete Appointment</div>
    <q-input
      v-model="name"
      filled
      dense
      label="Name"
      stack-label
      error-message="Field is required"
      :error="error && name === ''"
    />
    <q-input
      v-model="phoneNumber"
      label="Phone Number"
      filled
      dense
      stack-label
      type="tel"
      error-message="Field is required"
      :error="error && phoneNumber === ''"
    />
    <q-input
      v-model="email"
      label="Email"
      type="email"
      filled
      dense
      stack-label
      :dense="dense"
      :error-message="emailErrorMsg"
      :error="emailError"
      @update:model-value="emailError = false"
    />
    <q-input
      v-model="address"
      label="Address"
      type="text"
      filled
      dense
      stack-label
      :dense="dense"
      error-message="
              Field is required
            "
      :error="error && address === ''"
    />
    <q-input
      clearable
      autogrow
      filled
      dense
      v-model="description"
      :shadow-text="textareaShadowText"
      type="text-area"
      label="Notes"
      stack-label
      :dense="dense"
    />
    <div>
      <q-btn
        class="secondary-button q-mr-md"
        label="back"
        icon="las la-chevron-circle-left"
        no-caps
        flat
        @click="$emit('back')"
      />
      <q-btn
        class="primary-button q-mt-md q-mb-md"
        no-caps
        flat
        :loading="this.btnLoading"
        :disable="this.btnLoading"
        label="Schedule Appointment"
        @click="setAppointment"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "CreateAppointment",
  props: {
    zipcode: {
      type: String,
    },
    date: {
      type: String,
    },
    startTime: {
      type: String,
    },
    duration: {
      type: Object,
    },
    uid: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      username: this.$route.params.username,
      name: "",
      phoneNumber: "",
      email: "",
      address: "",
      description: "",
      error: false,
      emailError: false,
      emailErrorMsg: "",
      btnLoading: false,
    };
  },
  methods: {
    async setAppointment() {
      if (
        this.name === "" ||
        this.phoneNumber === "" ||
        this.address === "" ||
        this.email === ""
      ) {
        if (this.email === "") {
          this.emailError = true;
          this.emailErrorMsg = "Field is required";
        }
        this.error = true;
        return;
      }
      if (!this.$api.utils.emailValidator(this.email)) {
        this.emailError = true;
        this.emailErrorMsg = "Invalid email";
        return;
      }
      this.$q.notify({
        type: "ongoing",
        message: "Scheduling Appointment...",
        timeout: 250,
      });
      this.btnLoading = true;
      const appointment = {
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.email,
        address: this.address,
        description: this.description,
        username: this.username,
        zipcode: this.zipcode,
        date: this.date,
        startTime: this.startTime,
        duration: this.duration,
        uid: this.uid,
        id: this.id,
      };
      const { success, message } =
        await this.$api.appointment.CreateAppointment(appointment, this.uid);
      if (success) {
        this.$q.notify({
          message,
          color: "primary",
          textColor: "white",
          icon: "done",
          position: "top",
        });
      } else {
        this.$q.notify({
          message,
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      }
      this.btnLoading = false;
      this.$emit("finished");
      //check if this schedule has a webhook, if so, send appointment details there
      if (this.schedule?.webhookUrl) {
        await this.$api.appointment.SendWebhook(
          this.schedule.webhookUrl,
          appointment
        );
        window._cio.track("webhook_used", {
          uid: this.schedule.uid,
          id: this.schedule.uid,
          appointment,
          webhookUrl: this.schedule.webhookUrl,
        });
      }
    },
  },
};
</script>
