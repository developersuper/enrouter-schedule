<template>
  <div class="q-px-md q-mt-xs calendar-list-item clickable">
    <q-item class="br-10">
      <q-item-section>
        <div>
          {{
            new Date(event.date).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            })
          }}
        </div>
      </q-item-section>
      <q-item-section>
        <div>{{ event.startTime }}</div>
      </q-item-section>
      <q-item-section class="row">
        <div>{{ event.zipcode }}</div>
      </q-item-section>
      <q-item-section side>
        <div>
          <span class="duration-display">{{ event.duration.label }}</span>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: "CalendarListItem",
  props: {
    event: {
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
  border-radius: 10px;
}

.calendar-list-item:hover {
  transform: translateY(-2px) scale(1.02);
}
</style>
