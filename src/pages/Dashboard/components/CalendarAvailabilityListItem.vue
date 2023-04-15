<template>
  <div class="q-px-md q-mt-xs calendar-list-item clickable">
    <q-item class="br-10">
      <q-item-section>
        <div>
          {{
            new Date(date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            })
          }}
        </div>
      </q-item-section>
      <q-item-section class="text-left">
        <div>{{ event.startTime }} : {{ event.endTime }}</div>
      </q-item-section>
      <q-item-section side>
        <div class="row">
          <div>
            <span
              v-if="event.smart && !booking"
              class="duration-display q-mr-sm"
              >Smart</span
            >
          </div>
          <div>
            <span class="duration-display">{{
              event.meetingDuration.label
            }}</span>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: "CalendarAvailabilityListItem",
  props: {
    event: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    booking: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    ConvertDuration(duration) {
      //if duration includes the text 'hour' then take the first digit and multiply by 60
      //otherwise, parse at the space and take the first index
      if (duration.includes("hour")) return parseInt(duration[0]) * 60;
      else return parseInt(duration.split(" ")[0]);
    },
  },
};
</script>

<style scoped>
.duration-display {
  color: #006bff;
  background: #006bff20;
  padding: 5px;
  border-radius: 10px;
}

.calendar-list-item:hover {
  transform: translateY(-2px) scale(1.02);
}
</style>
