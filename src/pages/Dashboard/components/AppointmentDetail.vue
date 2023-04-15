<template>
  <q-card flat bordered class="br-10 popup-card q-pa-lg">
    <div class="heading-two text-center">Appointment Details</div>
    <div>
      <div>Name: {{ appointment.name }}</div>
      <div>Email: {{ appointment.email }}</div>
      <div>Phone Number: {{ appointment.phoneNumber }}</div>
      <div>Address: {{ appointment.address }}</div>
      <div>Date: {{ appointment.date }}</div>
      <div class="row items-center">
        <div v-if="!isEditingStartTime" class="q-mr-md">
          Start time: {{ appointment.startTime }}
        </div>
        <TimePicker
          v-else
          @input="startTime = $event"
          label="Start Time"
          :value="startTime"
        />
        <div v-if="!isEditingStartTime">
          <q-btn
            dense
            size="sm"
            icon="las la-pen"
            flat
            @click="editStartTime"
            style="border-radius: 20px"
          >
            <q-tooltip>Edit start time</q-tooltip></q-btn
          >
        </div>
      </div>
      <div>
        Meeting Duration:
        {{ appointment.duration.label }}
      </div>
      <div>Notes: {{ appointment.description }}</div>
    </div>
    <q-btn
      class="secondary-button q-mt-md q-mr-md text-grey-8"
      no-caps
      flat
      label="Close"
      :disable="loading"
      @click="close"
    />
    <q-btn
      class="primary-button q-mt-md"
      no-caps
      flat
      :loading="loading"
      :disable="loading || startTime === appointment.startTime"
      label="Save"
      @click="save"
    />
  </q-card>
</template>
<script>
import TimePicker from "src/components/shared/TimePicker.vue";
export default {
  name: "AppointmentDetail",
  components: {
    TimePicker,
  },
  props: {
    appointment: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      startTime: this.appointment.startTime,
      isEditingStartTime: false,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    editStartTime() {
      this.isEditingStartTime = true;
    },
    async save() {
      this.loading = true;
      this.$q.notify({
        type: "ongoing",
        message: "Updating Start Time...",
        timeout: 100,
      });
      const { success } =
        await this.$api.appointment.UpdateAppointmentStartTimeById(
          this.startTime,
          this.appointment.id
        );
      this.loading = false;
      if (success) {
        this.$q.notify({
          type: "positive",
          message: "Start time updated successfuly!",
          timeout: 100,
        });
        this.$emit("update", {
          ...this.appointment,
          startTime: this.startTime,
        });
        this.close();
      } else {
        this.$q.notify({
          type: "negative",
          message: "Error",
          timeout: 100,
        });
      }
    },
  },
};
</script>
