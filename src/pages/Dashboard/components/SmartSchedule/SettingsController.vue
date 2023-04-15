<template>
  <div>
    <q-card-section class="q-gutter-y-md">
      <q-input
        v-model="maxNumOfAppointments"
        label="Number of Appointments"
        filled
        dense
      />
      <div>
        <q-input
          v-model="maxDistanceBetweenAppointments"
          label="Maximum distance between appointments"
          filled
          dense
        />
        <div class="body-text-caption text-left">
          appointment ending estimation + travel time + buffer time = next
          appointment start time
        </div>
      </div>
      <div>
        <q-checkbox
          label="Track travel distance"
          v-model="trackTravelDistance"
        />
      </div>
    </q-card-section>
    <q-card-section class="text-center">
      <q-btn flat no-caps label="Save SmartSchedule" class="primary-button" />
    </q-card-section>
  </div>
</template>

<script>
export default {
  name: "SettingsController",
  data() {
    return {
      maxNumOfAppointments: 0,
      maxDistanceBetweenAppointments: 0,
      trackTravelDistance: false,
    };
  },
};
</script>
