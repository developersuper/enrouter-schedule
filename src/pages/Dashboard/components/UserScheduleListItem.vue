<template>
  <div class="q-px-md q-mt-xs calendar-list-item clickable">
    <q-item class="br-10">
      <q-item-section>
        <div>{{ availability.startTime }} to {{ availability.endTime }}</div>
      </q-item-section>
      <q-item-section class="row">
        <div v-for="item in availability.areas">
          {{ item.locations }}
        </div>
      </q-item-section>
      <q-item-section>
        <!-- <div>{{ availability.meetingDuration.label }}</div> -->
      </q-item-section>
      <div class="row">
        <q-btn round color="primary" icon="las la-pen" />
        <div style="width: 20px"></div>
        <q-btn
          round
          color="primary"
          icon="delete"
          @click="removeScheduleByID(id)"
        />
      </div>
    </q-item>
  </div>
</template>

<script>
export default {
  name: "UserScheduleListItem",
  props: {
    availability: {
      type: Array,
      required: true,
    },
  },
  methods: {
    ConvertDuration(duration) {
      //if duration includes the text 'hour' then take the first digit and multiply by 60
      //otherwise, parse at the space and take the first index
      if (duration.includes("hour")) {
        return parseInt(duration[0]) * 60;
      } else {
        return parseInt(duration.split(" ")[0]);
      }
    },
  },
};
</script>

<style scoped>
.duration-display {
  color: #006bff;
  background: #006bff20;
  padding: 5px;
  border-radius: 100%;
}

.calendar-list-item:hover {
  transform: translateY(-2px) scale(1.02);
}
</style>
